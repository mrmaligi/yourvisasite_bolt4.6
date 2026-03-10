/**
 * Supabase service for tracker data
 */

import { supabase } from '../lib/supabase';
import { calculateEMA, detectOutliersIQR } from './tracker-stats';

export interface TimelineEntry {
  id: string;
  visa_subclass: string;
  anzsco_code: string;
  location: 'onshore' | 'offshore';
  date_lodged: string;
  date_granted: string;
  processing_days: number;
  had_medicals: boolean;
  had_s56: boolean;
  source: string;
  verified: boolean;
  submitted_at: string;
}

export interface TimelineStats {
  visa_subclass: string;
  anzsco_code: string;
  location: string;
  total_entries: number;
  avg_days: number;
  median_days: number;
  min_days: number;
  max_days: number;
  recent_avg_days: number;
}

/**
 * Fetch all timeline entries from database
 */
export async function fetchTimelineEntries(
  filters?: {
    visa_subclass?: string;
    anzsco_code?: string;
    location?: 'onshore' | 'offshore';
  }
): Promise<TimelineEntry[]> {
  let query = supabase
    .from('visa_timelines')
    .select('*')
    .eq('verified', true)
    .eq('flagged', false)
    .order('submitted_at', { ascending: false });
  
  if (filters?.visa_subclass) {
    query = query.eq('visa_subclass', filters.visa_subclass);
  }
  if (filters?.anzsco_code) {
    query = query.eq('anzsco_code', filters.anzsco_code);
  }
  if (filters?.location) {
    query = query.eq('location', filters.location);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching timelines:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Fetch pre-calculated statistics
 */
export async function fetchTimelineStats(
  visa_subclass?: string,
  anzsco_code?: string,
  location?: string
): Promise<TimelineStats | null> {
  let query = supabase
    .from('timeline_stats')
    .select('*');
  
  if (visa_subclass) {
    query = query.eq('visa_subclass', visa_subclass);
  }
  if (anzsco_code) {
    query = query.eq('anzsco_code', anzsco_code);
  }
  if (location) {
    query = query.eq('location', location);
  }
  
  const { data, error } = await query.single();
  
  if (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
  
  return data;
}

/**
 * Calculate real-time prediction with IQR and EMA
 */
export async function calculatePrediction(
  visa_subclass: string,
  anzsco_code?: string,
  location?: 'onshore' | 'offshore'
): Promise<{
  estimate: number;
  confidence: number;
  range: { min: number; max: number };
  sampleSize: number;
  recentAvg: number;
}> {
  // Fetch raw data
  const entries = await fetchTimelineEntries({
    visa_subclass,
    anzsco_code,
    location
  });
  
  if (entries.length === 0) {
    return {
      estimate: 0,
      confidence: 0,
      range: { min: 0, max: 0 },
      sampleSize: 0,
      recentAvg: 0
    };
  }
  
  // Convert to format for IQR/EMA
  const dataPoints = entries.map(e => ({
    ...e,
    submittedAt: new Date(e.submitted_at),
    processingDays: e.processing_days
  }));
  
  // Remove outliers using IQR
  const { cleaned, outliers } = detectOutliersIQR(dataPoints);
  
  // Calculate EMA (weighted to recent data)
  const estimate = calculateEMA(cleaned, 60);
  
  // Calculate confidence based on sample size and outlier rate
  const outlierRate = outliers.length / entries.length;
  const sampleSizeScore = Math.min(entries.length / 100, 1);
  const confidence = Math.round((1 - outlierRate) * 0.5 + sampleSizeScore * 0.5) * 100;
  
  // Calculate range (80% confidence interval)
  const values = cleaned.map(d => d.processing_days);
  const stdDev = calculateStdDev(values);
  const range = {
    min: Math.max(1, Math.round(estimate - 1.28 * stdDev)),
    max: Math.round(estimate + 1.28 * stdDev)
  };
  
  // Recent average (last 60 days)
  const recentEntries = cleaned.filter(e => {
    const daysAgo = (Date.now() - new Date(e.submitted_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 60;
  });
  const recentAvg = recentEntries.length > 0
    ? Math.round(recentEntries.reduce((a, b) => a + b.processing_days, 0) / recentEntries.length)
    : estimate;
  
  return {
    estimate,
    confidence: Math.min(confidence, 95),
    range,
    sampleSize: cleaned.length,
    recentAvg
  };
}

function calculateStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Submit new timeline entry
 */
export async function submitTimeline(entry: {
  visa_subclass: string;
  anzsco_code: string;
  location: 'onshore' | 'offshore';
  date_lodged: string;
  date_granted: string;
  had_medicals: boolean;
  had_s56: boolean;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const processing_days = Math.round(
    (new Date(entry.date_granted).getTime() - new Date(entry.date_lodged).getTime()) 
    / (1000 * 60 * 60 * 24)
  );
  
  const { error } = await supabase
    .from('visa_timelines')
    .insert({
      ...entry,
      processing_days,
      source: 'user',
      verified: false,
      submitted_at: new Date().toISOString()
    });
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Get ANZSCO statistics for a visa type
 */
export async function getANZSCOStatsForVisa(visa_subclass: string): Promise<{
  code: string;
  count: number;
  avgDays: number;
}>[] {
  const { data, error } = await supabase
    .from('timeline_stats')
    .select('anzsco_code, total_entries, avg_days')
    .eq('visa_subclass', visa_subclass)
    .order('total_entries', { ascending: false });
  
  if (error || !data) return [];
  
  return data
    .filter(d => d.anzsco_code !== 'N/A')
    .map(d => ({
      code: d.anzsco_code,
      count: d.total_entries,
      avgDays: Math.round(d.avg_days)
    }));
}

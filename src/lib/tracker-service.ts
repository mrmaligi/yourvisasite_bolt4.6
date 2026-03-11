/**
 * Supabase service for tracker data
 */

import { supabase } from '../lib/supabase';
import { calculateEMA, detectOutliersIQR } from './tracker-stats';

export interface TimelineEntry {
  id: string;
  visaSubclass: string;
  anzscoCode: string;
  location: 'onshore' | 'offshore';
  dateLodged: string;
  dateGranted: string;
  processingDays: number;
  hadMedicals: boolean;
  hadS56: boolean;
  source: string;
  isVerified: boolean;
  submittedAt: string;
}

export interface TimelineStats {
  visaSubclass: string;
  anzscoCode: string;
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
    visaSubclass?: string;
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
  
  if (filters?.visaSubclass) {
    query = query.eq('visa_subclass', filters.visaSubclass);
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
  visaSubclass?: string,
  anzsco_code?: string,
  location?: string
): Promise<TimelineStats | null> {
  let query = supabase
    .from('timeline_stats')
    .select('*');
  
  if (visaSubclass) {
    query = query.eq('visa_subclass', visaSubclass);
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
  visaSubclass: string,
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
    visaSubclass,
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
  const dataPoints = entries.map((e: any) => ({
    ...e,
    submittedAt: new Date(e.submittedAt),
    processingDays: e.processingDays
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
  const values = cleaned.map(d => d.processingDays);
  const stdDev = calculateStdDev(values);
  const range = {
    min: Math.max(1, Math.round(estimate - 1.28 * stdDev)),
    max: Math.round(estimate + 1.28 * stdDev)
  };
  
  // Recent average (last 60 days)
  const recentEntries = cleaned.filter(e => {
    const daysAgo = (Date.now() - new Date(e.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 60;
  });
  const recentAvg = recentEntries.length > 0
    ? Math.round(recentEntries.reduce((a, b) => a + b.processingDays, 0) / recentEntries.length)
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
  visaSubclass: string;
  anzscoCode: string;
  location: 'onshore' | 'offshore';
  dateLodged: string;
  dateGranted: string;
  hadMedicals: boolean;
  hadS56: boolean;
  notes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const processing_days = Math.round(
    (new Date(entry.dateGranted).getTime() - new Date(entry.dateLodged).getTime())
    / (1000 * 60 * 60 * 24)
  );
  
  const { error } = await supabase
    .from('visa_timelines')
    .insert({
      visa_subclass: entry.visaSubclass,
      anzsco_code: entry.anzscoCode,
      location: entry.location,
      date_lodged: entry.dateLodged,
      date_granted: entry.dateGranted,
      had_medicals: entry.hadMedicals,
      had_s56: entry.hadS56,
      notes: entry.notes,
      source: 'user',
      is_verified: false,
      processing_days,
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
export async function getANZSCOStatsForVisa(visaSubclass: string): Promise<Array<{
  code: string;
  count: number;
  avgDays: number;
}>> {
  const { data, error } = await supabase
    .from('timeline_stats')
    .select('anzsco_code, total_entries, avg_days')
    .eq('visa_subclass', visaSubclass)
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

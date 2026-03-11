/**
 * AusVisa Community Tracker - Statistical Algorithms
 * 
 * IQR (Interquartile Range) - For anomaly detection
 * EMA (Exponential Moving Average) - For predictive estimates
 */

export interface TimelineEntry {
  id: string;
  visaSubclass: string;
  anzscoCode: string;
  location: 'onshore' | 'offshore';
  points?: number;
  dateLodged: Date;
  dateGranted: Date;
  processingDays: number;
  hadMedicals: boolean;
  hadS56: boolean;
  submittedAt: Date;
}

/**
 * Calculate Interquartile Range (IQR) for anomaly detection
 * Returns outliers that should be flagged
 */
export function detectOutliersIQR(
  data: TimelineEntry[],
  field: keyof TimelineEntry = 'processingDays'
): { cleaned: TimelineEntry[]; outliers: TimelineEntry[] } {
  if (data.length < 4) return { cleaned: data, outliers: [] };

  const values = data.map(d => Number(d[field])).sort((a, b) => a - b);
  
  // Calculate Q1 (25th percentile) and Q3 (75th percentile)
  const q1Index = Math.floor(values.length * 0.25);
  const q3Index = Math.floor(values.length * 0.75);
  const q1 = values[q1Index];
  const q3 = values[q3Index];
  
  // Calculate IQR
  const iqr = q3 - q1;
  
  // Define bounds (1.5 * IQR rule)
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  // Separate outliers
  const cleaned: TimelineEntry[] = [];
  const outliers: TimelineEntry[] = [];
  
  data.forEach(entry => {
    const value = Number(entry[field]);
    if (value < lowerBound || value > upperBound) {
      outliers.push({ ...entry, flagged: true as any });
    } else {
      cleaned.push(entry);
    }
  });
  
  return { cleaned, outliers };
}

/**
 * Calculate Exponential Moving Average (EMA)
 * Gives more weight to recent data points
 */
export function calculateEMA(
  data: TimelineEntry[],
  days: number = 30,
  field: keyof TimelineEntry = 'processingDays'
): number {
  if (data.length === 0) return 0;
  
  // Filter to recent entries
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentData = data
    .filter(d => new Date(d.submittedAt) >= cutoffDate)
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
  
  if (recentData.length === 0) {
    // Fallback to all data if no recent entries
    return calculateSimpleAverage(data, field);
  }
  
  // EMA calculation with smoothing factor
  const smoothing = 2 / (recentData.length + 1);
  let ema = Number(recentData[0][field]);
  
  for (let i = 1; i < recentData.length; i++) {
    const value = Number(recentData[i][field]);
    ema = (value * smoothing) + (ema * (1 - smoothing));
  }
  
  return Math.round(ema);
}

/**
 * Calculate simple average (fallback)
 */
export function calculateSimpleAverage(
  data: TimelineEntry[],
  field: keyof TimelineEntry = 'processingDays'
): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, d) => acc + Number(d[field]), 0);
  return Math.round(sum / data.length);
}

/**
 * Filter entries by ANZSCO code (profession)
 */
export function filterByANZSCO(
  data: TimelineEntry[],
  anzscoCode: string
): TimelineEntry[] {
  return data.filter(d => d.anzscoCode === anzscoCode);
}

/**
 * Get unique ANZSCO codes with counts
 */
export function getANZSCOStats(data: TimelineEntry[]): { code: string; count: number; avgDays: number }[] {
  const stats: Record<string, { count: number; totalDays: number }> = {};
  
  data.forEach(entry => {
    if (!stats[entry.anzscoCode]) {
      stats[entry.anzscoCode] = { count: 0, totalDays: 0 };
    }
    stats[entry.anzscoCode].count++;
    stats[entry.anzscoCode].totalDays += entry.processingDays;
  });
  
  return Object.entries(stats)
    .map(([code, { count, totalDays }]) => ({
      code,
      count,
      avgDays: Math.round(totalDays / count)
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate confidence score based on data quality
 */
export function calculateConfidenceScore(
  data: TimelineEntry[],
  outliers: TimelineEntry[]
): number {
  if (data.length === 0) return 0;
  
  const outlierRate = outliers.length / data.length;
  const sampleSizeScore = Math.min(data.length / 100, 1); // Max at 100 samples
  const recencyScore = calculateRecencyScore(data);
  
  // Weighted confidence
  const confidence = (
    (1 - outlierRate) * 0.4 +      // 40% - low outlier rate
    sampleSizeScore * 0.4 +         // 40% - sufficient sample size
    recencyScore * 0.2              // 20% - recent data
  ) * 100;
  
  return Math.round(confidence);
}

function calculateRecencyScore(data: TimelineEntry[]): number {
  if (data.length === 0) return 0;
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentCount = data.filter(d => 
    new Date(d.submittedAt) >= thirtyDaysAgo
  ).length;
  
  return Math.min(recentCount / 10, 1); // Max at 10 recent entries
}

/**
 * Group data by visa subclass
 */
export function groupByVisaType(data: TimelineEntry[]): Record<string, TimelineEntry[]> {
  return data.reduce((acc, entry) => {
    if (!acc[entry.visaSubclass]) {
      acc[entry.visaSubclass] = [];
    }
    acc[entry.visaSubclass].push(entry);
    return acc;
  }, {} as Record<string, TimelineEntry[]>);
}

/**
 * Generate predictive estimate with confidence interval
 */
export function generatePrediction(
  data: TimelineEntry[],
  filters?: {
    visaSubclass?: string;
    anzscoCode?: string;
    location?: 'onshore' | 'offshore';
  }
): {
  estimate: number;
  confidence: number;
  range: { min: number; max: number };
  sampleSize: number;
} {
  let filteredData = [...data];
  
  // Apply filters
  if (filters?.visaSubclass) {
    filteredData = filteredData.filter(d => d.visaSubclass === filters.visaSubclass);
  }
  if (filters?.anzscoCode) {
    filteredData = filteredData.filter(d => d.anzscoCode === filters.anzscoCode);
  }
  if (filters?.location) {
    filteredData = filteredData.filter(d => d.location === filters.location);
  }
  
  // Detect and remove outliers
  const { cleaned, outliers } = detectOutliersIQR(filteredData);
  
  // Calculate EMA estimate
  const estimate = calculateEMA(cleaned, 60);
  
  // Calculate confidence
  const confidence = calculateConfidenceScore(cleaned, outliers);
  
  // Calculate prediction range (80% confidence interval)
  const stdDev = calculateStdDev(cleaned);
  const range = {
    min: Math.max(1, Math.round(estimate - 1.28 * stdDev)),
    max: Math.round(estimate + 1.28 * stdDev)
  };
  
  return {
    estimate,
    confidence,
    range,
    sampleSize: cleaned.length
  };
}

function calculateStdDev(data: TimelineEntry[]): number {
  if (data.length < 2) return 0;
  
  const values = data.map(d => d.processingDays);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  
  return Math.sqrt(avgSquaredDiff);
}

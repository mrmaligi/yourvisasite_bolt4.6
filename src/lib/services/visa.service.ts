import { VisaRepository, type VisaFilters, type VisaWithStats } from '../repositories/visa.repository';
import { globalCache } from '../cache/memory.cache';
import { errorHandler } from '../errors/handler';
import type { Visa, TrackerStats, TrackerEntry } from '../../types/database';

export class VisaService {
  private repository: VisaRepository;

  constructor() {
    this.repository = new VisaRepository();
  }

  async getVisas(filters: VisaFilters = {}): Promise<{ visas: VisaWithStats[]; total: number }> {
    try {
      // Create a cache key based on filters
      const cacheKey = `visas-${JSON.stringify(filters)}`;

      return await globalCache.getOrSet(cacheKey, async () => {
        const { data, count, error } = await this.repository.findAll(filters);
        if (error) throw error;
        return { visas: data, total: count || 0 };
      }, 5 * 60 * 1000); // 5 minutes cache
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getVisa(id: string): Promise<VisaWithStats | null> {
    try {
      const cacheKey = `visa-${id}`;
      return await globalCache.getOrSet(cacheKey, async () => {
        const { data, error } = await this.repository.findById(id);
        if (error) throw error;
        return data;
      });
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getTrackerStats(): Promise<(Visa & { tracker_stats: TrackerStats })[]> {
    try {
      const cacheKey = 'tracker-stats';
      return await globalCache.getOrSet(cacheKey, async () => {
        const { data, error } = await this.repository.getTrackerStats();
        if (error) throw error;
        return data;
      }, 10 * 60 * 1000); // 10 minutes cache
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async getTrackerEntries(visaId: string): Promise<TrackerEntry[]> {
    try {
      const cacheKey = `tracker-entries-${visaId}`;
      return await globalCache.getOrSet(cacheKey, async () => {
        const { data, error } = await this.repository.findTrackerEntries(visaId);
        if (error) throw error;
        return data;
      }, 5 * 60 * 1000); // 5 minutes cache
    } catch (error) {
      throw errorHandler(error);
    }
  }
}

export const visaService = new VisaService();

import { PremiumRepository } from '../repositories/premium.repository';
import { VisaRepository } from '../repositories/visa.repository';
import { errorHandler } from '../errors/handler';
import type { VisaPremiumContent, Visa } from '../../types/database';

export class PremiumService {
  private repository: PremiumRepository;
  private visaRepository: VisaRepository;

  constructor() {
    this.repository = new PremiumRepository();
    this.visaRepository = new VisaRepository();
  }

  async getPremiumContent(visaId: string): Promise<{ content: VisaPremiumContent[]; visa: Visa | null }> {
    try {
      const [contentResult, visaResult] = await Promise.all([
        this.repository.findByVisaId(visaId),
        this.visaRepository.findById(visaId)
      ]);

      if (contentResult.error) throw contentResult.error;
      if (visaResult.error) throw visaResult.error;

      return {
        content: contentResult.data,
        visa: visaResult.data
      };
    } catch (error) {
      throw errorHandler(error);
    }
  }

  async isPurchased(userId: string | undefined, visaId: string): Promise<boolean> {
      // Logic from hook: "Premium content is now free for everyone"
      return true;
  }
}

export const premiumService = new PremiumService();

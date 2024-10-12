import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from './grants.entity';

@Injectable()
export class GrantsService {
  constructor(
    @InjectRepository(Grant)
    private grantsRepository: Repository<Grant>,
  ) {}

  findAll(tenantId: string): Promise<Grant[]> {
    return this.grantsRepository.find({ where: { tenantId } });
  }

  async approveGrant(
    id: string,
    tenantId: string,
    feedback?: string,
  ): Promise<Grant> {
    const grant = await this.grantsRepository.findOne({
      where: { id, tenantId },
    });
    if (grant) {
      grant.isApproved = true;
      grant.feedback = feedback;
      return this.grantsRepository.save(grant);
    }
    throw new Error('Grant not found or unauthorized access');
  }

  async rejectGrant(id: string, tenantId: string): Promise<Grant> {
    const grant = await this.grantsRepository.findOne({
      where: { id, tenantId },
    });
    if (grant) {
      await this.grantsRepository.remove(grant);
      return grant;
    }
    throw new Error('Grant not found or unauthorized access');
  }
}

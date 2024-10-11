import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from './grant.entity';

@Injectable()
export class GrantsService {
  constructor(
    @InjectRepository(Grant)
    private grantsRepository: Repository<Grant>,
  ) {}

  findAll(): Promise<Grant[]> {
    return this.grantsRepository.find();
  }

  async approveGrant(id: string, feedback?: string): Promise<Grant> {
    const grant = await this.grantsRepository.findOne({ where: { id } });
    if (grant) {
      grant.isApproved = true;
      grant.feedback = feedback;
      await this.grantsRepository.save(grant);
    }
    return grant;
  }

  async rejectGrant(id: string): Promise<Grant> {
    const grant = await this.grantsRepository.findOne({ where: { id } });
    if (grant) {
      await this.grantsRepository.remove(grant);
    }
    return grant;
  }
}

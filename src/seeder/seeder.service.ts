import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grant } from 'src/grants/grants.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(Grant)
    private readonly grantsRepository: Repository<Grant>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'local') {
      this.logger.log('Running database seeder...');
      await this.seed();
    }
  }

  async seed() {
    // Step 1: Clear existing data
    await this.clearDatabase();

    // Step 2: Insert example data
    await this.createGrants();
  }

  async clearDatabase() {
    await this.grantsRepository.clear();
    this.logger.log('Cleared existing data from the database.');
  }

  async createGrants() {
    const grants = [
      {
        title: 'Community Support Grant',
        description: 'A grant for community support initiatives.',
        isApproved: false,
        feedback: 'Needs more details',
      },
      {
        title: 'Innovation Grant',
        description: 'A grant for innovative projects in technology.',
        isApproved: true,
        feedback: 'Looks good',
      },
      {
        title: 'Research Grant',
        description: 'A grant for academic research projects.',
        isApproved: false,
      },
    ];

    await this.grantsRepository.save(grants);
    this.logger.log('Seeded the database with example grants.');
  }
}

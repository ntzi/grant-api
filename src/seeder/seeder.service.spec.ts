import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from '../grants/grants.entity';

describe('SeederService', () => {
  let service: SeederService;
  let repository: Repository<Grant>;

  const tenantId = 'example-tenant-1';

  const grantArray = [
    {
      id: '1',
      title: 'Grant A',
      description: 'Description A',
      isApproved: false,
      tenantId,
    },
    {
      id: '2',
      title: 'Grant B',
      description: 'Description B',
      isApproved: true,
      tenantId,
    },
  ];

  const grantRepositoryMock = {
    clear: jest.fn(),
    save: jest.fn().mockResolvedValue(grantArray),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeederService,
        {
          provide: getRepositoryToken(Grant),
          useValue: grantRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<SeederService>(SeederService);
    repository = module.get<Repository<Grant>>(getRepositoryToken(Grant));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should clear the database and seed example data', async () => {
      await service.seed();

      expect(repository.clear).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith([
        {
          title: 'Community Support Grant',
          description: 'Supports local community projects.',
          isApproved: false,
          tenantId: 'example-tenant-1',
        },
        {
          title: 'Tech Innovation Grant',
          description: 'Funds innovative tech projects.',
          isApproved: true,
          tenantId: 'example-tenant-1',
        },
      ]);
    });
  });
});

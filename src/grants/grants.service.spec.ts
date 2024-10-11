import { Test, TestingModule } from '@nestjs/testing';
import { GrantsService } from './grants.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grant } from './grant.entity';
import { v4 as uuid } from 'uuid';

describe('GrantsService', () => {
  let service: GrantsService;
  let repository: Repository<Grant>;

  const grantArray = [
    {
      id: uuid(),
      title: 'Grant A',
      description: 'Description A',
      isApproved: false,
    },
    {
      id: uuid(),
      title: 'Grant B',
      description: 'Description B',
      isApproved: true,
    },
  ];

  const grantRepositoryMock = {
    find: jest.fn().mockResolvedValue(grantArray),
    findOne: jest.fn().mockResolvedValue(grantArray[0]),
    save: jest.fn().mockResolvedValue(grantArray[0]),
    remove: jest.fn().mockResolvedValue(grantArray[0]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrantsService,
        {
          provide: getRepositoryToken(Grant),
          useValue: grantRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<GrantsService>(GrantsService);
    repository = module.get<Repository<Grant>>(getRepositoryToken(Grant));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of grants', async () => {
      const grants = await service.findAll();
      expect(grants).toEqual(grantArray);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('approveGrant', () => {
    it('should approve a grant and save it', async () => {
      const grant = {
        ...grantArray[0],
        isApproved: true,
        feedback: 'Looks good',
      };
      grantRepositoryMock.findOne.mockResolvedValue(grantArray[0]);
      grantRepositoryMock.save.mockResolvedValue(grant);

      const result = await service.approveGrant(grant.id, 'Looks good');
      expect(result).toEqual(grant);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: grant.id },
      });
      expect(repository.save).toHaveBeenCalledWith(grant);
    });
  });

  describe('rejectGrant', () => {
    it('should remove a grant', async () => {
      const grant = grantArray[0];
      grantRepositoryMock.findOne.mockResolvedValue(grant);

      const result = await service.rejectGrant(grant.id);
      expect(result).toEqual(grant);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: grant.id },
      });
      expect(repository.remove).toHaveBeenCalledWith(grant);
    });
  });
});

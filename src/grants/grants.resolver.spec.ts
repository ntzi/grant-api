import { Test, TestingModule } from '@nestjs/testing';
import { GrantsResolver } from './grants.resolver';
import { GrantsService } from './grants.service';
import { Grant } from './grants.model';

describe('GrantsResolver', () => {
  let resolver: GrantsResolver;
  let service: GrantsService;

  const mockGrantsService = {
    findAll: jest.fn(),
    approveGrant: jest.fn(),
    rejectGrant: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrantsResolver,
        {
          provide: GrantsService,
          useValue: mockGrantsService,
        },
      ],
    }).compile();

    resolver = module.get<GrantsResolver>(GrantsResolver);
    service = module.get<GrantsService>(GrantsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAllGrants', () => {
    it('should return an array of grants', async () => {
      const grants: Grant[] = [
        {
          id: '1',
          title: 'Grant A',
          description: 'Description A',
          isApproved: false,
        },
        {
          id: '2',
          title: 'Grant B',
          description: 'Description B',
          isApproved: true,
        },
      ];
      mockGrantsService.findAll.mockReturnValue(grants);

      const result = await resolver.getAllGrants();
      expect(result).toEqual(grants);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('approveGrant', () => {
    it('should approve a grant and return it', async () => {
      const grant: Grant = {
        id: '1',
        title: 'Grant A',
        description: 'Description A',
        isApproved: true,
        feedback: 'Looks good',
      };
      mockGrantsService.approveGrant.mockReturnValue(grant);

      const result = await resolver.approveGrant('1', 'Looks good');
      expect(result).toEqual(grant);
      expect(service.approveGrant).toHaveBeenCalledWith('1', 'Looks good');
    });
  });

  describe('rejectGrant', () => {
    it('should reject a grant and return it', async () => {
      const grant: Grant = {
        id: '2',
        title: 'Grant B',
        description: 'Description B',
        isApproved: false,
        feedback: 'Not suitable',
      };
      mockGrantsService.rejectGrant.mockReturnValue(grant);

      const result = await resolver.rejectGrant('2');
      expect(result).toEqual(grant);
      expect(service.rejectGrant).toHaveBeenCalledWith('2');
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { GrantsResolver } from './grants.resolver';
import { GrantsService } from './grants.service';
import { Grant } from './grants.entity';

describe('GrantsResolver', () => {
  let resolver: GrantsResolver;
  let service: GrantsService;

  const mockGrantsService = {
    findAll: jest.fn(),
    approveGrant: jest.fn(),
    rejectGrant: jest.fn(),
  };

  const tenantId = 'example-tenant-1';

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
    it('should return an array of grants for a tenant', async () => {
      const grants: Grant[] = [
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
      mockGrantsService.findAll.mockResolvedValue(grants);

      const context = { req: { headers: { 'tenant-id': tenantId } } };
      const result = await resolver.getAllGrants(context);

      expect(result).toEqual(grants);
      expect(service.findAll).toHaveBeenCalledWith(tenantId);
    });
  });

  describe('approveGrant', () => {
    it('should approve a grant for the given tenant', async () => {
      const grant: Grant = {
        id: '1',
        title: 'Grant A',
        description: 'Description A',
        isApproved: true,
        feedback: 'Looks good',
        tenantId,
      };
      mockGrantsService.approveGrant.mockResolvedValue(grant);

      const context = { req: { headers: { 'tenant-id': tenantId } } };
      const result = await resolver.approveGrant('1', 'Looks good', context);

      expect(result).toEqual(grant);
      expect(service.approveGrant).toHaveBeenCalledWith(
        '1',
        tenantId,
        'Looks good',
      );
    });
  });

  describe('rejectGrant', () => {
    it('should remove a grant for the given tenant', async () => {
      const grant: Grant = {
        id: '2',
        title: 'Grant B',
        description: 'Description B',
        isApproved: false,
        tenantId,
      };
      mockGrantsService.rejectGrant.mockResolvedValue(grant);

      const context = { req: { headers: { 'tenant-id': tenantId } } };
      const result = await resolver.rejectGrant('2', context);

      expect(result).toEqual(grant);
      expect(service.rejectGrant).toHaveBeenCalledWith('2', tenantId);
    });
  });
});

import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { GrantsService } from './grants.service';
import { Grant } from './grants.entity';

@Resolver(() => Grant)
export class GrantsResolver {
  constructor(private readonly grantsService: GrantsService) {}

  @Query(() => [Grant], { name: 'grants' })
  getAllGrants(@Context() context: any) {
    const tenantId = context.req.headers['tenant-id'];
    return this.grantsService.findAll(tenantId);
  }

  @Mutation(() => Grant)
  approveGrant(
    @Args('id') id: string,
    @Args('feedback', { nullable: true }) feedback: string,
    @Context() context: any,
  ) {
    const tenantId = context.req.headers['tenant-id'];
    return this.grantsService.approveGrant(id, tenantId, feedback);
  }

  @Mutation(() => Grant)
  rejectGrant(@Args('id') id: string, @Context() context: any) {
    const tenantId = context.req.headers['tenant-id'];
    return this.grantsService.rejectGrant(id, tenantId);
  }
}

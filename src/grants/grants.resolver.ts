import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { GrantsService } from './grants.service';
import { Grant } from './grants.entity';

@Resolver(() => Grant)
export class GrantsResolver {
  constructor(private readonly grantsService: GrantsService) {}

  @Query(() => [Grant], { name: 'grants' })
  getAllGrants() {
    return this.grantsService.findAll();
  }

  @Mutation(() => Grant)
  approveGrant(
    @Args('id') id: string,
    @Args('feedback', { nullable: true }) feedback: string,
  ) {
    return this.grantsService.approveGrant(id, feedback);
  }

  @Mutation(() => Grant)
  rejectGrant(@Args('id') id: string) {
    return this.grantsService.rejectGrant(id);
  }
}

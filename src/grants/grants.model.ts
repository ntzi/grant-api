import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Grant {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  isApproved: boolean;

  @Field({ nullable: true })
  feedback?: string;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Grant {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column({ default: false })
  isApproved: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  feedback?: string;

  @Field()
  @Column()
  tenantId: string; // This column will store the tenant ID for each grant
}

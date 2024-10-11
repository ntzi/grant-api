import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrantsService } from './grants.service';
import { GrantsResolver } from './grants.resolver';
import { Grant } from './grants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grant])],
  providers: [GrantsService, GrantsResolver],
})
export class GrantsModule {}

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './orm.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class OrmModule {}

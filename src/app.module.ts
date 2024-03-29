import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmModule } from './db/orm/orm.module';
import { ConfigModule } from '@nestjs/config';
import { AppLoggerMiddleware } from 'src/common/logger/request-response.logger';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/core/user/user.module';
import { ProductModule } from 'src/core/product/product.module';
import { OrderModule } from 'src/core/order/order.module';
import { CategoryModule } from 'src/core/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrmModule,
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

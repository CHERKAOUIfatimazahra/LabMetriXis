import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? { isGlobal: true }
        : { envFilePath: '.env', isGlobal: true },
    ),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
  ],
})
export class AppModule {}

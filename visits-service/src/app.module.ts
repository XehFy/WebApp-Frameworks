import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GymVisit } from './gym-visit.entity';
import { JwtStrategy } from './auth/jwt.strategy';
import { VisitsRepository } from './visits.repository';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtLoggerInterceptor } from './jwt-logger.interceptor';

@Module({
  imports: [
    // 1. ConfigModule должен быть ПЕРВЫМ
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Асинхронная настройка TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [GymVisit],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    // 3. Настройка JWT модуля
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([GymVisit]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    VisitsRepository,
    JwtStrategy, // Убрали ConfigService из providers
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtLoggerInterceptor,
    }
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
          const token = authHeader.replace('Bearer ', '');
          console.log('\n===== JWT DEBUG =====');
          console.log('Incoming Token:', token);
          console.log('Used JWT Secret Length:', process.env.JWT_SECRET?.length);
          console.log('Current Server Time:', new Date().toISOString());
        }
        next();
      })
      .forRoutes('*');
  }
}
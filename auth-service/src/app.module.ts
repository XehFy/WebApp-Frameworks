import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',  // Для локальной разработки
      port: parseInt(process.env.DB_PORT || '5432'),  // Ваш порт
      username: process.env.DB_USER || 'postgres',    // Ваш пользователь
      password: process.env.DB_PASSWORD || '',        // Пустой пароль
      database: process.env.DB_NAME || 'gymdb',
      entities: [User],  // Или [GymVisit] для visits-service
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
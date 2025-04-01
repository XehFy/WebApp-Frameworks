import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymVisit } from './gym-visit.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',  // Для локальной разработки
      port: parseInt(process.env.DB_PORT || '5432'),  // Ваш порт
      username: process.env.DB_USER || 'postgres',    // Ваш пользователь
      password: process.env.DB_PASSWORD || '',        // Пустой пароль
      database: process.env.DB_NAME || 'gymdb',
      entities: [GymVisit], 
      synchronize: true,
    }),
    TypeOrmModule.forFeature([GymVisit])
  ],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

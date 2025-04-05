import { Injectable, BadRequestException } from '@nestjs/common';
import { VisitsRepository } from './visits.repository';
import { GymVisit } from './gym-visit.entity';

@Injectable()
export class AppService {
  constructor(private readonly repo: VisitsRepository) {}

  async create(userId: string, data: Omit<GymVisit, 'id' | 'userId'>) {
    if (new Date(data.date) > new Date()) {
      throw new BadRequestException('Дата визита не может быть в будущем');
    }
    return this.repo.create({ ...data, userId });
  }

  async getByUser(userId: string) {
    return this.repo.findByUserId(userId);
  }

  async delete(userId: string, id: string) {
    return this.repo.delete(id, userId);
  }
}
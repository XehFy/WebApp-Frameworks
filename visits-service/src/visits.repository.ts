import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GymVisit } from './gym-visit.entity';

@Injectable()
export class VisitsRepository {
  constructor(
    @InjectRepository(GymVisit)
    private visitsRepository: Repository<GymVisit>,
  ) {}

  async createVisit(visitData: Partial<GymVisit>): Promise<GymVisit> {
    const visit = this.visitsRepository.create(visitData);
    return this.visitsRepository.save(visit);
  }

  async getUserVisits(userId: string): Promise<GymVisit[]> {
    return this.visitsRepository.find({ where: { userId } });
  }
}
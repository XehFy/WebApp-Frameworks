import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GymVisit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // Связь с пользователем

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  duration: number; // Продолжительность в минутах
}
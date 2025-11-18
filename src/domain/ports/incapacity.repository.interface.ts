import { Incapacity } from '../incapacity.entity';

export interface IncapacityRepositoryInterface {
  create(incapacity: Incapacity): Promise<Incapacity>;
  findAll(): Promise<Incapacity[]>;
  findById(id: number): Promise<Incapacity | null>;
  findByUserId(userId: number): Promise<Incapacity[]>;
  findByUserIdAndStartDate(userId: number, startDate: Date): Promise<Incapacity | null>;
  update(id: number, incapacity: Partial<Incapacity>): Promise<Incapacity | null>;
  delete(id: number): Promise<boolean>;
}

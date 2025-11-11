import { Incapacity } from '../incapacity.entity';

export interface IncapacityRepositoryInterface {
  create(incapacity: Incapacity): Promise<Incapacity>;
  findAll(): Promise<Incapacity[]>;
  findById(id: string): Promise<Incapacity | null>;
  findByUserId(userId: string): Promise<Incapacity[]>;
  update(id: string, incapacity: Partial<Incapacity>): Promise<Incapacity | null>;
  delete(id: string): Promise<boolean>;
}

import { Incapacity, IncapacityType, IncapacityStatus } from '../domain/incapacity.entity';
import { IncapacityRepositoryInterface } from '../domain/ports/incapacity.repository.interface';
import { CreateIncapacityRequest, UpdateIncapacityRequest } from './dto/incapacity.request';
import { UserModel } from '../domain/model/user.model';
import { CompanyModel } from '../domain/model/company.model';
import { PayrollModel } from '../domain/model/payroll.model';

export class IncapacityService {
  constructor(private readonly incapacityRepository: IncapacityRepositoryInterface) {}

  async createIncapacity(dto: CreateIncapacityRequest): Promise<Incapacity> {
    try {
      // Validar que el usuario exista
      const user = await UserModel.findByPk(dto.id_user);
      if (!user) {
        throw new Error(`Usuario con ID ${dto.id_user} no encontrado`);
      }

      // Validar que la nómina exista
      const payroll = await PayrollModel.findByPk(dto.id_payroll);
      if (!payroll) {
        throw new Error(`Nómina con ID ${dto.id_payroll} no encontrada`);
      }

      // Validar que la nómina pertenezca al usuario
      if (payroll.id_user !== dto.id_user) {
        throw new Error('La nómina no pertenece al usuario especificado');
      }

      const startDate = new Date(dto.start_date);
      const endDate = new Date(dto.end_date);

      const incapacity = new Incapacity(
        0, // Se asignará automáticamente por autoIncrement
        dto.id_user,
        dto.id_payroll,
        startDate,
        endDate,
        dto.type,
        IncapacityStatus.PENDIENTE,
        dto.observacion
      );

      return await this.incapacityRepository.create(incapacity);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create incapacity: ${error.message}`);
      }
      throw new Error('Failed to create incapacity: Unknown error');
    }
  }

  async getAllIncapacities(): Promise<Incapacity[]> {
    try {
      return await this.incapacityRepository.findAll();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve incapacities: ${error.message}`);
      }
      throw new Error('Failed to retrieve incapacities: Unknown error');
    }
  }

  async getIncapacitiesByUser(userId: number): Promise<Incapacity[]> {
    try {
      if (!userId || userId <= 0) {
        throw new Error('User ID is required');
      }
      return await this.incapacityRepository.findByUserId(userId);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve user incapacities: ${error.message}`);
      }
      throw new Error('Failed to retrieve user incapacities: Unknown error');
    }
  }

  async updateIncapacity(id: number, dto: UpdateIncapacityRequest): Promise<Incapacity> {
    try {
      if (!id || id <= 0) {
        throw new Error('Incapacity ID is required');
      }

      const existingIncapacity = await this.incapacityRepository.findById(id);
      if (!existingIncapacity) {
        throw new Error('Incapacity not found');
      }

      const updateData: Record<string, any> = {};

      if (dto.start_date) {
        updateData.start_date = new Date(dto.start_date);
      }

      if (dto.end_date) {
        updateData.end_date = new Date(dto.end_date);
      }

      if (dto.type) {
        if (!Object.values(IncapacityType).includes(dto.type)) {
          throw new Error('Invalid incapacity type');
        }
        updateData.type = dto.type;
      }

      if (dto.status) {
        const statusValue = dto.status as IncapacityStatus;
        if (!Object.values(IncapacityStatus).includes(statusValue)) {
          throw new Error('Invalid incapacity status');
        }
        updateData.status = statusValue;
      }

      if (dto.observacion !== undefined) {
        updateData.observacion = dto.observacion;
      }

      if (updateData.start_date && updateData.end_date) {
        if (updateData.end_date < updateData.start_date) {
          throw new Error('End date must be after start date');
        }
      } else if (updateData.start_date && existingIncapacity.end_date) {
        if (existingIncapacity.end_date < updateData.start_date) {
          throw new Error('End date must be after start date');
        }
      } else if (updateData.end_date && existingIncapacity.start_date) {
        if (updateData.end_date < existingIncapacity.start_date) {
          throw new Error('End date must be after start date');
        }
      }

      const updatedIncapacity = await this.incapacityRepository.update(id, updateData);
      if (!updatedIncapacity) {
        throw new Error('Failed to update incapacity');
      }

      return updatedIncapacity;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update incapacity: ${error.message}`);
      }
      throw new Error('Failed to update incapacity: Unknown error');
    }
  }
}

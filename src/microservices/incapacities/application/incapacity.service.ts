import { Incapacity, IncapacityType, IncapacityStatus } from '../domain/incapacity.entity';
import { IncapacityRepositoryInterface } from '../domain/ports/incapacity.repository.interface';
import { CreateIncapacityRequest, UpdateIncapacityRequest } from './dto/incapacity.request';
import { IncapacityResponse } from './dto/incapacity.response';
import { UserModel } from '../domain/model/user.model';
import { CompanyModel } from '../domain/model/company.model';
import { PayrollModel } from '../domain/model/payroll.model';
import { ValidationError } from '../../../shared/errors/ValidationError';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';

export class IncapacityService {
  constructor(private readonly incapacityRepository: IncapacityRepositoryInterface) {}

  async createIncapacity(dto: CreateIncapacityRequest): Promise<IncapacityResponse> {
    const user = await UserModel.findByPk(dto.id_user);
    if (!user) {
      throw new NotFoundError(`Usuario con ID ${dto.id_user} no encontrado`);
    }

    const payroll = await PayrollModel.findByPk(dto.id_payroll);
    if (!payroll) {
      throw new NotFoundError(`Nómina con ID ${dto.id_payroll} no encontrada`);
    }

    if (payroll.id_user !== dto.id_user) {
      throw new ValidationError('La nómina no pertenece al usuario especificado');
    }

    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);

    // Validar que no exista una incapacidad con la misma fecha de inicio para este usuario
    const existingIncapacity = await this.incapacityRepository.findByUserIdAndStartDate(
      dto.id_user,
      startDate
    );

    if (existingIncapacity) {
      throw new ConflictError('Ya existe una incapacidad radicada con esta fecha de inicio');
    }

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

    const createdIncapacity = await this.incapacityRepository.create(incapacity);
    return this.mapToResponse(createdIncapacity);
  }

  async getAllIncapacities(): Promise<IncapacityResponse[]> {
    const incapacities = await this.incapacityRepository.findAll();
    return incapacities.map(incapacity => this.mapToResponse(incapacity));
  }

  async getIncapacitiesByUser(userId: number): Promise<IncapacityResponse[]> {
    if (!userId || userId <= 0) {
      throw new ValidationError('User ID is required');
    }
    const incapacities = await this.incapacityRepository.findByUserId(userId);
    return incapacities.map(incapacity => this.mapToResponse(incapacity));
  }

  async updateIncapacity(id: number, dto: UpdateIncapacityRequest): Promise<IncapacityResponse> {
    this.validateIncapacityId(id);

    const existingIncapacity = await this.findExistingIncapacity(id);
    const updateData = this.buildUpdateData(dto);
    this.validateDateConsistency(updateData, existingIncapacity);

    const updatedIncapacity = await this.incapacityRepository.update(id, updateData);
    if (!updatedIncapacity) {
      throw new Error('Failed to update incapacity');
    }

    return this.mapToResponse(updatedIncapacity);
  }

  private validateIncapacityId(id: number): void {
    if (!id || id <= 0) {
      throw new ValidationError('Incapacity ID is required');
    }
  }

  private async findExistingIncapacity(id: number): Promise<Incapacity> {
    const existingIncapacity = await this.incapacityRepository.findById(id);
    if (!existingIncapacity) {
      throw new NotFoundError('Incapacity not found');
    }
    return existingIncapacity;
  }

  private buildUpdateData(dto: UpdateIncapacityRequest): Record<string, any> {
    const updateData: Record<string, any> = {};

    if (dto.start_date) {
      updateData.start_date = new Date(dto.start_date);
    }

    if (dto.end_date) {
      updateData.end_date = new Date(dto.end_date);
    }

    if (dto.type) {
      this.validateIncapacityType(dto.type);
      updateData.type = dto.type;
    }

    if (dto.status) {
      const statusValue = dto.status as IncapacityStatus;
      this.validateIncapacityStatus(statusValue);
      updateData.status = statusValue;
    }

    if (dto.observacion !== undefined) {
      updateData.observacion = dto.observacion;
    }

    return updateData;
  }

  private validateIncapacityType(type: IncapacityType): void {
    if (!Object.values(IncapacityType).includes(type)) {
      throw new ValidationError('Invalid incapacity type');
    }
  }

  private validateIncapacityStatus(status: IncapacityStatus): void {
    const statusValue = status as IncapacityStatus;
    if (!Object.values(IncapacityStatus).includes(statusValue)) {
      throw new ValidationError('Invalid incapacity status');
    }
  }

  private validateDateConsistency(updateData: Record<string, any>, existingIncapacity: Incapacity): void {
    const newStartDate = updateData.start_date || existingIncapacity.start_date;
    const newEndDate = updateData.end_date || existingIncapacity.end_date;

    if (newEndDate < newStartDate) {
      throw new ValidationError('End date must be after start date');
    }
  }

  private mapToResponse(incapacity: Incapacity): IncapacityResponse {
    if (!incapacity.user || !incapacity.payroll) {
      throw new Error('User and payroll data are required to create response');
    }

    return {
      id_incapacity: incapacity.id_incapacity,
      id_user: incapacity.id_user,
      firstName: incapacity.user.firstName,
      lastName: incapacity.user.lastName,
      email: incapacity.user.email,
      role: incapacity.user.role,
      id_payroll: incapacity.id_payroll,
      id_company: incapacity.payroll.id_company,
      start_date: incapacity.start_date,
      end_date: incapacity.end_date,
      type: incapacity.type,
      status: incapacity.status,
      observacion: incapacity.observacion,
    };
  }
}

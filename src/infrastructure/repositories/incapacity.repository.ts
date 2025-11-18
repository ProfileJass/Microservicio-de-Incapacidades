import { IncapacityRepositoryInterface } from '../../domain/ports/incapacity.repository.interface';
import { Incapacity, IncapacityType, IncapacityStatus } from '../../domain/incapacity.entity';
import { IncapacityModel } from '../../domain/model/incapacity.model';
import { UserModel } from '../../domain/model/user.model';
import { PayrollModel } from '../../domain/model/payroll.model';
import { CompanyModel } from '../../domain/model/company.model';

export class IncapacityRepository implements IncapacityRepositoryInterface {
  async create(incapacity: Incapacity): Promise<Incapacity> {
    try {
      const createdIncapacity = await IncapacityModel.create({
        id_user: incapacity.id_user,
        id_payroll: incapacity.id_payroll,
        start_date: incapacity.start_date,
        end_date: incapacity.end_date,
        type: incapacity.type,
        status: incapacity.status,
        observacion: incapacity.observacion,
      });

      const incapacityWithRelations = await IncapacityModel.findByPk(createdIncapacity.id_incapacity, {
        include: [
          {
            model: UserModel,
            as: 'user',
          },
          {
            model: PayrollModel,
            as: 'payroll',
          },
        ],
      });

      return this.toDomain(incapacityWithRelations!);
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(): Promise<Incapacity[]> {
    try {
      const incapacities = await IncapacityModel.findAll({
        include: [
          {
            model: UserModel,
            as: 'user',
          },
          {
            model: PayrollModel,
            as: 'payroll',
            include: [
              {
                model: CompanyModel,
                as: 'company',
              },
            ],
          },
        ],
      });

      return incapacities.map((inc) => this.toDomain(inc));
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: number): Promise<Incapacity | null> {
    try {
      const incapacity = await IncapacityModel.findByPk(id, {
        include: [
          {
            model: UserModel,
            as: 'user',
          },
          {
            model: PayrollModel,
            as: 'payroll',
            include: [
              {
                model: CompanyModel,
                as: 'company',
              },
            ],
          },
        ],
      });

      if (!incapacity) {
        return null;
      }

      return this.toDomain(incapacity);
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByUserId(userId: number): Promise<Incapacity[]> {
    try {
      const incapacities = await IncapacityModel.findAll({
        where: { id_user: userId },
        include: [
          {
            model: UserModel,
            as: 'user',
          },
          {
            model: PayrollModel,
            as: 'payroll',
            include: [
              {
                model: CompanyModel,
                as: 'company',
              },
            ],
          },
        ],
      });

      return incapacities.map((inc) => this.toDomain(inc));
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByUserIdAndStartDate(userId: number, startDate: Date): Promise<Incapacity | null> {
    try {
      const incapacity = await IncapacityModel.findOne({
        where: {
          id_user: userId,
          start_date: startDate,
        },
        include: [
          {
            model: UserModel,
            as: 'user',
          },
          {
            model: PayrollModel,
            as: 'payroll',
          },
        ],
      });

      return incapacity ? this.toDomain(incapacity) : null;
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(id: number, updateData: Record<string, any>): Promise<Incapacity | null> {
    try {
      const incapacity = await IncapacityModel.findByPk(id);
      
      if (!incapacity) {
        return null;
      }

      await incapacity.update(updateData);

      const updatedIncapacity = await IncapacityModel.findByPk(id, {
        include: [
          {
            model: UserModel,
            as: 'user',
          },
          {
            model: PayrollModel,
            as: 'payroll',
            include: [
              {
                model: CompanyModel,
                as: 'company',
              },
            ],
          },
        ],
      });

      return updatedIncapacity ? this.toDomain(updatedIncapacity) : null;
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await IncapacityModel.destroy({
        where: { id_incapacity: id },
      });

      return result > 0;
    } catch (error) {
      throw new Error(`Repository error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private toDomain(model: IncapacityModel): Incapacity {
    const user = (model as any).user ? {
      id_user: (model as any).user.id_user,
      firstName: (model as any).user.firstName,
      lastName: (model as any).user.lastName,
      email: (model as any).user.email,
      role: (model as any).user.role,
    } : undefined;

    const payroll = (model as any).payroll ? {
      id_payroll: (model as any).payroll.id_payroll,
      id_user: (model as any).payroll.id_user,
      id_company: (model as any).payroll.id_company,
      status: (model as any).payroll.status,
    } : undefined;

    return new Incapacity(
      model.id_incapacity,
      model.id_user,
      model.id_payroll,
      model.start_date,
      model.end_date,
      model.type as IncapacityType,
      model.status as IncapacityStatus,
      model.observacion,
      user,
      payroll
    );
  }
}

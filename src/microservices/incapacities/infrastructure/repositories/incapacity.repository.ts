import { IncapacityRepositoryInterface } from '../../domain/ports/incapacity.repository.interface';
import { Incapacity, IncapacityType, IncapacityStatus } from '../../domain/incapacity.entity';
import { IncapacityModel } from '../../domain/model/incapacity.model';
import { UserModel } from '../../domain/model/user.model';
import { PayrollModel } from '../../domain/model/payroll.model';
import { CompanyModel } from '../../domain/model/company.model';

export class IncapacityRepository implements IncapacityRepositoryInterface {
  async create(incapacity: Incapacity): Promise<Incapacity> {
    try {
      await UserModel.findOrCreate({
        where: { id_user: incapacity.id_user },
        defaults: {
          id_user: incapacity.id_user,
          firstName: '',
          lastName: '',
          email: '',
          role: '',
        },
      });

      const [payrollInstance] = await PayrollModel.findOrCreate({
        where: { id_payroll: incapacity.id_payroll },
        defaults: {
          id_payroll: incapacity.id_payroll,
          id_user: incapacity.id_user,
          id_company: '',
          status: 'active',
        },
      });

      const createdIncapacity = await IncapacityModel.create({
        id_incapacity: incapacity.id_incapacity,
        id_user: incapacity.id_user,
        id_payroll: incapacity.id_payroll,
        start_date: incapacity.start_date,
        end_date: incapacity.end_date,
        type: incapacity.type,
        status: incapacity.status,
        observacion: incapacity.observacion,
      });

      return this.toDomain(createdIncapacity);
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

  async findById(id: string): Promise<Incapacity | null> {
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

  async findByUserId(userId: string): Promise<Incapacity[]> {
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

  async update(id: string, updateData: Record<string, any>): Promise<Incapacity | null> {
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

  async delete(id: string): Promise<boolean> {
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
    return new Incapacity(
      model.id_incapacity,
      model.id_user,
      model.id_payroll,
      model.start_date,
      model.end_date,
      model.type as IncapacityType,
      model.status as IncapacityStatus,
      model.observacion
    );
  }
}

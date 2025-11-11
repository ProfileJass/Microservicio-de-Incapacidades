import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../../config/database';
import { UserModel } from './user.model';
import { PayrollModel } from './payroll.model';

export class IncapacityModel extends Model {
  declare id_incapacity: string;
  declare id_user: string;
  declare id_payroll: string;
  declare start_date: Date;
  declare end_date: Date;
  declare type: string;
  declare status: string;
  declare observacion?: string;
}

IncapacityModel.init(
  {
    id_incapacity: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id_user',
      },
    },
    id_payroll: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: PayrollModel,
        key: 'id_payroll',
      },
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('accidente', 'maternidad', 'enfermedad'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'en trámite', 'confirmada', 'negada'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'incapacities',
    timestamps: false,
  }
);

IncapacityModel.belongsTo(UserModel, { foreignKey: 'id_user', as: 'user' });
IncapacityModel.belongsTo(PayrollModel, { foreignKey: 'id_payroll', as: 'payroll' });

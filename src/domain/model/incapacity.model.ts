import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { UserModel } from './user.model';
import { PayrollModel } from './payroll.model';

interface IncapacityAttributes {
  id_incapacity: number;
  id_user: number;
  id_payroll: number;
  start_date: Date;
  end_date: Date;
  type: string;
  status: string;
  observacion?: string;
}

interface IncapacityCreationAttributes extends Optional<IncapacityAttributes, 'id_incapacity' | 'observacion'> {}

export class IncapacityModel extends Model<IncapacityAttributes, IncapacityCreationAttributes> implements IncapacityAttributes {
  declare id_incapacity: number;
  declare id_user: number;
  declare id_payroll: number;
  declare start_date: Date;
  declare end_date: Date;
  declare type: string;
  declare status: string;
  declare observacion?: string;
}

IncapacityModel.init(
  {
    id_incapacity: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id_user',
      },
    },
    id_payroll: {
      type: DataTypes.INTEGER,
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

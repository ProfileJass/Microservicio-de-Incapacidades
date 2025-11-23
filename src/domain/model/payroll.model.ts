import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';
import { UserModel } from './user.model';
import { CompanyModel } from './company.model';

interface PayrollAttributes {
  id_payroll: number;
  id_user: number;
  id_company: number;
  status: string;
}

interface PayrollCreationAttributes extends Optional<PayrollAttributes, 'id_payroll'> {}

export class PayrollModel extends Model<PayrollAttributes, PayrollCreationAttributes> implements PayrollAttributes {
  declare id_payroll: number;
  declare id_user: number;
  declare id_company: number;
  declare status: string;
}

PayrollModel.init(
  {
    id_payroll: {
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
    id_company: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CompanyModel,
        key: 'id_company',
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    tableName: 'payrolls',
    timestamps: false,
  }
);

PayrollModel.belongsTo(UserModel, { foreignKey: 'id_user', as: 'user' });
PayrollModel.belongsTo(CompanyModel, { foreignKey: 'id_company', as: 'company' });

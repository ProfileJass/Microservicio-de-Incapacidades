import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/database';

export class CompanyModel extends Model {
  declare id_company: number;
  declare name: string;
  declare nit: string;
  declare address: string;
  declare phone: string;
}

CompanyModel.init(
  {
    id_company: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'companies',
    timestamps: true,
    underscored: true,
  }
);

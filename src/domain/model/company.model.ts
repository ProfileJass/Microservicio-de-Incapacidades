import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface CompanyAttributes {
  id_company: number;
  name: string;
  nit: string;
  address: string;
  phone: string;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id_company'> {}

export class CompanyModel extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
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

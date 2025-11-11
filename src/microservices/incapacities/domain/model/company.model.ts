import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../../config/database';

export class CompanyModel extends Model {
  declare id_company: string;
  declare nameCompany: string;
  declare NIT: string;
  declare adressCompany: string;
  declare phone: string;
}

CompanyModel.init(
  {
    id_company: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    nameCompany: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    NIT: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adressCompany: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'companies',
    timestamps: false,
  }
);

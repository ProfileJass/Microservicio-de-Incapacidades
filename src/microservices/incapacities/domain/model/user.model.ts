import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../../../config/database';

export class UserModel extends Model {
  declare id_user: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare role: string;
}

UserModel.init(
  {
    id_user: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

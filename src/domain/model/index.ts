// Este archivo asegura que los modelos se carguen en el orden correcto
// y evita problemas de dependencia circular

import './user.model';
import './company.model';
import './payroll.model';
import './incapacity.model';

export { UserModel } from './user.model';
export { CompanyModel } from './company.model';
export { PayrollModel } from './payroll.model';
export { IncapacityModel } from './incapacity.model';

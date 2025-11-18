export interface IncapacityResponse {
  id_incapacity: number;
  id_user: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  id_payroll: number;
  id_company: number;
  start_date: Date;
  end_date: Date;
  type: string;
  status: string;
  observacion?: string;
}

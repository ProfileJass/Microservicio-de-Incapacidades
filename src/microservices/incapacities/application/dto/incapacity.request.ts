import { IncapacityType } from '../../domain/incapacity.entity';

export interface CreateIncapacityRequest {
  id_user: string;
  id_payroll: string;
  start_date: string;
  end_date: string;
  type: IncapacityType;
  observacion?: string;
}

export interface UpdateIncapacityRequest {
  start_date?: string;
  end_date?: string;
  type?: IncapacityType;
  status?: string;
  observacion?: string;
}

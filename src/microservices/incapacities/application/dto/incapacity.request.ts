import { IncapacityType } from '../../domain/incapacity.entity';

export interface CreateIncapacityRequest {
  id_user: number;
  id_payroll: number;
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

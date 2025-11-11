export enum IncapacityType {
  ACCIDENTE = 'accidente',
  MATERNIDAD = 'maternidad',
  ENFERMEDAD = 'enfermedad',
}

export enum IncapacityStatus {
  PENDIENTE = 'pendiente',
  EN_TRAMITE = 'en trámite',
  CONFIRMADA = 'confirmada',
  NEGADA = 'negada',
}

export class Incapacity {
  constructor(
    public readonly id_incapacity: string,
    public readonly id_user: string,
    public readonly id_payroll: string,
    public readonly start_date: Date,
    public readonly end_date: Date,
    public readonly type: IncapacityType,
    public readonly status: IncapacityStatus,
    public readonly observacion?: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id_user || this.id_user.trim().length === 0) {
      throw new Error('User ID is required');
    }
    if (!this.id_payroll || this.id_payroll.trim().length === 0) {
      throw new Error('Payroll ID is required');
    }
    if (!(this.start_date instanceof Date) || isNaN(this.start_date.getTime())) {
      throw new Error('Valid start date is required');
    }
    if (!(this.end_date instanceof Date) || isNaN(this.end_date.getTime())) {
      throw new Error('Valid end date is required');
    }
    if (this.end_date < this.start_date) {
      throw new Error('End date must be after start date');
    }
    if (!Object.values(IncapacityType).includes(this.type)) {
      throw new Error('Invalid incapacity type');
    }
    if (!Object.values(IncapacityStatus).includes(this.status)) {
      throw new Error('Invalid incapacity status');
    }
  }

  public updateIncapacityDetails(
    start_date?: Date,
    end_date?: Date,
    type?: IncapacityType,
    status?: IncapacityStatus,
    observacion?: string
  ): Incapacity {
    const updatedStartDate = start_date ?? this.start_date;
    const updatedEndDate = end_date ?? this.end_date;
    const updatedType = type ?? this.type;
    const updatedStatus = status ?? this.status;
    const updatedObservacion = observacion !== undefined ? observacion : this.observacion;

    return new Incapacity(
      this.id_incapacity,
      this.id_user,
      this.id_payroll,
      updatedStartDate,
      updatedEndDate,
      updatedType,
      updatedStatus,
      updatedObservacion
    );
  }
}

import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum SemesterPeriod {
  S1 = 'S1', // Semestre 1
  S2 = 'S2', // Semestre 2
  I = 'I',   // Invierno
  V = 'V',   // Verano
}

export class SemesterPlan {
  @IsInt()
  @Min(2020)
  year: number;

  @IsEnum(SemesterPeriod)
  period: SemesterPeriod;

  @IsArray()
  @IsString({ each: true })
  courses: string[]; // Arreglo de códigos de ramos
}

export class CreateManualSimulationDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  careerCode: string;

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto del arreglo
  @Type(() => SemesterPlan) // Le dice a class-validator qué clase usar
  manualPlan: SemesterPlan[];

  @IsInt()
  @Min(20) // Minimo de créditos
  @Max(80) // Limite de créditos, (modificar para los limites de credito del regalmento)
  maxCreditsPerSemester: number; //Restricción de créditos
}
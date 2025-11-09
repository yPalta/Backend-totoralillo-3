import { IsBoolean, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class OptimizeDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  careerCode: string;

  // Filtros del modo automático (modificar de acuerdo a los requerimientos ahora es solo de prueba)
  @IsInt()
  @Min(20)
  @Max(80)
  maxCreditsPerSemester: number;

  @IsInt()
  @Min(1)
  @Max(10)
  maxCoursesPerSemester: number;

  @IsBoolean()
  useSummerWinter: boolean;
}
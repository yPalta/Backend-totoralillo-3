import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateManualSimulationDto, SemesterPlan } from './dto/create-manual-simulation.dto';
import { ProgressService } from '../progress/progress.service';
import { CurriculumService, Course, Curriculum } from '../curriculum/curriculum.service';

@Injectable()
export class SimulationService {
  constructor(
    private readonly progressService: ProgressService,
    private readonly curriculumService: CurriculumService,
  ) {}

  async generateManualProjection(dto: CreateManualSimulationDto) {
    const history = await this.progressService.getAcademicHistory(dto.studentId);
    const curriculum = await this.curriculumService.getCurriculum(dto.careerCode);
    
    //simular los cursos aprobados hasta el momento
    const simulatedApproved = new Set(history.approved);
    
    let totalCreditsPerSemester: { semester: string; credits: number }[] = []; // Tarea 3
    
    //validar el plan manual
    for (const semester of dto.manualPlan) {
      const validationResult = await this.validateSemester(
        semester,
        curriculum,
        simulatedApproved,
        history.failed,
        dto.maxCreditsPerSemester,
      );

      if (!validationResult.isValid) {
        throw new BadRequestException(`Error en ${semester.period} ${semester.year}: ${validationResult.error}`);
      }

      //si se valido, agregar los cursos al conjunto de aprobados
      semester.courses.forEach(code => simulatedApproved.add(code));
      totalCreditsPerSemester.push({
        semester: `${semester.period}-${semester.year}`,
        credits: validationResult.semesterCredits, // Tarea 3
      });
    }

    //calcular el resto de la carrera (la proyeccion)

    const futurePlan = this.calculateRemainingPlan(curriculum, simulatedApproved, dto.maxCreditsPerSemester);

    //Mostrar impacto en fecha estimada de egreso
    const fullPlan = [...dto.manualPlan, ...futurePlan.plan];
    const estimatedGraduation = fullPlan.length > 0 ? 
      `${fullPlan[fullPlan.length - 1].period} ${fullPlan[fullPlan.length - 1].year}` :
      'Ya egresado';

    return {
      estimatedGraduation,
      totalCreditsPerSemester, 
      fullPlan, 
      //Mostrar aprobados y pendientes (en el contexto de la simulacion)
      approvedCourses: Array.from(simulatedApproved),
      pendingCourses: futurePlan.pending,
    };
  }

  //Aplicar restricciones
  private async validateSemester(
    semester: SemesterPlan,
    curriculum: Curriculum,
    approvedSoFar: Set<string>,
    failedSoFar: Set<string>,
    maxCredits: number,
  ): Promise<{ isValid: boolean; error?: string; semesterCredits: number }> {
    
    let semesterCredits = 0;

    for (const courseCode of semester.courses) {
      const course = curriculum.courses.get(courseCode);
      if (!course) {
        return { isValid: false, error: `Ramo ${courseCode} no existe.`, semesterCredits: 0 };
      }

      //Restricción ramos adelantados (Prerrequisitos)
      for (const preCode of course.prerequisites) {
        if (!approvedSoFar.has(preCode)) {
          return { isValid: false, error: `Falta prerrequisito ${preCode} para ${courseCode}.`, semesterCredits: 0 };
        }
      }
      
      //Ramos Invierno/Verano
      if (semester.period === 'I' || semester.period === 'V') {
        if (!failedSoFar.has(courseCode)) {
          return { isValid: false, error: `Ramo ${courseCode} solo se puede tomar en I/V si fue reprobado.`, semesterCredits: 0 };
        }
      }
      
      semesterCredits += course.credits;
    }

    //Restricción créditos máximos
    if (semesterCredits > maxCredits) {
      return { isValid: false, error: `Excede el máximo de créditos (${semesterCredits} > ${maxCredits}).`, semesterCredits };
    }
    
    return { isValid: true, semesterCredits };
  }

 
  private calculateRemainingPlan(curriculum: Curriculum, approved: Set<string>, maxCredits: number) {
    //Implementar lógica de optimización aqui
    
    console.warn('calculateRemainingPlan no implementado');
    return { plan: [], pending: [] };
  }
}
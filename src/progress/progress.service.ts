import { Injectable } from '@nestjs/common';
import { CurriculumService } from '../curriculum/curriculum.service';

export interface AcademicHistory {
  approved: Set<string>; // Códigos de ramos aprobados
  failed: Set<string>;   // Códigos de ramos reprobados
}

@Injectable()
export class ProgressService {
  
  // TODO: Esto debe estar en la BASE DE DATOS. TERMINAR LA BASE DE DATOS NO OLVIDAR.

  private studentHistoryDB = new Map<string, AcademicHistory>();

  constructor(
    private readonly curriculumService: CurriculumService
  ) {
   
    this.studentHistoryDB.set('student-123', {
      approved: new Set(['MAT001', 'PRG001']),
      failed: new Set(['FIS001']),
    });
  }

  async getAcademicHistory(studentId: string): Promise<AcademicHistory> {
    // Simula la obtención de datos de una DB
    return this.studentHistoryDB.get(studentId) || { approved: new Set(), failed: new Set() };
  }

  async setAcademicHistory(studentId: string, approved: string[], failed: string[]) {
    // Simula guardar en DB
    this.studentHistoryDB.set(studentId, {
      approved: new Set(approved),
      failed: new Set(failed),
    });
    return this.studentHistoryDB.get(studentId);
  }

  //Mostrar ramos pendientes
  async getPendingCourses(studentId: string, careerCode: string): Promise<string[]> {
    const history = await this.getAcademicHistory(studentId);
    const curriculum = await this.curriculumService.getCurriculum(careerCode);
    
    const allCourseCodes = Array.from(curriculum.courses.keys());
    
    const pending = allCourseCodes.filter(code => !history.approved.has(code));
    return pending;
  }
}
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  //Mostrar ramos aprobados y pendientes
  @Get(':studentId')
  async getAcademicProgress(@Param('studentId') studentId: string) {
    
    const mockCareerCode = 'ING-INF';
    
    return {
      history: await this.progressService.getAcademicHistory(studentId),
      pending: await this.progressService.getPendingCourses(studentId, mockCareerCode),
    };
  }

  @Post(':studentId/history')
  async setAcademicHistory(
    @Param('studentId') studentId: string,
    @Body() history: { approved: string[]; failed: string[] },
  ) {
    // Ruta para cargar el historial de un alumno
    return this.progressService.setAcademicHistory(studentId, history.approved, history.failed);
  }
}
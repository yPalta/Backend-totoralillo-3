import { Controller, Post, Body } from '@nestjs/common';
import { CreateManualSimulationDto, SemesterPeriod } from './dto/create-manual-simulation.dto';
import { SimulationService } from './simulation.service';
import { SemesterPlan } from './dto/create-manual-simulation.dto';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  // Tarea 1: Implementar simulación de inscripción manual
  @Post('manual')
  async createManualSimulation(@Body() dto: CreateManualSimulationDto): Promise<{
    estimatedGraduation: string;
    totalCreditsPerSemester: { semester: string; credits: number; }[];
    fullPlan: SemesterPlan[];
    approvedCourses: string[];
    pendingCourses: never[];
  }> {
    // El DTO ya fue validado por el ValidationPipe global
    return this.simulationService.generateManualProjection(dto);
  }
}
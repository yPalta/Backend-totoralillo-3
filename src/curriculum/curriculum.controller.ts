import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CurriculumService } from './curriculum.service';

@Controller('curriculum')
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  
  @Get(':careerCode')
  async getCurriculum(@Param('careerCode') careerCode: string) {
    const curriculum = await this.curriculumService.getCurriculum(careerCode);
    if (!curriculum) {
      throw new NotFoundException('Malla no encontrada');
    }
    return curriculum;
  }

  @Get('course/:courseCode')
  async getCourseDetails(@Param('courseCode') courseCode: string) {
    
    const details = await this.curriculumService.getCourseDetails(courseCode);
    if (!details) {
      throw new NotFoundException('Ramo no encontrado');
    }
    return details;
  }
}
import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { CurriculumModule } from '../curriculum/curriculum.module';

@Module({
  imports: [CurriculumModule], // Necesita el servicio de Curriculum
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService], // Exporta para Simulación y Optimización
})
export class ProgressModule {}
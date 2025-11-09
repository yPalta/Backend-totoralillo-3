import { Module } from '@nestjs/common';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';
import { ExternalApiModule } from '../external-api/external-api.module';

@Module({
  imports: [ExternalApiModule], // Importa el módulo que provee ExternalApiService
  controllers: [CurriculumController],
  providers: [CurriculumService],
  exports: [CurriculumService], // Exporta para que se use la  Simulación y Optimización 
})
export class CurriculumModule {}
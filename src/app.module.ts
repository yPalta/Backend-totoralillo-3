import { Module } from '@nestjs/common';
import { CurriculumModule } from './curriculum/curriculum.module';
import { ProgressModule } from './progress/progress.module';
import { SimulationModule } from './simulation/simulation.module';
import { OptimizationModule } from './optimization/optimization.module';
import { ExternalApiModule } from './external-api/external-api.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    CurriculumModule,
    ProgressModule,
    SimulationModule,
    OptimizationModule,
    ExternalApiModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
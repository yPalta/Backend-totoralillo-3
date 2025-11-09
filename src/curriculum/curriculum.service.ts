import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ExternalApiService } from '../external-api/external-api.service';

// Estructura interna de un curso 
export interface Course {
  code: string;
  name: string;
  credits: number;
  prerequisites: string[];
}

// Estructura de la malla completa
export interface Curriculum {
  careerCode: string;
  courses: Map<string, Course>; // Use un Map para acceso rapido por codigo
  totalCourses: number;
}

@Injectable()
export class CurriculumService {
  
 
  // para no llamar a la API externa en cada request. (testeo aun no poseo conocimiento claro sobre el funcionamiento)
  private curriculumCache = new Map<string, Curriculum>();

  constructor(private readonly externalApiService: ExternalApiService) {}

  async getCurriculum(careerCode: string): Promise<Curriculum> {
    if (this.curriculumCache.has(careerCode)) {
      const cachedCurriculum = this.curriculumCache.get(careerCode);
      if (!cachedCurriculum) {
        throw new InternalServerErrorException('Error procesando la malla curricular');
      }
      return cachedCurriculum;
    }

    try {
      const apiCourses = await this.externalApiService.fetchCurriculumFromAPI(careerCode);
      
      const courseMap = new Map<string, Course>();
      apiCourses.forEach(course => {
        courseMap.set(course.code, course);
      });

      const curriculum: Curriculum = {
        careerCode: careerCode,
        courses: courseMap,
        totalCourses: courseMap.size,
      };

      this.curriculumCache.set(careerCode, curriculum);
      return curriculum;

    } catch (error) {
      throw new InternalServerErrorException('Error procesando la malla curricular');
    }
  }

  async getCourseDetails(courseCode: string): Promise<Course | undefined> {
    // optimizar esto, deberia buscar por cache
    // modificar para los ramos de las distintas mallas; actualmente funciona para una sola malla.

    for (const curriculum of this.curriculumCache.values()) {
      if (curriculum.courses.has(courseCode)) {
        return curriculum.courses.get(courseCode);
      }
    }
   
    
    return undefined;
  }

  
  async getCourseCredits(courseCode: string): Promise<number> {
    const details = await this.getCourseDetails(courseCode);
    return details ? details.credits : 0;
  }
}
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

//modificar segun la estructura real de la API externa
interface ApiCourse {
  code: string;
  name: string;
  credits: number;
  prerequisites: string[]; // Arreglo de códigos de ramos
}

@Injectable()
export class ExternalApiService {
  // URL base de la API de Mallas Curriculares
  private API_BASE_URL = 'https://api.universidad.cl/mallas/';

  constructor(private readonly httpService: HttpService) {}

  async fetchCurriculumFromAPI(careerCode: string): Promise<ApiCourse[]> {
    try {
      const url = `${this.API_BASE_URL}${careerCode}`;
      const { data } = await firstValueFrom(this.httpService.get(url));
      
      
      return data.courses as ApiCourse[];

    } catch (error) {
      console.error('Error fetching external API', error);
      throw new Error('No se pudo obtener la malla curricular.');
    }
  }
}
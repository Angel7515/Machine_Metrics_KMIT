import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreatePerformanceService } from '../../services/CreatePerformance/create-performance.service';
import { GetPerformanceService } from '../../services/GetPerformance/get-performance.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

@Component({
  selector: 'app-kpis-performance',
  templateUrl: './kpis-performance.component.html',
  styleUrl: './kpis-performance.component.css'
})
export class KpisPerformanceComponent implements OnInit {

  kpiData: any;
  performances: any[] = [];

  constructor(private route: ActivatedRoute, private getPerformance:GetPerformanceService, private createPerformance: CreatePerformanceService, private authServiceToken:AuthServiceTokenService) { }

  ngOnInit(): void {
    // Obtener los datos de la KPI del estado de la navegación
    this.kpiData = history.state.kpiData;
    this.loadPerformanceData(this.kpiData.idkpis);
  }

  isAdminRole(): boolean {
    // Obtener el rol del localStorage y comprobar si es 'admin'
    const role = this.authServiceToken.getAccessRole();
    return role === 'ADMIN';
  }

  /* loadPerformanceData(kpiId: number): void {
    this.getPerformance.getAllPerformances().subscribe(
      (data: any[]) => {
        this.performances = data.filter(performance => performance.kpis_idkpis === kpiId);
        this.performances.forEach(performance => {
          performance.date_upload = performance.date_upload.substring(0, 10);
        });
      },
      error => {
        console.log('Error al cargar los datos de performance:', error);
      }
    );
  } */
  loadPerformanceData(kpiId: number): void {
    this.getPerformance.getAllPerformances().subscribe(
      (data: any[]) => {
        this.performances = data.filter(performance => performance.kpis_idkpis === kpiId);
        this.performances.forEach(performance => {
          performance.date_upload = performance.date_upload.substring(0, 10);
        });
  
        // Ordenar los registros en orden descendente por el ID de performance
        this.performances.sort((a, b) => b.idperformance - a.idperformance);
      },
      error => {
        console.log('Error al cargar los datos de performance:', error);
      }
    );
  }
  

}

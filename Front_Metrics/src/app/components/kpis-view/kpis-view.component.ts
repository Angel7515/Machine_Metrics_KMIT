import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Environment } from '../../environments/environment';
import { KpisAllService } from '../../services/KpisAll/kpis-all.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kpis-view',
  templateUrl: './kpis-view.component.html',
  styleUrl: './kpis-view.component.css'
})
export class KpisViewComponent implements OnInit{

  project_number = '';
  project_name = '';
  kpis: any[] = [];

  constructor(private route: ActivatedRoute, private kpisAllService: KpisAllService, private router:Router) {}

  ngOnInit(): void {
    this.project_number = Environment.getProjectId();
    this.route.params.subscribe(params => {
      this.project_name = Environment.getusername();
      this.getKPIs();
    });
  }

  getKPIs(): void {
    this.kpisAllService.getAllKPIs().subscribe(
      (data: any[]) => {
        // Filtra los KPIs relacionados con el proyecto actual (usando project_number, por ejemplo)
        this.kpis = data.filter(kpi => kpi.project_idproject === this.project_number);
      },
      (error) => {
        console.error('Error fetching KPIs:', error);
      }
    );
  }

  redirectToPerformance(selectedKpi: any): void {
    // Redirigir al usuario al componente Performance y pasar los datos del registro seleccionado
    this.router.navigate(['/performance', selectedKpi.idkpis], { state: { kpiData: selectedKpi } });
  }

}

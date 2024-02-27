import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Route } from '@angular/router';
import { CreatePerformanceService } from '../../services/CreatePerformance/create-performance.service';
import { Router } from '@angular/router';
import { Environment } from '../../environments/environment';
import { MsalService } from '@azure/msal-angular';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';

@Component({
  selector: 'app-new-performance',
  templateUrl: './new-performance.component.html',
  styleUrls: ['./new-performance.component.css']
})
export class NewPerformanceComponent implements OnInit {
  idkpis: string = '';
  name: string = '';
  type_kp: string = '';
  importance: string = '';
  kpis_project_idproject: string = '';
  kpis_project_person_idactive: string = '';

  kpiNum: number = 0;
  kpiStr: string = '';
  kpiStrPorcent: number = 0;
  kpiDescripcion: string = '';
  dateUpload: Date | null = null;
  kpisIdkpis: number = 0;
  kpisProjectIdproject: number = 0;
  kpisProjectPersonidactive: string = '';

  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;

  showKpiNumField: boolean = true;
  showKpiStrField: boolean = true;

  personidactive: string = this.authserviceToken.getAccessIdactive();


  constructor(private route: ActivatedRoute, private createPerformance: CreatePerformanceService, private router: Router, private authservice: MsalService, private authserviceToken: AuthServiceTokenService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => { // Asegúrate de especificar el tipo 'Params' para 'params'
      this.idkpis = params['idkpis']; // Accede a las propiedades utilizando corchetes []
      this.name = params['name'];
      this.type_kp = params['type_kp'];
      this.importance = params['importance'];
      this.kpis_project_idproject = params['kpis_project_idproject'];
      this.kpis_project_person_idactive = params['kpis_project_person_idactive'];
    });
    this.showKpiNumField = this.type_kp !== 'QUALITATIVE';
    this.showKpiStrField = this.type_kp !== 'QUANTITATIVE';
  }

  onSubmit(): void {
    const performanceData = {
      kpi_num: this.kpiNum,
      kpi_str: this.kpiStr,
      kpi_str_porcent: this.kpiStrPorcent,
      kpi_descripcion: this.kpiDescripcion,
      date_upload: this.dateUpload,
      kpis_idkpis: this.idkpis,
      kpis_project_idproject: this.kpisProjectIdproject = parseInt(Environment.getProjectId()),
      kpis_project_person_idactive: this.kpisProjectPersonidactive = this.personidactive
    };

    this.createPerformance.createPerformance(performanceData).subscribe(
      response => {
        console.log('Performance created successfully:', response);

        this.projectCreationSuccess = true;
        this.projectCreationError = false;
        // Iniciar temporizador para redirigir después de 3 segundos (ajusta el tiempo según sea necesario)
        setTimeout(() => {
          this.router.navigate(['/dbkpis']);
        }, 2000);
      },
      error => {
        console.error('Error creating performance:', error);
        this.projectCreationSuccess = false;
        this.projectCreationError = true;
        setTimeout(() => {
          this.projectCreationError = false;
        }, 2000);
        // Maneja errores aquí si es necesario
      }
    );
  }
}

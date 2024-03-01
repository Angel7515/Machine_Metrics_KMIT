import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateKPIService } from '../../services/UpKPI/update-kpi.service';

@Component({
  selector: 'app-kpi-edit',
  templateUrl: './kpi-edit.component.html',
  styleUrl: './kpi-edit.component.css'
})
export class KpiEditComponent implements OnInit {
  kpiData: any;
  kpiName: string = '';
  kpiType: string = '';
  kpiDescription: string = '';
  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;

  ngOnInit(): void {
    this.kpiData = history.state.kpiData;
    console.log(this.kpiData);
    if (this.kpiData) {
      this.kpiName = this.kpiData.name;
      this.kpiDescription = this.kpiData.importance;
    }
  }

  constructor(
    private router:Router,
    private Updatekpi: UpdateKPIService
  ) { }

  updateKpi(): void {
    const newData = {
      idkpis: this.kpiData.idkpis,
      name: this.kpiName,
      type_kp: this.kpiData.type_kp,
      importance: this.kpiDescription,
      project_idproject: this.kpiData.project_idproject,
      project_person_idactive: this.kpiData.project_person_idactive
    };
    this.Updatekpi.updateKpi(this.kpiData.idkpis, newData)
      .subscribe(
        response => {
          //console.log('KPI updated successfully:', response);
          this.projectCreationSuccess = true;
          this.projectCreationError = false;
          // Manejo adicional después de la actualización exitosa
          setTimeout(() => {
            this.router.navigate(['/dbkpis']);
          }, 2000);
        },
        error => {
          //console.error('Error updating KPI:', error);
          this.projectCreationSuccess = false;
          this.projectCreationError = true;
          // Manejo de errores
          setTimeout(() => {
            this.projectCreationError = false;
          }, 2000);
        }
      );
  }

}

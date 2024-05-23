import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateKPIService } from '../../services/UpKPI/update-kpi.service';
import { Environment } from '../../environments/environment';

import { UsersService } from '../../services/AllUsers/users.service';
import { DbKpisPersonService } from '../../services/kpisResponsable/db-kpis-person.service';

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
  startDate: string = '';
  endDate: string = '';
  projectCreationSuccess: boolean = false;
  projectCreationError: boolean = false;

  ngOnInit(): void {
    this.kpiData = history.state.kpiData;
    console.log(this.kpiData);
    if (this.kpiData) {
      this.kpiName = this.kpiData.name;
      this.kpiDescription = this.kpiData.importance;
      this.startDate = this.kpiData.start_date;
      this.endDate = this.kpiData.end_date;
    }
  }

  constructor(
    private router: Router,
    private Updatekpi: UpdateKPIService,
    private userAllDB: UsersService,
    private dbKpisPersonService: DbKpisPersonService
  ) { }

  updateKpi(): void {
    const newData = {
      idkpis: this.kpiData.idkpis,
      name: this.kpiName,
      type_kp: this.kpiData.type_kp,
      importance: this.kpiDescription,
      start_date: this.startDate,
      end_date: this.endDate,
      project_idproject: this.kpiData.project_idproject,
      project_person_idactive: this.kpiData.project_person_idactive
    };
    this.Updatekpi.updateKpi(this.kpiData.idkpis, newData)
      .subscribe(
        response => {
          this.projectCreationSuccess = true;
          this.projectCreationError = false;
          setTimeout(() => {
            this.navigateToKpisView();
          }, 2000);
        },
        error => {
          this.projectCreationSuccess = false;
          this.projectCreationError = true;
          setTimeout(() => {
            this.projectCreationError = false;
          }, 2000);
        }
      );
  }

  navigateToKpisView() {
    this.router.navigate(['/kpisview', Environment.getProjectId(), { projectName: Environment.getusername() }]);
  }
}

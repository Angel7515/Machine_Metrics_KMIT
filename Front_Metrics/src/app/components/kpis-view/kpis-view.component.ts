import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Environment } from '../../environments/environment';
import { KpisAllService } from '../../services/KpisAll/kpis-all.service';
import { AuthServiceTokenService } from '../../services/AuthServiceToken/auth-service-token.service';
import { UsersService } from '../../services/AllUsers/users.service';
import { DbKpisPersonService } from '../../services/kpisResponsable/db-kpis-person.service';

@Component({
  selector: 'app-kpis-view',
  templateUrl: './kpis-view.component.html',
  styleUrls: ['./kpis-view.component.css']
})
export class KpisViewComponent implements OnInit {
  project_number = '';
  project_name = '';
  kpis: any[] = [];
  usuariosDB: any[] = [];
  kpisPersons: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private kpisAllService: KpisAllService,
    private router: Router,
    private authServiceToken: AuthServiceTokenService,
    private userAllDB: UsersService,
    private dbKpisPersonService: DbKpisPersonService
  ) {}

  ngOnInit(): void {
    this.project_number = Environment.getProjectId();
    this.route.params.subscribe(params => {
      this.project_name = Environment.getusername();
      this.getKPIs();
      this.loadUsuarios();
      this.getKpisPersons();
    });
  }

  isAdminRole(): boolean {
    const role = this.authServiceToken.getAccessRole();
    return role === 'ADMIN';
  }

  getKPIs(): void {
    this.kpisAllService.getAllKPIs().subscribe(
      (data: any[]) => {
        this.kpis = data.filter(kpi => kpi.project_idproject === this.project_number);
        this.formatDates(); // Formatear fechas después de obtener los KPIs
        this.assignResponsiblesToKpis(); // Llamar después de obtener los KPIs
      },
      (error) => {
        console.error('Error fetching KPIs:', error);
      }
    );
  }

  loadUsuarios(): void {
    this.userAllDB.getUsers().subscribe(
      (data: any[]) => {
        this.usuariosDB = data;
        this.assignResponsiblesToKpis(); // Llamar después de obtener los usuarios
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  getKpisPersons(): void {
    this.dbKpisPersonService.getAllKpisPerson().subscribe(
      (data: any[]) => {
        this.kpisPersons = data;
        this.assignResponsiblesToKpis(); // Llamar después de obtener los kpisPersons
      },
      (error) => {
        console.error('Error fetching KPIs Persons:', error);
      }
    );
  }

  assignResponsiblesToKpis(): void {
    if (this.kpis.length > 0 && this.kpisPersons.length > 0 && this.usuariosDB.length > 0) {
      const kpiPersonsWithUserNames: any[] = this.kpisPersons.map(kpiPerson => {
        const userName = this.getUserName(kpiPerson.person_idactive);
        return {
          kpis_idkpis: kpiPerson.kpis_idkpis,
          person_idactive: kpiPerson.person_idactive,
          user_name: userName
        };
      });

      this.kpis.forEach(kpi => {
        kpi.personsResponsible = kpiPersonsWithUserNames.filter(record => record.kpis_idkpis === kpi.idkpis);
      });
    }
  }

  getUserName(personId: string): string {
    const user = this.usuariosDB.find(user => user.idactive === personId);
    return user ? user.full_name : '';
  }

  redirectToPerformance(selectedKpi: any): void {
    this.router.navigate(['/performance', selectedKpi.idkpis], { state: { kpiData: selectedKpi } });
  }

  redirectToEditKPI(selectedKpi: any): void {
    this.router.navigate(['/editkpi/', selectedKpi.idkpis], { state: { kpiData: selectedKpi } });
  }

  formatDates(): void {
    this.kpis.forEach(kpi => {
      kpi.start_date = kpi.start_date ? kpi.start_date.substring(0, 10) : '';
      kpi.end_date = kpi.end_date ? kpi.end_date.substring(0, 10) : '';
    });
  }
}

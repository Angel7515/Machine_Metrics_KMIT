import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Environment } from '../../environments/environment';

@Component({
  selector: 'app-kpis-view',
  templateUrl: './kpis-view.component.html',
  styleUrl: './kpis-view.component.css'
})
export class KpisViewComponent {

  project_number = Environment.getProjectId();

  constructor(private router:Router){}

  navigateToKpisViewEspecific(projectId: string) {
    this.router.navigate(['/kpisview', projectId]);
    Environment.setProjectId(projectId);
  }

}

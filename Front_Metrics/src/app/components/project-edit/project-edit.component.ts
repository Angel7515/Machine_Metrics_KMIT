import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UPdateIDProjectsService } from '../../services/getUPdateIdprojects/update-idprojects.service';
import { Environment } from '../../environments/environment';
import { UPloadProjectService } from '../../services/UploadProjects/upload-project.service';

import { MsalService } from '@azure/msal-angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrl: './project-edit.component.css'
})
export class ProjectEditComponent implements OnInit {

  projectID: string = '';
  projectDetails: any;
  selectedStatus: string = '';
  endDate: Date | null = null; // Ajusta el tipo de endDate a string
  selectedStartDate: any = null;
  selectedendDate: any = null;

  constructor(private route: ActivatedRoute, private projectService: UPdateIDProjectsService, private uploadService: UPloadProjectService, private authService: MsalService) { }

  ngOnInit() {
    this.projectID = Environment.getProjectId();
    this.loadProjectDetails(this.projectID);
  }

  getAccountName() {
    let name = this.authService.instance.getActiveAccount()?.name;
    return name
  }

  loadProjectDetails(projectID: string) {
    this.projectService.getProjectById(projectID).subscribe(
      (data: any) => {
        this.projectDetails = data;
        this.projectDetails[0].start_date = this.projectDetails[0].start_date.substring(0, 10);
      },
      error => {
        console.log('Error al obtener los detalles del proyecto:', error);
      }
    );
  }

  uploadProjectData(): void {

    const startDateInput = document.getElementById('startDate') as HTMLInputElement; // Obtener el input por su ID
    if (startDateInput) {
      this.selectedStartDate = startDateInput.value; // Asignar el valor del input a la variable
      console.log('Fecha seleccionada:', this.selectedStartDate);

      // Aquí puedes continuar con el proceso de carga de datos al servidor
    } else {
      console.error('Elemento startDate no encontrado.');
    }


    // Verifica si el estado es "COMPLETE"
    if (this.selectedStatus === 'COMPLETE') {
      const endDateInput = document.getElementById('endDate') as HTMLInputElement; 
      if (endDateInput) {
        this.selectedendDate = endDateInput.value; // Asignar el valor del input a la variable
        console.log('Fecha seleccionada final:', this.selectedendDate);

        // Aquí puedes continuar con el proceso de carga de datos al servidor
      } else {
        console.error('Elemento startDate no encontrado.');
      }
    }

    // Envía los datos al servidor
    const formData = {
      project_name: this.projectDetails[0].project_name,
      description: this.projectDetails[0].description,
      start_date: this.selectedStartDate,
      end_date: this.selectedendDate,
      status_project: this.selectedStatus,
      person_full_name: this.getAccountName()
    };

    this.uploadService.uploadProjectData(this.projectID, formData)
      .subscribe(
        response => {
          console.log('Datos enviados exitosamente al servidor:', response);
          // Maneja la respuesta del servidor según sea necesario
        },
        error => {
          console.error('Error al enviar datos al servidor:', error);
          // Maneja el error según sea necesario
        }
      );
  }

}

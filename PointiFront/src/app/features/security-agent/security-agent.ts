import { showConfirmDialog } from '../../shared/utils/sweetalert';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';


@Component({
  selector: 'app-security-agent',
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule,
    FormlyBootstrapModule,
    FormsModule
  ],
  templateUrl: './security-agent.html',
  styleUrl: './security-agent.css'
})
export class SecurityAgentComponent {
  currentStep: 1 | 2 | 3 = 1;

  filters = {
    cin: '',
    nomPrenom: '',
    organisation: ''
  };

  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'nomPrenom',
      type: 'input',
      templateOptions: {
        label: 'Nom et prénom',
        placeholder: 'Entrer le nom complet',
        required: true,
      },
    },
    {
      key: 'cin',
      type: 'input',
      templateOptions: {
        label: 'CIN',
        placeholder: 'Entrer le numéro CIN',
        required: true,
      },
    },
    {
      key: 'organisation',
      type: 'input',
      templateOptions: {
        label: 'Organisation',
        placeholder: 'Entrer l’organisation',
        required: true,
      },
    },
  ];

  visiteurs: any[] = [];
  selectedVisiteur: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  async logout() {
    const confirmed = await showConfirmDialog({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'warning',
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler'
    });
    if (confirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  }



  goToStep(step: 1 | 2 | 3) {
    this.currentStep = step;
  }

  submit() {
    if (this.form.valid) {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + (localStorage.getItem("token") || '')
      });

      this.http.post('http://localhost:8080/visiteurs', this.model, { headers }).subscribe({
        next: (created) => {
          alert('Visiteur ajouté avec succès');
          this.model = {};
          this.form.reset();
          this.form.markAsPristine();
          this.form.markAsUntouched();
          this.selectedVisiteur = created;
          this.currentStep = 2; // Aller à l'affectation après création
        },
      error: () => {
        alert('Erreur lors de l\'ajout du visiteur');
      }
    });
  } else {
    alert("Veuillez remplir tous les champs obligatoires.");
  }
}

 applyFilter(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token') // adapte selon ton projet
    });

    let params = new HttpParams();
    if (this.filters.cin) params = params.set('cin', this.filters.cin);
    if (this.filters.nomPrenom) params = params.set('nomPrenom', this.filters.nomPrenom);
    if (this.filters.organisation) params = params.set('organisation', this.filters.organisation);

    this.http.get<any[]>('http://localhost:8080/visiteurs', { headers, params })
      .subscribe({
        next: data => {
          this.visiteurs = data;
        },
        error: err => {
          console.error('Erreur lors du chargement des visiteurs :', err);
        }
      });
  }


}

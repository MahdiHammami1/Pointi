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
  allEmployees: any[] = [];
  ngOnInit() {
    this.chargerTousLesEmployes();
  }

  chargerTousLesEmployes() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem("token") || '')
    });
    this.http.get<any>('http://localhost:8080/employees', { headers })
      .subscribe({
        next: (data) => {
          this.allEmployees = data.content || [];
        },
        error: () => {
          this.allEmployees = [];
        }
      });
  }
  employesAffectables: any[] = [];
  selectedEmployeId: number | null = null;
  commentaireAffectation: string = '';
  showFilterError = false;
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
      localStorage.setItem('logout', Date.now().toString());
      window.location.href = '/';
    }
  }



  goToStep(step: 1 | 2 | 3) {
    this.currentStep = step;
    if (step === 2 && this.selectedVisiteur) {
      this.chargerEmployesAffectables();
    }
  }
  chargerEmployesAffectables() {
    // Appel à l'API backend pour récupérer les employés à qui on peut affecter le visiteur
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem("token") || '')
    });
    // Remplacer l'URL par celle qui retourne la liste filtrée côté backend
    this.http.get<any[]>(`http://localhost:8080/visitor-employee/affectables?idVisiteur=${this.selectedVisiteur.id}`, { headers })
      .subscribe({
        next: (data) => {
          this.employesAffectables = data;
        },
        error: (err) => {
          this.employesAffectables = [];
        }
      });
  }
  affecterVisiteur() {
    if (!this.selectedVisiteur || !this.selectedEmployeId) return;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (localStorage.getItem("token") || '')
    });
    const dto = {
      idVisiteur: this.selectedVisiteur.id,
      idEmploye: this.selectedEmployeId,
      dateAffectation: new Date().toISOString(),
      commentaire: this.commentaireAffectation
    };
    this.http.post('http://localhost:8080/visitor-employee/affecter', dto, { headers }).subscribe({
      next: () => {
        alert('Affectation réussie !');
        this.goToStep(1);
      },
      error: () => {
        alert('Erreur lors de l\'affectation');
      }
    });
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

  onFilterSubmit(): void {
    this.showFilterError = true;
    // Validation du champ CIN uniquement au clic
    if (!this.filters.cin || this.filters.cin.length !== 3 || !/^[0-9]{3}$/.test(this.filters.cin)) {
      this.visiteurs = [];
      return;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    this.http.get<any[]>('http://localhost:8080/visiteurs', { headers })
      .subscribe({
        next: data => {
          this.visiteurs = data.filter(v => {
            let match = true;
            if (this.filters.cin) {
              const cinStr = v.cin ? v.cin.toString() : '';
              match = match && cinStr.slice(-3) === this.filters.cin;
            }
            if (this.filters.nomPrenom) {
              match = match && v.nomPrenom && v.nomPrenom.toLowerCase().includes(this.filters.nomPrenom.toLowerCase());
            }
            if (this.filters.organisation) {
              match = match && v.organisation && v.organisation.toLowerCase().includes(this.filters.organisation.toLowerCase());
            }
            return match;
          });
        },
        error: err => {
          console.error('Erreur lors du chargement des visiteurs :', err);
        }
      });
  }

  onFilterReset(): void {
    this.filters = { cin: '', nomPrenom: '', organisation: '' };
    this.visiteurs = [];
    this.showFilterError = false;
  }


}

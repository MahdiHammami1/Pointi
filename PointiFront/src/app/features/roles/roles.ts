import { Component, type OnInit } from "@angular/core"
import  { Router } from "@angular/router"
import  { RolePermissionService } from "../../service/role-permission.service"
import { Role } from "../../models/role.model"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"

interface RoleForm {
  nom: string;
  description: string;
}

@Component({
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  selector: "app-role",
  templateUrl: "./roles.html",
  styleUrls: ["./roles.css"],
})
export class RoleComponent implements OnInit {
  roles: Role[] = []
  loading = false
  error: string | null = null
  roleForm!: FormGroup;

  showSuccessAlert = false;
  successMessage = '';

  showErrorAlert = false;
  errorMessage = '';
  
  constructor(
    private rolePermissionService: RolePermissionService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

 

  ngOnInit(): void {
    this.loadRoles()
    this.initializeForm();
  }


  initializeForm(): void {
  this.roleForm = this.formBuilder.group({
    nom: ['', Validators.required],
    description: ['', Validators.required]
  });
}

  loadRoles(): void {
    this.loading = true
    this.error = null

    this.rolePermissionService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles
        this.loading = false
      },
      error: (error) => {
        this.error = "Failed to load roles. Please try again."
        this.loading = false
        console.error("Error loading roles:", error)
      },
    })
  }

  modifyPermissions(role: Role): void {
    // Store selected role in localStorage
    localStorage.setItem("selectedRole", JSON.stringify(role))

    // Navigate to permissions component
    this.router.navigate(["/loggedin/permissions"])
  }

createRole(): void {
  if (!this.roleForm) {
    console.error('Form is not initialized');
    return;
  }

  const nom = this.roleForm.get('nom')?.value;
  const description = this.roleForm.get('description')?.value;

  if (!nom || !description) {
    this.errorMessage = 'Nom and description are required';
    this.showErrorAlert = true;
    return;
  }

  this.rolePermissionService.createRole(nom, description).subscribe({
    next: () => {
      this.loadRoles();
      this.showSuccessAlert = true;
      this.roleForm?.reset();
    },
    error: err => {
      console.error('Erreur lors de la création du rôle', err);
      this.errorMessage = 'Erreur lors de la création du rôle';
      this.showErrorAlert = true;
    }
  });
}

deleteRole(id: string): void {
  if (confirm('Are you sure you want to delete this role?')) {
    this.rolePermissionService.deleteRole(id).subscribe({
      next: () => {
        this.roles = this.roles.filter(role => role.id !== id); // Update local list
        console.log('Role deleted successfully');
      },
      error: err => {
        console.error('Error deleting role:', err);
      }
    });
  }
}

  

  trackByRoleId(index: number, role: Role): string {
    return role.id
  }
}

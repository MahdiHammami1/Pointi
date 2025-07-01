import { Component, type OnInit } from "@angular/core"
import  { Router } from "@angular/router"
import  { RolePermissionService } from "../../service/role-permission.service"
import { Role } from "../../models/role.model"
import { CommonModule } from "@angular/common"

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: "app-role",
  templateUrl: "./roles.html",
  styleUrls: ["./roles.css"],
})
export class RoleComponent implements OnInit {
  roles: Role[] = []
  loading = false
  error: string | null = null

  constructor(
    private rolePermissionService: RolePermissionService,
    private router: Router,
  ) {}

 

  ngOnInit(): void {
    this.loadRoles()
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


  

  trackByRoleId(index: number, role: Role): string {
    return role.id
  }
}

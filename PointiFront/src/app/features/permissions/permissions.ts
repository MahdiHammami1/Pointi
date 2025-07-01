import { Component, type OnInit } from "@angular/core"
import  { Router } from "@angular/router"
import  { RolePermissionService } from "../../service/role-permission.service"
import  { Role, Permission, RolePermissionRequest } from "../../models/role.model"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-permission",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./permissions.html",
  styleUrls: ["./permissions.css"],
})
export class PermissionComponent implements OnInit {
  selectedRole: Role | null = null
  allPermissions: Permission[] = []
  rolePermissions: Permission[] = []
  selectedPermissionIds: Set<string> = new Set()
  loading = false
  saving = false
  error: string | null = null
  successMessage: string | null = null

  constructor(
    private rolePermissionService: RolePermissionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSelectedRole()
    if (this.selectedRole) {
      this.loadPermissions()
    }
  }

  loadSelectedRole(): void {
    const roleData = localStorage.getItem("selectedRole")
    if (roleData) {
      this.selectedRole = JSON.parse(roleData)
    } else {
      // Redirect back to roles if no role selected
      this.router.navigate(["/roles"])
    }
  }

  loadPermissions(): void {
    if (!this.selectedRole) return

    this.loading = true
    this.error = null

    // Load all permissions and role-specific permissions
    Promise.all([
      this.rolePermissionService.getPermissions().toPromise(),
      this.rolePermissionService.getRolePermissions(this.selectedRole.id).toPromise(),
    ])
      .then(([allPermissions, rolePermissions]) => {
        this.allPermissions = allPermissions || []
        this.rolePermissions = rolePermissions || []

        // Initialize selected permissions
        this.selectedPermissionIds.clear()
        this.rolePermissions.forEach((permission) => {
          this.selectedPermissionIds.add(permission.id)
        })

        this.loading = false
      })
      .catch((error) => {
        this.error = "Failed to load permissions. Please try again."
        this.loading = false
        console.error("Error loading permissions:", error)
      })
  }

  togglePermission(permissionId: string): void {
    if (this.selectedPermissionIds.has(permissionId)) {
      this.selectedPermissionIds.delete(permissionId)
    } else {
      this.selectedPermissionIds.add(permissionId)
    }
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissionIds.has(permissionId)
  }

  savePermissions(): void {
    if (!this.selectedRole) return

    this.saving = true
    this.error = null
    this.successMessage = null

    const request: RolePermissionRequest = {
      permissionIds: Array.from(this.selectedPermissionIds),
    }

    this.rolePermissionService.updateRolePermissions(this.selectedRole.id, request).subscribe({
      next: () => {
        this.saving = false
        this.successMessage = "Permissions updated successfully!"

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null
        }, 3000)
      },
      error: (error) => {
        this.saving = false
        this.error = "Failed to save permissions. Please try again."
        console.error("Error saving permissions:", error)
      },
    })
  }

  goBackToRoles(): void {
    localStorage.removeItem("selectedRole")
    this.router.navigate(["/roles"])
  }

  getPermissionIcon(permissionName: string): string {
    const name = permissionName.toLowerCase()
    if (name.includes("read") || name.includes("view")) return "fas fa-eye"
    if (name.includes("write") || name.includes("create")) return "fas fa-plus"
    if (name.includes("update") || name.includes("edit")) return "fas fa-edit"
    if (name.includes("delete")) return "fas fa-trash"
    if (name.includes("admin")) return "fas fa-crown"
    if (name.includes("manage")) return "fas fa-cogs"
    return "fas fa-key"
  }

  getPermissionCategory(permissionName: string): string {
    const name = permissionName.toLowerCase()
    if (name.includes("user")) return "User Management"
    if (name.includes("role")) return "Role Management"
    if (name.includes("system")) return "System"
    if (name.includes("report")) return "Reports"
    if (name.includes("setting")) return "Settings"
    return "General"
  }

  getGroupedPermissions(): { [category: string]: Permission[] } {
    const grouped: { [category: string]: Permission[] } = {}

    this.allPermissions.forEach((permission) => {
      const category = this.getPermissionCategory(permission.nom)
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(permission)
    })

    return grouped
  }

  getSelectedCount(): number {
    return this.selectedPermissionIds.size
  }

  getTotalCount(): number {
    return this.allPermissions.length
  }
}

import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, type FormGroup, Validators } from "@angular/forms"
import { HttpClient, HttpClientModule, HttpHeaders } from "@angular/common/http"
import { catchError, switchMap } from "rxjs/operators"
import { of } from "rxjs"
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar"

interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  password?: string
  profilePicture?: string
}

@Component({
  standalone: true,
  selector: "app-profile",
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, MatSnackBarModule],
  templateUrl: "./profile.html",
  styleUrls: ["./profile.css"],
})
export class Profile implements OnInit {
  profileForm: FormGroup
  isEditMode = false
  isLoading = false
  currentUser: User | null = null
  selectedFile: File | null = null
  profilePicturePreview: string | null = null

  // Mock user ID - replace with actual authentication service
  private currentUserId = "123e4567-e89b-12d3-a456-426614174000"

  private fb = inject(FormBuilder)
  private http = inject(HttpClient)
  private snackBar = inject(MatSnackBar)

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      username: ["", [Validators.required, Validators.minLength(3)]],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", [Validators.pattern(/^\+?[\d\s\-$$$$]+$/)]],
      dateOfBirth: [""],
      password: ["", [Validators.minLength(6)]],
    })
  }

  ngOnInit() {
    this.loadUserProfile()
  }

   private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
  }

 async loadUserProfile() {
  this.isLoading = true;
  try {
    // First get the current user's data
    const currentUser = await this.http.get<User>('http://localhost:8080/users/me', { headers: this.getHeaders() })
      .pipe(
        catchError(error => {
          console.error("Failed to fetch current user:", error);
          return of(null);
        })
      )
      .toPromise();

    if (!currentUser?.id) {
      throw new Error("User data not available");
    }

    // Now fetch full profile data using the ID
    const user = await this.http.get<User>(`http://localhost:8080/users/${currentUser.id}`, { headers: this.getHeaders() })
      .pipe(
        catchError(() => of({
          id: currentUser.id,
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "john.doe@example.com",
          phoneNumber: "+1234567890",
          dateOfBirth: "1990-01-15",
          profilePicture: "assets/images/placeholder.svg",
        } as User))
      )
      .toPromise();

    this.currentUser = user || null;
    if (this.currentUser) {
      this.profileForm.patchValue(this.currentUser);
      this.profilePicturePreview = this.currentUser.profilePicture || null;
    }
  } catch (error) {
    console.error("Profile load error:", error);
    this.showMessage("Failed to load profile data", "error");
  } finally {
    this.isLoading = false;
  }
}


  toggleEditMode() {
    this.isEditMode = !this.isEditMode
    if (!this.isEditMode) {
      // Reset form to original values when canceling edit
      this.loadUserProfile()
      this.selectedFile = null
    }
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0]

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        this.profilePicturePreview = e.target?.result as string
      }
      reader.readAsDataURL(this.selectedFile)
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true

      const updatedUser: User = {
        ...this.currentUser,
        ...this.profileForm.value,
      }

      // Remove password if empty
      if (!updatedUser.password) {
        delete updatedUser.password
      }

      this.http
        .put<User>(`http://localhost:8080/users/${this.currentUserId}`, updatedUser)
        .pipe(
          catchError((error) => {
            console.error("Failed to update profile:", error)
            this.showMessage("Failed to update profile", "error")
            this.isLoading = false
            return of(null)
          }),
        )
        .subscribe((response) => {
          if (response) {
            this.currentUser = response
            this.isEditMode = false
            this.isLoading = false
            this.showMessage("Profile updated successfully", "success")

            // Handle profile picture upload if selected
            if (this.selectedFile) {
              this.uploadProfilePicture()
            }
          }
        })
    } else {
      this.showMessage("Please fill out all required fields correctly", "error")
    }
  }

  uploadProfilePicture() {
    if (this.selectedFile && this.currentUser) {
      const formData = new FormData()
      formData.append("profilePicture", this.selectedFile)

      this.http
        .post(`http://localhost:8080/users/me/${this.currentUserId}/profile-picture`, formData)
        .pipe(
          catchError((error) => {
            console.error("Failed to upload profile picture:", error)
            this.showMessage("Failed to upload profile picture", "error")
            return of(null)
          }),
        )
        .subscribe((response) => {
          if (response) {
            this.showMessage("Profile picture updated successfully", "success")
            this.selectedFile = null
          }
        })
    }
  }

  private showMessage(message: string, type: "success" | "error") {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      panelClass: type === "success" ? "success-snackbar" : "error-snackbar",
      verticalPosition: "top",
    })
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName)
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} is required`
      if (field.errors["email"]) return "Please enter a valid email"
      if (field.errors["minlength"]) return `${fieldName} is too short`
      if (field.errors["pattern"]) return "Please enter a valid phone number"
    }
    return ""
  }
}

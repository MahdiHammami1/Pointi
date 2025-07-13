import { Component, OnInit } from '@angular/core';
// Update the path below to the correct relative path if needed
import { Badge, Visitor } from '../../models/visitor.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VisitorService } from '../../service/visitor.services';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-visitors',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule  , ReactiveFormsModule],
  templateUrl: './visitors.html',
  styleUrls: ['./visitors.css']
})
export class VisitorsComponent implements OnInit {
 badges: Badge[] = [];
selectedVisitorId?: number;
selectedBadgeId?: string;

  visitors: Visitor[] = [];
  filteredVisitors: Visitor[] = [];
  visitorForm!: FormGroup;

  searchTerm = '';
  loading = false;
  showSuccessAlert = false;
  showErrorAlert = false;
  successMessage = '';
  errorMessage = '';

  constructor(private visitorService: VisitorService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadVisitors();
  }

  initForm() {
    this.visitorForm = this.fb.group({
      nomPrenom: ['', Validators.required],
      cin: [null, Validators.required],
      organisation: ['', Validators.required]
    });
  }

  loadVisitors() {
    this.loading = true;
    this.visitorService.getAll().subscribe({
      next: data => {
        this.visitors = data.map((item: any) => ({
          nomPrenom: item.nomPrenom,
          cin: item.cin,
          organisation: item.organisation,
          id: item.id // add other properties if needed
        }));
        this.filteredVisitors = this.visitors;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error(err);
      }
    });
  }

  createVisitor() {
    if (this.visitorForm.invalid) return;

    const visitor = this.visitorForm.value;
    this.visitorService.create(visitor).subscribe({
      next: v => {
        this.successMessage = 'Visitor created successfully';
        this.showSuccessAlert = true;
        this.visitorForm.reset();
        this.loadVisitors();
      },
      error: err => {
        this.errorMessage = 'Error while creating visitor';
        this.showErrorAlert = true;
        console.error(err);
      }
    });
  }

  deleteVisitor(id: number) {
    if (confirm('Are you sure you want to delete this visitor?')) {
      this.visitorService.delete(id).subscribe(() => {
        this.visitors = this.visitors.filter(v => v.id !== id);
        this.filteredVisitors = this.filteredVisitors.filter(v => v.id !== id);
      });
    }
  }

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredVisitors = !term ? this.visitors : this.visitors.filter(visitor =>
      visitor.nomPrenom.toLowerCase().includes(term) ||
      visitor.organisation.toLowerCase().includes(term) ||
      visitor.cin.toString().includes(term)
    );
  }

  getBadgeName(visitor: Visitor): string {
  return visitor.badge ? `${visitor.badge.name} (${visitor.badge.color})` : 'No badge';
}

openEditBadgeModal(visitorId: number): void {
  this.selectedVisitorId = visitorId;
}

assignBadgeToVisitor(): void {
  if (!this.selectedVisitorId || !this.selectedBadgeId) return;

  this.visitorService.assignBadge(this.selectedVisitorId, this.selectedBadgeId).subscribe({
    next: () => {
      this.loadVisitors();
    },
    error: err => {
      console.error('Error assigning badge to visitor', err);
    }
  });
}



}

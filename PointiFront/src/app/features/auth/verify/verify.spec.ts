import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Verify } from './verify';



describe('VerifyComponent', () => {
  let component: Verify;
  let fixture: ComponentFixture<Verify>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Verify]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Verify);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
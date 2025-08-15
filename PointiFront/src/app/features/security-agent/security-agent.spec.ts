import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityAgentComponent } from './security-agent';


describe('SecurityAgent', () => {
  let component: SecurityAgentComponent;
  let fixture: ComponentFixture<SecurityAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityAgentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

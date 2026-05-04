import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingVoluntarioComponent } from './onboarding-voluntario.component';

describe('OnboardingVoluntarioComponent', () => {
  let component: OnboardingVoluntarioComponent;
  let fixture: ComponentFixture<OnboardingVoluntarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingVoluntarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

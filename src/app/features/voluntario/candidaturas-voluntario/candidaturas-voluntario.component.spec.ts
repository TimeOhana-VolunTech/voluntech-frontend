import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidaturasVoluntarioComponent } from './candidaturas-voluntario.component';

describe('CandidaturasVoluntarioComponent', () => {
  let component: CandidaturasVoluntarioComponent;
  let fixture: ComponentFixture<CandidaturasVoluntarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidaturasVoluntarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidaturasVoluntarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

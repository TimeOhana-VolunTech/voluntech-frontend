import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoCandidatosComponent } from './gestao-candidatos.component';

describe('GestaoCandidatosComponent', () => {
  let component: GestaoCandidatosComponent;
  let fixture: ComponentFixture<GestaoCandidatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestaoCandidatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestaoCandidatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

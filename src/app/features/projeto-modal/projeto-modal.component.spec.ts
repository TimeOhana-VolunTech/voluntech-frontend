import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoModalComponent } from './projeto-modal.component';

describe('ProjetoModalComponent', () => {
  let component: ProjetoModalComponent;
  let fixture: ComponentFixture<ProjetoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

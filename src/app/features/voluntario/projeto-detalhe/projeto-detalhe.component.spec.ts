import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetoDetalheComponent } from './projeto-detalhe.component';

describe('ProjetoDetalheComponent', () => {
  let component: ProjetoDetalheComponent;
  let fixture: ComponentFixture<ProjetoDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetoDetalheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetoDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

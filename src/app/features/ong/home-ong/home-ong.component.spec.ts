import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOngComponent } from './home-ong.component';

describe('HomeOngComponent', () => {
  let component: HomeOngComponent;
  let fixture: ComponentFixture<HomeOngComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeOngComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeOngComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

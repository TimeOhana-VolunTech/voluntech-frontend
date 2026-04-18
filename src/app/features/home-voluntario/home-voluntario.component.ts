import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home-voluntario',
  standalone: true,
  imports: [],
  templateUrl: './home-voluntario.component.html',
  styleUrl: './home-voluntario.component.css'
})
export class HomeVoluntarioComponent implements OnInit {
  nomeVoluntario: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Recupera os dados salvos no momento do login
    const dados = this.authService.getUsuarioAtual();
    this.nomeVoluntario = dados?.nome || 'Voluntário';
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

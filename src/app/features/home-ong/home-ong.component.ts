import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home-ong',
  standalone: true,
  imports: [],
  templateUrl: './home-ong.component.html',
  styleUrl: './home-ong.component.css'
})
export class HomeOngComponent implements OnInit {
  nomeUsuario: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const dados = this.authService.getUsuarioAtual();
    this.nomeUsuario = dados?.nome || 'ONG';
  }

  sair() {
    this.authService.logout();
    window.location.href = '/login';
  }
}

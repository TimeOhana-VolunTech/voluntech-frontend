import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Método opcional caso queira clicar no logo e voltar para a home correta
  irParaHome(): void {
    const usuario = this.authService.getUsuarioAtual();
    if (usuario?.cnpj) {
      this.router.navigate(['/home-ong']);
    } else {
      this.router.navigate(['/home-voluntario']);
    }
  }
}

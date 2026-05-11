import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Notificacao, NotificacaoService } from '../../core/services/notificacao.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  notificacoes: Notificacao[] = [];
  contadorPendentes = 0;
  exibirMenuNotif = false;
  usuario: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificacaoService: NotificacaoService,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuarioAtual();
    if (this.usuario) {
      this.carregarNotificacoes();

      // Atualiza o sino a cada 2 minutos (opcional)
      setInterval(() => {
        this.carregarNotificacoes();
      }, 120000);
    }
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irParaHome(): void {
    const usuario = this.authService.getUsuarioAtual();
    if (usuario?.cnpj) {
      this.router.navigate(['/home-ong']);
    } else {
      this.router.navigate(['/home-voluntario']);
    }
  }

  carregarNotificacoes() {
    const tipo = this.usuario.cnpj ? 'ONG' : 'VOLUNTARIO';
    this.notificacaoService.listar(tipo, this.usuario.id).subscribe(data => {
      this.notificacoes = data;
      this.contadorPendentes = data.filter(n => !n.lida).length;
    });
  }

  toggleNotificacoes() {
    this.exibirMenuNotif = !this.exibirMenuNotif;
  }

  lerNotificacao(n: Notificacao) {
    if (!n.lida) {
      this.notificacaoService.marcarComoLida(n.id).subscribe(() => {
        n.lida = true;
        this.contadorPendentes--;
      });
    }
  }
}

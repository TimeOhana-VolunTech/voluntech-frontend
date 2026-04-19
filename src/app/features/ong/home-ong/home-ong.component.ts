import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProjetoService } from '../../../core/services/projeto.service';
import { Router } from '@angular/router';
import { Projeto } from '../../../core/models/projeto.model';
import { HeaderComponent } from '../../header/header.component';
import { ProjetoModalComponent } from '../../projeto-modal/projeto-modal.component';

@Component({
  selector: 'app-home-ong',
  standalone: true,
  imports: [ CommonModule, HeaderComponent, ProjetoModalComponent ],
  templateUrl: './home-ong.component.html',
  styleUrl: './home-ong.component.css'
})
export class HomeOngComponent implements OnInit {
  nomeUsuario: string = '';
  projetos: Projeto[] = [];
  projetoSelecionado: Projeto | null = null;

  constructor(
    private authService: AuthService,
    private projetoService: ProjetoService,
    private router: Router // Injete o router
  ) {}

  ngOnInit() {
    const dados = this.authService.getUsuarioAtual();
    this.nomeUsuario = dados?.nome || 'ONG';

    if (dados?.id) {
      this.carregarProjetos(dados.id);
    }
  }

  carregarProjetos(id: number) {
    this.projetoService.listarPorOng(id).subscribe({
      next: (data) => this.projetos = data,
      error: (err) => console.error('Erro ao carregar projetos', err)
    });
  }

  irParaNovoProjeto() {
    this.router.navigate(['/novo-projeto']);
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirDetalhes(p: Projeto) {
    this.projetoSelecionado = p;
  }

  fecharModal() {
    this.projetoSelecionado = null;
  }
}

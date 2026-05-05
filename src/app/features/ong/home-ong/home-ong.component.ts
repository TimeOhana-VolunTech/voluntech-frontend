import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProjetoService } from '../../../core/services/projeto.service';
import { Router } from '@angular/router';
import { Projeto } from '../../../core/models/projeto.model';
import { HeaderComponent } from '../../header/header.component';
import { ProjetoModalComponent } from '../../projeto-modal/projeto-modal.component';
import Swal from 'sweetalert2';
import { StatusProjeto } from '../../../core/models/enums/status-projeto.enum';

@Component({
  selector: 'app-home-ong',
  standalone: true,
  imports: [ CommonModule, HeaderComponent, ProjetoModalComponent ],
  templateUrl: './home-ong.component.html',
  styleUrl: './home-ong.component.css'
})
export class HomeOngComponent implements OnInit {
  StatusProjeto = StatusProjeto;
  nomeUsuario: string = '';
  usuarioId: number | null = null;
  projetos: Projeto[] = [];
  projetoSelecionado: Projeto | null = null;

  constructor(
    private authService: AuthService,
    private projetoService: ProjetoService,
    private router: Router
  ) {}

  ngOnInit() {
    const dados = this.authService.getUsuarioAtual();
    this.nomeUsuario = dados?.nome || 'ONG';
    this.usuarioId = dados?.id || null;

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

  recarregarLista() {
    if (this.usuarioId) {
      this.carregarProjetos(this.usuarioId);
    }
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

  irParaEditar(id: number) {
    this.router.navigate(['/editar-projeto', id]);
  }

  alternarStatus(projeto: Projeto) {
    const novoStatus = projeto.status === StatusProjeto.ATIVA
    ? StatusProjeto.PAUSADA
    : StatusProjeto.ATIVA;

    this.projetoService.alterarStatus(projeto.id!, novoStatus).subscribe({
      next: () => {
        projeto.status = novoStatus; // Atualiza na tela sem recarregar tudo
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: `Projeto ${novoStatus === 'ATIVA' ? 'Reativado' : 'Pausado'}`,
          showConfirmButton: false, timer: 2000
        });
      }
    });
  }

  excluirProjeto(id: number) {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Esta ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Sim, excluir!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projetoService.excluir(id).subscribe({
          next: () => {
            this.projetos = this.projetos.filter(p => p.id !== id);
            Swal.fire('Excluído!', 'O projeto foi removido.', 'success');
          }
        });
      }
    });
  }

}

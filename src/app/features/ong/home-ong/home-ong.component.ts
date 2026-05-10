import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ProjetoService } from '../../../core/services/projeto.service';
import { Router } from '@angular/router';
import { Projeto } from '../../../core/models/projeto.model';
import { HeaderComponent } from '../../header/header.component';
import { ProjetoModalComponent } from '../projeto-modal/projeto-modal.component';
import Swal from 'sweetalert2';
import { StatusProjeto } from '../../../core/models/enums/status-projeto.enum';
import { GestaoCandidatosComponent } from '../gestao-candidatos/gestao-candidatos.component';

@Component({
  selector: 'app-home-ong',
  standalone: true,
  imports: [ CommonModule, HeaderComponent, ProjetoModalComponent, GestaoCandidatosComponent ],
  templateUrl: './home-ong.component.html',
  styleUrl: './home-ong.component.css'
})
export class HomeOngComponent implements OnInit {
  StatusProjeto = StatusProjeto;
  nomeUsuario: string = '';
  usuarioId: number | null = null;
  projetos: Projeto[] = [];
  projetoSelecionado: Projeto | null = null;
  projetoParaGestao: number | null = null;
  abaAtiva: 'ativos' | 'historico' = 'ativos';

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
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projetoService.excluir(id).subscribe({
          next: () => {
            this.projetos = this.projetos.filter(p => p.id !== id);
            Swal.fire('Excluído!', 'O projeto foi removido com sucesso.', 'success');
          },
          error: (err) => {
            // Captura a mensagem que enviamos no Java (RuntimeException)
            const mensagemErro = err.error || 'Não foi possível excluir o projeto.';

            Swal.fire({
              title: 'Não é possível excluir',
              text: mensagemErro,
              icon: 'error',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Entendi'
            });

            console.error('Erro ao excluir:', err);
          }
        });
      }
    });
  }

  abrirCandidatos(projetoId: number) {
    this.projetoParaGestao = projetoId;
  }

  fecharGestao() {
    this.projetoParaGestao = null;
  }

  isPrazoProximo(prazo: any): boolean {
    if (!prazo) return false;
    const dataPrazo = new Date(prazo);
    const hoje = new Date();

    // Calcula a diferença em dias
    const diffTime = dataPrazo.getTime() - hoje.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Retorna true se faltar 1 dia ou se o prazo for hoje
    return diffDays >= 0 && diffDays <= 1;
  }

  // Filtros dinâmicos para o HTML
  get projetosFiltrados() {
    if (this.abaAtiva === 'ativos') {
      // Agora mostra APENAS os que estão com status ATIVA
      return this.projetos.filter(p => p.status === StatusProjeto.ATIVA);
    } else {
      // O Histórico agora mostra PAUSADA (pausa manual) e FINALIZADA (pelo tempo)
      return this.projetos.filter(p => p.status === StatusProjeto.PAUSADA || p.status === StatusProjeto.FINALIZADA);
    }
  }

  // Método para trocar de aba
  setAba(aba: 'ativos' | 'historico') {
    this.abaAtiva = aba;
  }

}

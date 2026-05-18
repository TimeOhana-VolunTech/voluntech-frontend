import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { Candidatura, CandidaturaService } from '../../../core/services/candidatura.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjetoDetalheComponent } from '../projeto-detalhe/projeto-detalhe.component';
import { ProjetoService } from '../../../core/services/projeto.service';
import { Projeto } from '../../../core/models/projeto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidaturas-voluntario',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ProjetoDetalheComponent],
  templateUrl: './candidaturas-voluntario.component.html',
  styleUrl: './candidaturas-voluntario.component.css'
})
export class CandidaturasVoluntarioComponent implements OnInit {

  private candidaturaService = inject(CandidaturaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private projetoService = inject(ProjetoService);

  candidaturas: Candidatura[] = [];
  projetoSelecionado: Projeto | null = null;

  ngOnInit() {
    const user = this.authService.getUsuarioAtual();
    if (user?.id) {
      this.candidaturaService.listarPorVoluntario(user.id).subscribe({
        next: (res) => this.candidaturas = res
      });
    }
  }

  desistirDaInscricao(event: Event, candidatura: Candidatura) {
    event.stopPropagation(); // Impede que o clique no botão abra os detalhes da vaga

    Swal.fire({
      title: 'Tem certeza?',
      text: `Você deseja desistir da sua inscrição na vaga "${candidatura.projetoTitulo}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Vermelho para ação destrutiva
      cancelButtonColor: '#64748b', // Cinza neutro da nossa paleta
      confirmButtonText: 'Sim, quero desistir',
      cancelButtonText: 'Voltar',
    }).then((result) => {
      // Se o usuário confirmou a ação
      if (result.isConfirmed) {
        this.candidaturaService.cancelarCandidatura(candidatura.id).subscribe({
          next: () => {
            candidatura.status = 'CANCELADO';

            // Alerta de Sucesso
            Swal.fire({
              title: 'Inscrição Cancelada',
              text: 'Sua desistência foi registrada com sucesso.',
              icon: 'success',
              confirmButtonColor: '#2e7d32', // Nosso verde padrão
            });
          },
          error: (err) => {
            console.error('Erro ao cancelar candidatura', err);

            // Alerta de Erro
            Swal.fire({
              title: 'Erro operacional',
              text: 'Não foi possível processar o cancelamento no momento. Tente novamente mais tarde.',
              icon: 'error',
              confirmButtonColor: '#64748b',
            });
          }
        });
      }
    });
  }

  reinscreverNoProjeto(event: Event, candidatura: Candidatura) {
    event.stopPropagation();

    Swal.fire({
      title: 'Mudou de ideia?',
      text: `Deseja reativar sua inscrição na vaga "${candidatura.projetoTitulo}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, me inscrever',
      cancelButtonText: 'Voltar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Chamamos o mesmo método de atualizar status, mas agora passando "PENDENTE"
        this.candidaturaService.atualizarStatus(candidatura.id, 'PENDENTE').subscribe({
          next: () => {
            candidatura.status = 'PENDENTE';

            Swal.fire({
              title: 'Inscrito!',
              text: 'Sua candidatura foi reativada e a ONG foi notificada.',
              icon: 'success',
              confirmButtonColor: '#2e7d32',
            });
          },
          error: () => {
            Swal.fire({
              title: 'Erro',
              text: 'Não foi possível reativar sua inscrição.',
              icon: 'error',
              confirmButtonColor: '#64748b'
            });
          }
        });
      }
    });
  }

  verDetalhes(candidatura: Candidatura) {
    this.projetoService.buscarPorId(candidatura.projetoId).subscribe({
      next: (projeto) => {
        this.projetoSelecionado = {
          ...projeto,
          statusCandidatura: candidatura.status,
          jaInscrito: true
        };
      },
      error: () => console.error('Erro ao carregar detalhes da vaga')
    });
  }

  fecharModal() {
    this.projetoSelecionado = null;
  }

  voltar() {
    this.router.navigate(['/home-voluntario']);
  }

}

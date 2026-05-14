import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Projeto } from '../../../core/models/projeto.model';
import { CommonModule } from '@angular/common';
import { ProjetoService } from '../../../core/services/projeto.service';
import { Router } from '@angular/router';
import { StatusProjeto } from '../../../core/models/enums/status-projeto.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projeto-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projeto-modal.component.html',
  styleUrl: './projeto-modal.component.css'
})
export class ProjetoModalComponent {
  @Input() projeto: Projeto | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() atualizou = new EventEmitter<void>();

  private projetoService = inject(ProjetoService);
  private router = inject(Router);
  StatusProjeto = StatusProjeto;

  fechar() {
    this.close.emit();
  }

  irParaEditar() {
    if (this.projeto?.id) {
      this.fechar();
      this.router.navigate(['/editar-projeto', this.projeto.id]);
    }
  }

  // Função auxiliar para validar se o prazo já expirou
  private isPrazoVencido(prazo: any): boolean {
    if (!prazo) return true;
    const dataPrazo = new Date(prazo);
    dataPrazo.setHours(23, 59, 59, 999); // Final do dia informado
    return dataPrazo < new Date();
  }

  alternarStatus() {
    if (!this.projeto) return;

    // Se o usuário está tentando ATIVAR o projeto
    if (this.projeto.status !== StatusProjeto.ATIVA) {
      if (this.isPrazoVencido(this.projeto.prazo)) {
        Swal.fire({
          title: 'Prazo Encerrado',
          text: 'Não é possível ativar um projeto com o prazo vencido. Atualize a data de inscrição primeiro.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#2e7d32',
          confirmButtonText: 'Editar Prazo',
          cancelButtonText: 'Voltar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.irParaEditar();
          }
        });
        return; // Bloqueia a execução do serviço de alteração de status
      }
    }

    // Fluxo normal caso o prazo esteja OK ou o objetivo seja PAUSAR
    const novoStatus = this.projeto.status === StatusProjeto.ATIVA ? StatusProjeto.PAUSADA : StatusProjeto.ATIVA;

    this.projetoService.alterarStatus(this.projeto.id!, novoStatus).subscribe({
      next: () => {
        this.projeto!.status = novoStatus;
        this.atualizou.emit();
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: `Projeto ${novoStatus === StatusProjeto.ATIVA ? 'Reativado' : 'Pausado'}`,
          showConfirmButton: false, timer: 2000
        });
      }
    });
  }

  excluir() {
    if (!this.projeto?.id) return;

    Swal.fire({
      title: 'Excluir Projeto?',
      text: "Esta ação não pode ser revertida!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir'
    }).then((result) => {
      if (result.isConfirmed) {
        this.projetoService.excluir(this.projeto!.id!).subscribe({
          next: () => {
            this.atualizou.emit();
            this.fechar();
            Swal.fire('Deletado!', 'O projeto foi removido.', 'success');
          }
        });
      }
    });
  }

  getImagemProjeto(): string {

    const imagemPadrao = 'https://picsum.photos/id/1/800/400';

    if (!this.projeto || !this.projeto.categoria) {
      return imagemPadrao;
    }

    const imagens: { [key: string]: string } = {
      'EDUCACAO': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800',
      'SAUDE': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800',
      'TECNOLOGIA': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
      'MEIO_AMBIENTE': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800',
      'ASSISTENCIA_SOCIAL': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800'
    };

    return imagens[this.projeto.categoria] || imagemPadrao;  }
}

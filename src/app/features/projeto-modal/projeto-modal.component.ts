import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Projeto } from '../../core/models/projeto.model';
import { CommonModule } from '@angular/common';
import { ProjetoService } from '../../core/services/projeto.service';
import { Router } from '@angular/router';
import { StatusProjeto } from '../../core/models/enums/status-projeto.enum';
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

  alternarStatus() {
    if (!this.projeto) return;
    const novoStatus = this.projeto.status === StatusProjeto.ATIVA ? StatusProjeto.PAUSADA : StatusProjeto.ATIVA;

    this.projetoService.alterarStatus(this.projeto.id!, novoStatus).subscribe({
      next: () => {
        this.projeto!.status = novoStatus;
        this.atualizou.emit(); // Notifica a Home
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
            this.atualizou.emit(); // Notifica a Home que o projeto sumiu
            this.fechar();
            Swal.fire('Deletado!', 'O projeto foi removido.', 'success');
          }
        });
      }
    });
  }

  // Retorna uma imagem temática baseada na categoria
  getImagemProjeto(): string {

    const imagemPadrao = 'https://picsum.photos/id/1/800/400';

    if (!this.projeto || !this.projeto.categoria) {
      return imagemPadrao;
    }

    const imagens: { [key: string]: string } = {
      'EDUCACAO': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800',
      'SAUDE': 'https://images.unsplash.com/photo-1505751172107-111161a0676b?q=80&w=800',
      'TECNOLOGIA': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
      'MEIO_AMBIENTE': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800',
      'ASSISTENCIA_SOCIAL': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800'
    };

    // Caso não tenha categoria ou a categoria não esteja no mapa, retorna uma genérica
    return imagens[this.projeto.categoria] || imagemPadrao;  }
}

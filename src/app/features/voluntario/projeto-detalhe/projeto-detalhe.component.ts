import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Projeto } from '../../../core/models/projeto.model';
import Swal from 'sweetalert2';
import { ProjetoService } from '../../../core/services/projeto.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-projeto-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projeto-detalhe.component.html',
  styleUrl: './projeto-detalhe.component.css'
})
export class ProjetoDetalheComponent {
  @Input() projeto: Projeto | null = null;
  @Input() mostrarBotaoCandidatar: boolean = true;
  @Output() close = new EventEmitter<void>();

  private projetoService = inject(ProjetoService);
  private authService = inject(AuthService);

  fechar() {
    this.close.emit();
  }

  candidatar() {
    const usuario = this.authService.getUsuarioAtual();

    if (!usuario || !this.projeto?.id) {
      Swal.fire('Erro', 'Você precisa estar logado para se candidatar.', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmar Candidatura?',
      text: `Você está se candidatando para: ${this.projeto.titulo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero ajudar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.projetoService.candidatar(this.projeto!.id!, usuario.id).subscribe({
          next: () => {
            Swal.fire(
              'Inscrição Enviada!',
              'A ONG receberá seu perfil e entrará em contato.',
              'success'
            );
            this.fechar();
          },
          error: (err) => {
            // Trata o erro de candidatura duplicada ou outros
            const mensagem = err.error || 'Não foi possível realizar sua inscrição.';
            Swal.fire('Ops!', mensagem, 'warning');
          }
        });
      }
    });
  }

  getImagemProjeto(): string {
    const imagemPadrao = 'https://picsum.photos/id/1/800/400';
    if (!this.projeto || !this.projeto.categoria) return imagemPadrao;

    const imagens: { [key: string]: string } = {
      'EDUCACAO': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800',
      'SAUDE': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800',
      'TECNOLOGIA': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
      'MEIO_AMBIENTE': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800',
      'ASSISTENCIA_SOCIAL': 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800'
    };
    return imagens[this.projeto.categoria] || imagemPadrao;
  }
}

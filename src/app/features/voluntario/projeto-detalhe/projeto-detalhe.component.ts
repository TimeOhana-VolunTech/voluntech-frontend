import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Projeto } from '../../../core/models/projeto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projeto-detalhe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projeto-detalhe.component.html',
  styleUrl: './projeto-detalhe.component.css'
})
export class ProjetoDetalheComponent {
  @Input() projeto: Projeto | null = null;
  @Output() close = new EventEmitter<void>();

  fechar() {
    this.close.emit();
  }

  candidatar() {
    Swal.fire({
      title: 'Confirmar Candidatura?',
      text: `Você está se candidatando para: ${this.projeto?.titulo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero ajudar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Inscrição Enviada!',
          'A ONG receberá seu perfil e entrará em contato por e-mail.',
          'success'
        );
        this.fechar();
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

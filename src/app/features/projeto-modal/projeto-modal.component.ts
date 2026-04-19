import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Projeto } from '../../core/models/projeto.model';
import { CommonModule } from '@angular/common';

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

  fechar() {
    this.close.emit();
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

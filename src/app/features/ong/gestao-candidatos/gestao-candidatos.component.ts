import { Component, Input, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CandidaturaService, CandidatoExibicao } from '../../../core/services/candidatura.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestao-candidatos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestao-candidatos.component.html',
  styleUrl: './gestao-candidatos.component.css'
})
export class GestaoCandidatosComponent implements OnInit {
  @Input() projetoId!: number;
  @Output() fechar = new EventEmitter<void>();
  @Output() statusAlterado = new EventEmitter<void>();

  private candidaturaService = inject(CandidaturaService);
  candidatos: CandidatoExibicao[] = [];

  ngOnInit() {
    this.carregarCandidatos();
  }

  carregarCandidatos() {
    this.candidaturaService.listarCandidatosPorProjeto(this.projetoId).subscribe(data => {
      this.candidatos = data;
    });
  }

  mudarStatus(candidato: CandidatoExibicao, status: 'APROVADO' | 'RECUSADO') {
    this.candidaturaService.atualizarStatus(candidato.candidaturaId, status).subscribe(() => {
      candidato.status = status;

      // EMITA O EVENTO AQUI
      this.statusAlterado.emit();

      Swal.fire('Sucesso', `Voluntário ${status === 'APROVADO' ? 'Aprovado' : 'Recusado'}!`, 'success');
    });
  }

  abrirWhatsapp(telefone: string, nome: string) {
    if (!telefone) {
      Swal.fire('Ops!', 'Este voluntário não cadastrou um telefone.', 'warning');
      return;
    }

    // Limpa caracteres especiais (parênteses, traços, espaços)
    let numeroLimpo = telefone.replace(/\D/g, '');

    // Adiciona o DDI 55 se o usuário não tiver colocado
    if (numeroLimpo.length <= 11) {
      numeroLimpo = '55' + numeroLimpo;
    }

    const mensagem = encodeURIComponent(`Olá ${nome}, vimos seu interesse no projeto através da plataforma Voluntech!`);
    const link = `https://api.whatsapp.com/send?phone=${numeroLimpo}&text=${mensagem}`;

    window.open(link, '_blank');
  }

  // Helper para garantir que habilidades seja sempre um array, evitando erro no *ngFor
  getHabilidades(candidato: CandidatoExibicao): string[] {
    return candidato.habilidades || [];
  }

  todosRecusados(): boolean {
    return this.candidatos.every(c => c.status === 'RECUSADO');
  }

}

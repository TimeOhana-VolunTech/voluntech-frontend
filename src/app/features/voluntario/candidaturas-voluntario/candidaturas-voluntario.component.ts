import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { Candidatura, CandidaturaService } from '../../../core/services/candidatura.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjetoDetalheComponent } from '../projeto-detalhe/projeto-detalhe.component';
import { ProjetoService } from '../../../core/services/projeto.service';
import { Projeto } from '../../../core/models/projeto.model';

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

  verDetalhes(candidatura: Candidatura) {
    this.projetoService.buscarPorId(candidatura.projetoId).subscribe({
      next: (projeto) => {
        this.projetoSelecionado = projeto;
      },
      error: () => {
        console.error('Erro ao carregar detalhes do projeto');
      }
    });
  }

  fecharModal() {
    this.projetoSelecionado = null;
  }

  voltar() {
    this.router.navigate(['/home-voluntario']);
  }

}

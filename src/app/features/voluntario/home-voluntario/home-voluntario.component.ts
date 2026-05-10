import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjetoService } from '../../../core/services/projeto.service';
import { Projeto } from '../../../core/models/projeto.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HeaderComponent } from "../../header/header.component";
import { ProjetoDetalheComponent } from "../projeto-detalhe/projeto-detalhe.component";
import { CandidaturaService } from '../../../core/services/candidatura.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home-voluntario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HeaderComponent, ProjetoDetalheComponent],
  templateUrl: './home-voluntario.component.html',
  styleUrl: './home-voluntario.component.css'
})
export class HomeVoluntarioComponent implements OnInit {

  private candidaturaService = inject(CandidaturaService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private projetoService = inject(ProjetoService);

  nomeVoluntario: string = '';
  projetos: Projeto[] = [];
  isCarregando: boolean = false;
  projetoSelecionado: Projeto | null = null;
  filtroBusca = new FormControl('');
  categoriaSelecionada: string = '';
  modalidadeSelecionada: string = '';
  idsProjetosInscritos: number[] = [];

  ngOnInit() {
    const dados = this.authService.getUsuarioAtual();
    this.nomeVoluntario = dados?.nome || 'Voluntário';

    this.carregarDadosIniciais();

    this.filtroBusca.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(termo => {
      this.carregarProjetos(termo || '');
    });
  }

  carregarDadosIniciais() {
    this.isCarregando = true;
    const usuario = this.authService.getUsuarioAtual();

    // forkJoin executa as duas chamadas e espera ambas terminarem
    forkJoin({
      projetos: this.projetoService.explorar(this.categoriaSelecionada, this.modalidadeSelecionada, ''),
      candidaturas: this.candidaturaService.listarPorVoluntario(usuario.id)
    }).subscribe({
      next: (res) => {
        this.idsProjetosInscritos = res.candidaturas.map(c => c.projetoId);
        this.processarProjetos(res.projetos);
        this.isCarregando = false;
      },
      error: (err) => {
        console.error(err);
        this.isCarregando = false;
      }
    });
  }

  carregarProjetos(termo: string = ''): void {
    this.isCarregando = true;
    this.projetoService.explorar(this.categoriaSelecionada, this.modalidadeSelecionada, termo)
      .subscribe({
        next: (data) => {
          this.processarProjetos(data);
          this.isCarregando = false;
        }
      });
  }

  processarProjetos(data: Projeto[]) {
    this.projetos = data.map(p => ({
      ...p,
      // Se o ID do projeto estiver na lista de inscritos, marca como true
      jaInscrito: this.idsProjetosInscritos.includes(p.id!)
    })).sort((a, b) => {
      // Ordenação: Projetos inscritos (true) vão para o final (1), não inscritos (false) ficam no início (-1)
      return (a.jaInscrito === b.jaInscrito) ? 0 : a.jaInscrito ? 1 : -1;
    });
  }

  aplicarFiltros() {
    this.carregarProjetos(this.filtroBusca.value || '');
  }

  limparFiltros() {
    this.filtroBusca.setValue('');
    this.categoriaSelecionada = '';
    this.modalidadeSelecionada = '';
    this.carregarProjetos();
  }

  irParaPerfil() {
    this.router.navigate(['/perfil-voluntario']);
  }

  irParaCandidaturas() {
    this.router.navigate(['/candidatura-voluntario']);
  }

  verDetalhes(projeto: Projeto) {
    this.projetoSelecionado = projeto;
  }

  fecharModal() {
    this.projetoSelecionado = null;
    this.carregarDadosIniciais(); // Recarrega para atualizar o card que acabou de se inscrever
  }
}

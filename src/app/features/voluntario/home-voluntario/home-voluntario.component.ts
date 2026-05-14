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
  candidaturasUsuario: any[] = [];

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

    forkJoin({
      projetos: this.projetoService.explorar(this.categoriaSelecionada, this.modalidadeSelecionada, ''),
      candidaturas: this.candidaturaService.listarPorVoluntario(usuario.id)
    }).subscribe({
      next: (res) => {
        this.candidaturasUsuario = res.candidaturas; // Guarda a lista completa
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
    this.projetos = data.map(p => {
      // Busca a candidatura correspondente a este projeto
      const candidatura = this.candidaturasUsuario.find(c => c.projetoId === p.id);

      return {
        ...p,
        jaInscrito: !!candidatura,
        statusCandidatura: candidatura ? candidatura.status : null // Agora passamos o status real!
      };
    }).sort((a, b) => {
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

  limparBusca() {
    this.filtroBusca.setValue('');
  }
}

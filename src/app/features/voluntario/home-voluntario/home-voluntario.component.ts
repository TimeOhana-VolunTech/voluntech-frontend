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

@Component({
  selector: 'app-home-voluntario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HeaderComponent, ProjetoDetalheComponent],
  templateUrl: './home-voluntario.component.html',
  styleUrl: './home-voluntario.component.css'
})
export class HomeVoluntarioComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);
  private projetoService = inject(ProjetoService);

  nomeVoluntario: string = '';
  projetos: Projeto[] = [];
  isCarregando: boolean = false;
  projetoSelecionado: Projeto | null = null;

  // Controles dos Filtros
  filtroBusca = new FormControl('');
  categoriaSelecionada: string = '';
  modalidadeSelecionada: string = '';

  ngOnInit() {
    const dados = this.authService.getUsuarioAtual();
    this.nomeVoluntario = dados?.nome || 'Voluntário';

    // 1. Carrega a lista inicial (H08)
    this.carregarProjetos();

    // 2. Configura a busca com debounce (H11)
    this.filtroBusca.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(termo => {
      this.carregarProjetos(termo || '');
    });
  }

  carregarProjetos(termo: string = ''): void {
    this.isCarregando = true;
    this.projetoService.explorar(this.categoriaSelecionada, this.modalidadeSelecionada, termo)
      .subscribe({
        next: (data) => {
          this.projetos = data;
          this.isCarregando = false;
        },
        error: (err) => {
          console.error('Erro ao carregar projetos', err);
          this.isCarregando = false;
        }
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

  verDetalhes(projeto: Projeto) {
    this.projetoSelecionado = projeto; // Abre o modal
  }

  fecharModal() {
    this.projetoSelecionado = null; // Fecha o modal
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modalidade } from '../../../core/models/enums/modalidade.enum';
import { Categoria } from '../../../core/models/enums/categoria.enum';
import { ProjetoService } from '../../../core/services/projeto.service';
import { HeaderComponent } from '../../header/header.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projeto-form',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, HeaderComponent, RouterModule],
  templateUrl: './projeto-form.component.html',
  styleUrl: './projeto-form.component.css'
})
export class ProjetoFormComponent implements OnInit {

  isEdicao = false;
  projetoId!: number;
  private route = inject(ActivatedRoute);

  projetoForm!: FormGroup;
  modalidades = Object.values(Modalidade);
  categorias = Object.values(Categoria);
  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private projetoService: ProjetoService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.verificarModoEdicao();
  }

  initForm() {
    // Buscando dados do localStorage conforme sua chave 'usuario_logado' definida no AuthService
    const usuarioJson = localStorage.getItem('usuario_logado');
    const usuario = usuarioJson ? JSON.parse(usuarioJson) : {};

    this.projetoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100), Validators.pattern(/.*\S.*/)]],
      descricao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000), Validators.pattern(/.*\S.*/)]],
      prazo: ['', Validators.required],
      modalidade: [''],
      categoria: [''],
      ongId: [usuario.id]
    });
  }

  salvarProjeto() {
    if (this.projetoForm.invalid) {
      // Se o formulário estiver inválido, marca todos os campos para mostrar o erro
      this.projetoForm.markAllAsTouched();
      return; // Para a execução aqui
    }

    // 1. Validação de Data Retroativa
    const dataSelecionada = new Date(this.projetoForm.value.prazo);
    const hoje = new Date();
    // Zeramos as horas para comparar apenas os dias
    hoje.setHours(0, 0, 0, 0);
    dataSelecionada.setHours(0, 0, 0, 0);

    if (dataSelecionada < hoje) {
      Swal.fire({
        title: 'Data Inválida!',
        text: 'O prazo limite do projeto não pode ser uma data retroativa.',
        icon: 'error',
        confirmButtonColor: '#2e7d32',
        confirmButtonText: 'Entendido'
      });
      return; // Interrompe o envio
    }

    // 2. Preparação dos dados
    const dadosProjeto = { ...this.projetoForm.value };
    // Se a modalidade estiver vazia, transforma em null para o Back-end aceitar
    if (!dadosProjeto.modalidade || dadosProjeto.modalidade === '') {
      dadosProjeto.modalidade = null;
    }
    // Se a categoria também for opcional, faça o mesmo:
    if (!dadosProjeto.categoria || dadosProjeto.categoria === '') {
      dadosProjeto.categoria = null;
    }

    // 3. Definição da Operação (Criação ou Edição)
    // Usamos a constante 'request' para armazenar o Observable correto
    const request = this.isEdicao
      ? this.projetoService.atualizar(this.projetoId, dadosProjeto)
      : this.projetoService.cadastrar(dadosProjeto);

    request.subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Sucesso!',
          text: this.isEdicao ? 'Oportunidade atualizada com sucesso.' : 'Projeto publicado com sucesso.',
          icon: 'success',
          confirmButtonColor: '#2e7d32'
        }).then((result) => {
          // O redirecionamento acontece após o usuário clicar em "OK" no SweetAlert
          if (result.isConfirmed || result.isDismissed) {
            this.router.navigate(['/home-ong']);
          }
        });
      },
      error: (err) => {
        Swal.fire('Erro!', `Não foi possível ${this.isEdicao ? 'atualizar' : 'cadastrar'} o projeto.`, 'error');
      }
    });
  }

  verificarModoEdicao() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.projetoId = +id;
      this.projetoService.buscarPorId(this.projetoId).subscribe({
        next: (projeto) => this.projetoForm.patchValue(projeto),
        error: () => Swal.fire('Erro', 'Não foi possível carregar o projeto.', 'error')
      });
    }
  }
}

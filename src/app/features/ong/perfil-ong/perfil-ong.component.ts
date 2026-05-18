import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OngService } from '../../../core/services/ong.service';
import { AuthService } from '../../../core/services/auth.service';
import { HeaderComponent } from '../../header/header.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-ong',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './perfil-ong.component.html',
  styleUrl: './perfil-ong.component.css'
})
export class PerfilOngComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ongService = inject(OngService);
  private authService = inject(AuthService);
  private router = inject(Router);


  perfilForm!: FormGroup;
  ongId!: number;
  isCarregando: boolean = true;
  isSalvando: boolean = false;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarDadosDaOng();
  }

  private inicializarFormulario(): void {
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      razaoSocial: ['', [Validators.required]],
      cnpj: [{ value: '', disabled: true }] // CNPJ bloqueado para edição por regra de negócio comum
    });
  }

  private carregarDadosDaOng(): void {
    const usuarioLogado = this.authService.getUsuarioAtual();

    if (usuarioLogado && usuarioLogado.id) {
      this.ongId = usuarioLogado.id;

      this.ongService.buscarPorId(this.ongId).subscribe({
        next: (ong) => {
          this.perfilForm.patchValue({
            nome: ong.nome,
            email: ong.email,
            razaoSocial: ong.razaoSocial,
            cnpj: ong.cnpj
          });
          this.isCarregando = false;
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            title: 'Erro',
            text: 'Não foi possível carregar os dados do seu perfil.',
            icon: 'error',
            confirmButtonColor: '#64748b'
          });
          this.isCarregando = false;
        }
      });
    }
  }

  salvarPerfil(): void {
    if (this.perfilForm.invalid) return;

    this.isSalvando = true;
    // Capturamos os dados do formulário (o getRawValue traz inclusive os campos disabled se necessário)
    const dadosParaAtualizar = {
      nome: this.perfilForm.value.nome,
      email: this.perfilForm.value.email,
      razaoSocial: this.perfilForm.value.razaoSocial
    };

    this.ongService.atualizar(this.ongId, dadosParaAtualizar).subscribe({
      next: (ongAtualizada) => {
        // Atualiza os dados no LocalStorage para que o Header mude o nome imediatamente se alterado
        const usuarioAtual = this.authService.getUsuarioAtual();
        const usuarioRenovado = { ...usuarioAtual, nome: ongAtualizada.nome, email: ongAtualizada.email };
        localStorage.setItem('usuario_logado', JSON.stringify(usuarioRenovado));

        Swal.fire({
          title: 'Perfil Atualizado!',
          text: 'Os dados da sua instituição foram salvos com sucesso.',
          icon: 'success',
          confirmButtonColor: '#2e7d32',
        });
        this.isSalvando = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          title: 'Erro ao salvar',
          text: err.error?.message || 'Ocorreu um problema ao atualizar o cadastro.',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
        this.isSalvando = false;
      }
    });
  }

  voltar() {
    this.router.navigate(['/home-ong']);
  }
}

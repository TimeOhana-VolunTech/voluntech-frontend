import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { OngService } from '../../../core/services/ong.service';
import { Router } from '@angular/router';
import { CnpjMaskDirective } from '../../../shared/directives/cnpj-mask.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-ong',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CnpjMaskDirective],
  templateUrl: './cadastro-ong.component.html',
  styleUrls: ['./cadastro-ong.component.css'],
})
export class CadastroOngComponent {

  formOng!: FormGroup;
  isSenhaVisivel: boolean = false;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private ongService = inject(OngService);


  ngOnInit(): void {
    this.formOng = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/.*\S.*/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      cnpj: ['', [Validators.required, Validators.minLength(18)]],
      senha: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(/^\S+$/) ]],
      razaoSocial: ['', [Validators.required]],
    });
  }

  cadastrar() {
    // 1. Verificação de segurança e feedback visual imediato
    if (this.formOng.invalid) {
      this.formOng.markAllAsTouched();
      return;
    }

    // 2. Preparação dos dados (Limpeza de máscara e espaços)
    const formulario = this.formOng.getRawValue();
    const dadosParaEnvio = {
      ...formulario,
      nome: formulario.nome.trim(),
      email: formulario.email.trim(),
      razaoSocial: formulario.razaoSocial.trim(),
      cnpj: formulario.cnpj.replace(/\D/g, '')
    };

    // 3. Envio para o Service
    this.ongService.cadastrar(dadosParaEnvio).subscribe({
      next: (ongCadastrada) => {
        Swal.fire({
          title: 'Sucesso!',
          text: 'ONG cadastrada! Agora você pode fazer login para gerenciar seus projetos.',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'Fazer Login',
        }).then(() => {
          this.formOng.reset();
          this.router.navigate(['/login'], { queryParams: { email: dadosParaEnvio.email }});
        });
      },
      error: (err) => {
        console.error('Erro detalhado:', err);
        let mensagemErro = 'Verifique os dados e tente novamente.';

        if (err.status === 409) {
          mensagemErro = typeof err.error === 'string' ? err.error : 'Este e-mail ou CNPJ já está cadastrado.';
        } else if (err.status === 400) {
            if (Array.isArray(err.error)) {
              mensagemErro = err.error.join('\n');
            } else {
              mensagemErro = err.error || 'Dados inválidos ou mal formatados.';
            }
        } else if (err.status === 0) {
          mensagemErro = 'Servidor offline. Verifique se o Backend está rodando.';
        }

        Swal.fire({
          title: 'Erro no cadastro',
          text: mensagemErro,
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      },
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }

  toggleSenha() {
    this.isSenhaVisivel = !this.isSenhaVisivel;
  }
}

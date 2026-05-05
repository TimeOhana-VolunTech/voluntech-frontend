import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { VoluntarioService } from '../../../core/services/voluntario.service';
import { Router } from '@angular/router';
import { CpfMaskDirective } from '../../../shared/directives/cpf-mask.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-voluntario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CpfMaskDirective],
  templateUrl: './cadastro-voluntario.component.html',
  styleUrls: ['./cadastro-voluntario.component.css']
})
export class CadastroVoluntarioComponent {

  formVoluntario!: FormGroup;
  isSenhaVisivel: boolean = false;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private service = inject(VoluntarioService);

  ngOnInit(): void {
    this.formVoluntario = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/.*\S.*/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      senha: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(/^\S+$/) ]]
    });
  }


  cadastrar() {
    if (this.formVoluntario.invalid) {
      this.formVoluntario.markAllAsTouched();
      return;
    }

    const formulario = this.formVoluntario.getRawValue();
    const dadosParaEnvio = {
      ...formulario,
      nome: formulario.nome.trim(),
      email: formulario.email.trim(),
      cpf: formulario.cpf.replace(/\D/g, '')
    };

    this.service.cadastrar(dadosParaEnvio).subscribe({
      next: (voluntarioCadastrado) => {
        Swal.fire({
          title: 'Bem-vindo(a)!',
          text: 'Voluntário cadastrado! Agora você pode fazer login para acessar o painel.',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'Fazer Login',
        }).then(() => {
          this.formVoluntario.reset();
          this.router.navigate(['/login'], { queryParams: { email: dadosParaEnvio.email }});
        });
      },
      error: (err) => {
        console.error('Erro detalhado:', err);
        let mensagemErro = 'Não foi possível realizar o cadastro no momento.';

        if (err.status === 409) {
          mensagemErro = typeof err.error === 'string' ? err.error : 'Este CPF ou E-mail já está cadastrado.';
        } else if (err.status === 400) {
          if (Array.isArray(err.error)) {
            mensagemErro = err.error.join('\n');
          } else {
            mensagemErro = err.error || 'Dados inválidos. Verifique o CPF e o e-mail.';
          }
        } else if (err.status === 0) {
          mensagemErro = 'Servidor offline. Verifique sua conexão.';
        }

        Swal.fire({
          title: 'Erro no cadastro',
          text: mensagemErro,
          icon: 'error',
          confirmButtonColor: '#dc2626',
        });
      }
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }

  toggleSenha() {
    this.isSenhaVisivel = !this.isSenhaVisivel;
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;
  isSenhaVisivel: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      senha: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(/^\S+$/) ]],
    });
  }

  ngOnInit(): void {
    // Captura o email da URL se ele existir
    const emailDaUrl = this.route.snapshot.queryParamMap.get('email');

    if (emailDaUrl) {
      // Preenche o campo de email automaticamente
      this.loginForm.patchValue({ email: emailDaUrl });

      // Opcional: Já marca como "touched" para o usuário ver que está validado
      this.loginForm.get('email')?.markAsTouched();
    }
  }

  logar() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        // 1. Verifica se é uma ONG (pelo campo CNPJ)
        if (user.cnpj) {
          this.router.navigate(['/home-ong']);
        }
        // 2. Se for Voluntário, verifica se precisa de Onboarding
        else {
          // MUDANÇA AQUI: Agora verificamos a flag booleana que vem do banco
          if (user.onboardingCompleto === false) {
            this.router.navigate(['/onboarding-voluntario']);
          } else {
            this.router.navigate(['/home-voluntario']);
          }
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Falha no Login',
          text: 'E-mail ou senha incorretos. Tente novamente!',
          confirmButtonColor: '#2563eb'
        });
      }
    });
  }

  irParaHome() {
    this.router.navigate(['/']);
  }

  toggleSenha() {
    this.isSenhaVisivel = !this.isSenhaVisivel;
  }
}

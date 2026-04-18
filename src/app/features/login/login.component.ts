import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
export class LoginComponent {

  loginForm: FormGroup;
  isSenhaVisivel: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      senha: ['', [ Validators.required, Validators.minLength(6), Validators.maxLength(12), Validators.pattern(/^\S+$/) ]],
    });
  }

  logar() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          // Se o objeto tiver CNPJ, é uma ONG. Se não, é um voluntário.
          if (user.cnpj) {
            this.router.navigate(['/home-ong']);
          } else {
            this.router.navigate(['/home-voluntario']);
          }
        },
        error: (err) => {
          // Erro: Mostra o alerta
          Swal.fire({
            icon: 'error',
            title: 'Falha no Login',
            text: 'E-mail ou senha incorretos. Tente novamente!',
            confirmButtonColor: '#2563eb'
          });
        }
      });
    }
  }

  irParaHome() {
    this.router.navigate(['/home']);
  }

  toggleSenha() {
    this.isSenhaVisivel = !this.isSenhaVisivel;
  }
}

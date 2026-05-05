import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { VoluntarioService } from '../../../core/services/voluntario.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-onboarding-voluntario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './onboarding-voluntario.component.html',
  styleUrl: './onboarding-voluntario.component.css'
})
export class OnboardingVoluntarioComponent implements OnInit {
  onboardingForm: FormGroup;
  usuarioAtual: any;

  // Opções para o usuário selecionar
  listaHabilidades = ['Comunicação', 'Design', 'Cozinha', 'Programação', 'Artes', 'Ensino', 'Saúde', 'Logística'];
  listaCausas = ['Educação', 'Meio Ambiente', 'Saúde', 'Assistência Social', 'Tecnologia'];
  listaDisponibilidade = ['Manhã', 'Tarde', 'Noite', 'Finais de Semana', 'Remoto'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private voluntarioService: VoluntarioService,
    private router: Router
  ) {
    this.onboardingForm = this.fb.group({
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      habilidades: [[], [Validators.required, Validators.minLength(1)]],
      causas: [[], [Validators.required, Validators.minLength(1)]],
      bio: ['', [Validators.minLength(20),Validators.maxLength(500)]],
      disponibilidades: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.usuarioAtual = this.authService.getUsuarioAtual();
  }

  toggleItem(lista: 'habilidades' | 'causas' | 'disponibilidades', item: string) {
    const atual = this.onboardingForm.get(lista)?.value as string[];
    if (atual.includes(item)) {
      this.onboardingForm.get(lista)?.setValue(atual.filter(i => i !== item));
    } else {
      this.onboardingForm.get(lista)?.setValue([...atual, item]);
    }
  }

  salvarPerfil() {
    if (this.onboardingForm.invalid) {
      this.onboardingForm.markAllAsTouched();

    }

    if (this.onboardingForm.valid) {
      const dadosParaAtualizar = {
        nome: this.usuarioAtual.nome,
        email: this.usuarioAtual.email,
        ...this.onboardingForm.value,
        onboardingCompleto: true
      };

      this.voluntarioService.atualizarPerfil(this.usuarioAtual.id, dadosParaAtualizar).subscribe({
        next: (usuarioAtualizado) => {
          localStorage.setItem('usuario_logado', JSON.stringify(usuarioAtualizado));
          Swal.fire('Perfil Completo!', 'Agora você já pode se candidatar às causas.', 'success');            this.router.navigate(['/home-voluntario']);
        },
        error: () => Swal.fire('Erro', 'Não foi possível salvar seu perfil.', 'error')
      });
    }
  }

  pular() {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você poderá preencher essas informações depois no seu perfil.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, pular',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const dadosParaAtualizar = {
          nome: this.usuarioAtual.nome,
          email: this.usuarioAtual.email,
          telefone: '',
          habilidades: [],
          causas: [],
          disponibilidades: [],
          bio: '',
          onboardingCompleto: true
        };

        this.voluntarioService.atualizarPerfil(this.usuarioAtual.id, dadosParaAtualizar).subscribe({
          next: (usuarioAtualizado) => {
            localStorage.setItem('usuario_logado', JSON.stringify(usuarioAtualizado));
            this.router.navigate(['/home-voluntario']);
          },
          error: () => Swal.fire('Erro', 'Ocorreu um problema ao salvar sua escolha.', 'error')
        });
      }
    });
  }
}

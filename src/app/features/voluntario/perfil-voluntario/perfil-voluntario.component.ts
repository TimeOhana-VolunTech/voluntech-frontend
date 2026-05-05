import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { VoluntarioService } from '../../../core/services/voluntario.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-perfil-voluntario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './perfil-voluntario.component.html',
  styleUrls: ['./perfil-voluntario.component.css']
})
export class PerfilVoluntarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private voluntarioService = inject(VoluntarioService);
  private router = inject(Router);

  perfilForm!: FormGroup;
  usuarioLogado: any;

  // Listas para os Chips (podem ser movidas para um arquivo de constantes depois)
  listaHabilidades = ['Cozinha', 'Programação', 'Artes', 'Ensino', 'Saúde', 'Logística'];
  listaCausas = ['Meio Ambiente', 'Educação', 'Proteção Animal', 'Idosos', 'Crianças'];
  listaDisponibilidade = ['Manhã', 'Tarde', 'Noite', 'Finais de Semana', 'Remoto'];

  ngOnInit() {
    this.carregarUsuario();
    this.initForm();
    this.preencherFormulario();
  }

  initForm() {
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), , Validators.pattern(/.*\S.*/)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\S+@\S+\.\S+$/)]],
      telefone: ['', [Validators.required, Validators.pattern(/^\d{10,11}$/)]],
      bio: ['', [Validators.minLength(20), Validators.maxLength(500)]],
      habilidades: [[], [Validators.required, Validators.minLength(1)]],
      causas: [[], [Validators.required, Validators.minLength(1)]],
      disponibilidades: [[], [Validators.required, Validators.minLength(1)]],
      onboardingCompleto: [true]
    });
  }

  carregarUsuario() {
    const data = localStorage.getItem('usuario_logado');
    this.usuarioLogado = data ? JSON.parse(data) : null;
  }

  preencherFormulario() {
    if (this.usuarioLogado?.id) {
      this.voluntarioService.buscarPorId(this.usuarioLogado.id).subscribe({
        next: (voluntario) => {
          this.perfilForm.patchValue(voluntario);
        },
        error: () => Swal.fire('Erro', 'Não foi possível carregar seus dados.', 'error')
      });
    }
  }

  toggleItem(lista: 'habilidades' | 'causas' | 'disponibilidades', item: string) {
    const atual = this.perfilForm.get(lista)?.value as string[];
    if (atual.includes(item)) {
      this.perfilForm.get(lista)?.setValue(atual.filter(i => i !== item));
    } else {
      this.perfilForm.get(lista)?.setValue([...atual, item]);
    }
    this.perfilForm.get(lista)?.markAsTouched();
  }

  salvarAlteracoes() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.voluntarioService.atualizarPerfil(this.usuarioLogado.id, this.perfilForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('usuario_logado', JSON.stringify(res));
        Swal.fire('Sucesso!', 'Perfil atualizado com sucesso!', 'success');
      },
      error: (err) => {
        const msg = err.error?.message || 'Erro ao atualizar perfil.';
        Swal.fire('Erro', msg, 'error');
      }
    });
  }

  voltar() {
    this.router.navigate(['/home-voluntario']);
  }

}

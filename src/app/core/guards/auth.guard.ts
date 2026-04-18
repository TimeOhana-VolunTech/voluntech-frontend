import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Injeta seu serviço de login
  const router = inject(Router);           // Injeta o roteador para redirecionar

  if (authService.estaLogado()) {
    return true; // Usuário logado? Acesso permitido!
  } else {
    // Não logado? Redireciona para o login e bloqueia o acesso
    router.navigate(['/login']);
    return false;
  }
};

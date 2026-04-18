import { Routes } from '@angular/router';
import { CadastroOngComponent } from './features/cadastro-ong/cadastro-ong.component';
import { CadastroVoluntarioComponent } from './features/cadastro-voluntario/cadastro-voluntario.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { HomeOngComponent } from './features/home-ong/home-ong.component';
import { HomeVoluntarioComponent } from './features/home-voluntario/home-voluntario.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  { path: 'cadastro-ong', component: CadastroOngComponent },
  { path: 'cadastro-voluntario', component: CadastroVoluntarioComponent },

  { path: 'home-ong', component: HomeOngComponent, canActivate: [authGuard] },
  { path: 'home-voluntario', component: HomeVoluntarioComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' } // Qualquer rota inexistente volta para a Home
];



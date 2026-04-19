import { Routes } from '@angular/router';
import { CadastroOngComponent } from './features/ong/cadastro-ong/cadastro-ong.component';
import { CadastroVoluntarioComponent } from './features/voluntario/cadastro-voluntario/cadastro-voluntario.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { HomeOngComponent } from './features/ong/home-ong/home-ong.component';
import { authGuard } from './core/guards/auth.guard';
import { HomeVoluntarioComponent } from './features/voluntario/home-voluntario/home-voluntario.component';
import { ProjetoFormComponent } from './features/ong/projeto-form/projeto-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  { path: 'cadastro-ong', component: CadastroOngComponent },
  { path: 'cadastro-voluntario', component: CadastroVoluntarioComponent },

  { path: 'home-ong', component: HomeOngComponent, canActivate: [authGuard] },
  { path: 'novo-projeto', component: ProjetoFormComponent, canActivate: [authGuard] },

  { path: 'home-voluntario', component: HomeVoluntarioComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: '' } // Qualquer rota inexistente volta para a Home
];



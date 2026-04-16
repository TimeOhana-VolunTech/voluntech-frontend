import { Routes } from '@angular/router';
import { CadastroOngComponent } from './features/cadastro-ong/cadastro-ong.component';
import { CadastroVoluntarioComponent } from './features/cadastro-voluntario/cadastro-voluntario.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro-ong', component: CadastroOngComponent },
  { path: 'cadastro-voluntario', component: CadastroVoluntarioComponent },

  { path: '**', redirectTo: '' } // Qualquer rota inexistente volta para a Home
];



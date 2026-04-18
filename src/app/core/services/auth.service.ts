import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Sua URL do backend no Render
  //private readonly API = 'https://voluntech-backend.onrender.com/auth';
  //private readonly API = 'http://localhost:8080/auth';
  private readonly API = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Realiza o login enviando e-mail e senha para o servidor.
   * Usamos 'tap' para salvar os dados do usuário se o login der certo.
   */
  login(credentials: {email: string, senha: string}): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, credentials).pipe(
      tap(usuario => {
        // Salvamos o objeto do usuário (ou o e-mail) como "prova" de que está logado
        localStorage.setItem('usuario_logado', JSON.stringify(usuario));
      })
    );
  }

  /**
   * Limpa os dados do navegador e desloga o usuário
   */
  logout(): void {
    localStorage.removeItem('usuario_logado');
  }

  /**
   * Verifica se existe um usuário salvo no LocalStorage
   */
  estaLogado(): boolean {
    const usuario = localStorage.getItem('usuario_logado');
    return !!usuario; // Retorna true se existir, false se for null
  }

  /**
   * Retorna os dados do usuário logado (ex: para exibir o nome no Header)
   */
  getUsuarioAtual() {
    const usuario = localStorage.getItem('usuario_logado');
    return usuario ? JSON.parse(usuario) : null;
  }
}

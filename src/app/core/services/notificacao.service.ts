import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notificacao {
  id: number;
  mensagem: string;
  lida: boolean;
  dataCriacao: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private readonly API = `${environment.apiUrl}/notificacoes`;

  constructor(private http: HttpClient) {}

  listar(tipo: string, id: number): Observable<Notificacao[]> {
    return this.http.get<Notificacao[]>(`${this.API}/${tipo}/${id}`);
  }

  contarPendentes(tipo: string, id: number): Observable<number> {
    return this.http.get<number>(`${this.API}/${tipo}/${id}/pendentes`);
  }

  marcarComoLida(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API}/${id}/ler`, {});
  }
}

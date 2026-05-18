import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projeto } from '../models/projeto.model'; // Verifique o caminho do seu model
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {

  // A URL base deve apontar para o seu back-end (ex: http://localhost:8080/projetos)
  private readonly API = `${environment.apiUrl}/projetos`;

  constructor(private http: HttpClient) { }

  /*Cadastrar um novo projeto (POST)*/
  cadastrar(projeto: Projeto): Observable<Projeto> {
    return this.http.post<Projeto>(this.API, projeto);
  }

  /*Listar todos os projetos de uma ONG específica (GET)*/
  listarPorOng(ongId: number): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.API}/ong/${ongId}`);
  }

  /*Método útil para buscar um projeto por ID (Caso precise no futuro)*/
  buscarPorId(id: number): Observable<Projeto> {
    return this.http.get<Projeto>(`${this.API}/${id}`);
  }

  /* Atualizar projeto completo (PUT) */
  atualizar(id: number, projeto: Projeto): Observable<Projeto> {
    return this.http.put<Projeto>(`${this.API}/${id}`, projeto);
  }

  /* Alterar apenas o status (PATCH) */
  alterarStatus(id: number, novoStatus: string): Observable<Projeto> {
    return this.http.patch<Projeto>(`${this.API}/${id}/status?novoStatus=${novoStatus}`, {});
  }

  /* Excluir projeto (DELETE) */
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  explorar(categoria?: string, modalidade?: string, termo?: string, voluntarioId?: number): Observable<Projeto[]> {
    let params = new HttpParams();

    if (categoria) params = params.set('categoria', categoria);
    if (modalidade) params = params.set('modalidade', modalidade);
    if (termo) params = params.set('termo', termo);
    if (voluntarioId) params = params.set('voluntarioId', voluntarioId.toString());

    return this.http.get<Projeto[]>(`${this.API}/explorar`, { params });
  }

  candidatar(projetoId: number, voluntarioId: number): Observable<string> {
    return this.http.post(`${this.API}/${projetoId}/candidatar`, null, {
      params: { voluntarioId: voluntarioId.toString() },
      responseType: 'text'
    });
  }
}

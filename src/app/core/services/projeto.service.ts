import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CandidatoExibicao {
  candidaturaId: number;
  voluntarioId: number;
  nome: string;
  email: string;
  telefone: string;
  habilidades: string[];
  bio: string;
  dataCandidatura: string;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO';
}

export interface Candidatura {
  id: number;
  projetoId: number;
  projetoTitulo: string;
  nomeOng: string;
  dataCandidatura: string;
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO' | 'CANCELADO';
  statusProjeto: string;
}

@Injectable({ providedIn: 'root' })
export class CandidaturaService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/candidaturas`;

  listarPorVoluntario(voluntarioId: number): Observable<Candidatura[]> {
    return this.http.get<Candidatura[]>(`${this.API}/voluntario/${voluntarioId}`);
  }

  listarCandidatosPorProjeto(projetoId: number): Observable<CandidatoExibicao[]> {
    return this.http.get<CandidatoExibicao[]>(`${this.API}/projeto/${projetoId}`);
  }

  atualizarStatus(candidaturaId: number, novoStatus: string): Observable<void> {

    return this.http.patch<void>(`${this.API}/${candidaturaId}/status`, { novoStatus });
  }

  cancelarCandidatura(candidaturaId: number): Observable<void> {
    return this.http.patch<void>(`${this.API}/${candidaturaId}/cancelar`, {});
  }
}

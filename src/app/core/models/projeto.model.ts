import { StatusProjeto } from './enums/status-projeto.enum';
import { Modalidade } from './enums/modalidade.enum';
import { Categoria } from './enums/categoria.enum';

export interface Projeto {
  id?: number;
  titulo: string;
  descricao: string;
  prazo: Date | string;
  status?: StatusProjeto;
  modalidade?: Modalidade;
  categoria?: Categoria;
  ongId: number;
  nomeOng?: string;
  jaInscrito?: boolean;
  totalCandidatosPendentes: number;
}

import { StatusProjeto } from './enums/status-projeto.enum';
import { Modalidade } from './enums/modalidade.enum';
import { Categoria } from './enums/categoria.enum';

export interface Projeto {
  id?: number;
  titulo: string;
  descricao: string;
  prazo: Date | string; // O Back-end envia string (ISO), mas tratamos como Date no Front
  status?: StatusProjeto;
  modalidade?: Modalidade;
  categoria?: Categoria;
  ongId: number;
  nomeOng?: string;
}

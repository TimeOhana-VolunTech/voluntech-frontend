export interface Ong {
  id?: number;
  nome: string;
  email: string;
  cnpj: string;
  razaoSocial: string;
}

export interface OngRequest extends Omit<Ong, 'id'> {
  senha?: string;
}

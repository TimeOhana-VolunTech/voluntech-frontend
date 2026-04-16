export interface Voluntario {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
}

// O Omit remove campos que o usuário não preenche no cadastro, mas mantém a senha
export interface VoluntarioRequest extends Omit<Voluntario, 'id'> {
  senha?: string;
}

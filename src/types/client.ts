export interface Client {
  id: string;
  nome: string;
  ativo: boolean;
}

export type ClientFormData = Omit<Client, 'id'>;
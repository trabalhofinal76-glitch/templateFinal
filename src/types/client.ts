export interface client {
  id: string;
  nome: string;
  ativo: boolean;
}

export type clientFormData = Omit<client, 'id'>;
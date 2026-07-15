import { Client, ClientFormData } from '../types/client';
import axios from 'axios';

let clients: Client[] = [

];

let nextId = 1;

function delay<T>(value: T, ms = 80): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function listClients(): Promise<Client[]> {
  return delay([...clients]);
}

export async function createClient(data: ClientFormData): Promise<Client> {
  const client: Client = { id: String(nextId++), ...data };
  clients = [...clients, client];
  return delay(client);
}

export async function updateClient(id: string, data: ClientFormData): Promise<Client | null> {
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return delay(null);
  const updated = { id, ...data };
  clients = clients.map((c) => (c.id === id ? updated : c));
  return delay(updated);
}

export async function deleteClient(id: string): Promise<boolean> {
  const before = clients.length;
  clients = clients.filter((c) => c.id !== id);
  return delay(clients.length < before);
}

export async function createClientApi(client: any) {
  console.log(client);
  const newClient = await axios.post('http://192.168.204.90:3000/clients', { name: client.nome })
}

export async function listClientApi() {

  const newClient = await axios.get('http://192.168.204.90:3000/clients');
  return newClient.data;
}

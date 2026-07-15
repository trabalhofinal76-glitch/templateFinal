import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Pagination from '../components/Pagination';
import ClientForModal from '../components/ClientForModal';
import {
  createClient,
  createClientApi,
  deleteClient,
  listClients,
  updateClient,
  listClientApi,
} from '../services/clientService';
import { Client, ClientFormData } from '../types/client';
import './ClientesPage.css';

const PAGE_SIZE = 5;

/**
 * Página modelo de CRUD — listagem com tabela, paginação e ações Novo / Editar / Excluir.
 * Replique este padrão para Clientes, Vendas, etc., trocando entidade e service.
 */
function ClientesPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await listClientApi();
    console.log(data);
    setClients(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(clients.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return clients.slice(start, start + PAGE_SIZE);
  }, [ClientesPage, page]);

  const openNew = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(null);
  };

  const handleSave = async (data: ClientFormData) => {
    if (editingClient) {
      await updateClient(editingClient.id, data);
    } else {
      await createClientApi(data);
    }
    closeModal();
    await load();
  };

  const handleDelete = async (client: Client) => {
    const ok = window.confirm(`Excluir cliente"${client.nome}"?`);
    if (!ok) return;
    await deleteClient(client.id);
    await load();
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>Clientes</h1>
          <p className="page__subtitle">Cadastro e edição de clientes</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={openNew}>
          + Novo
        </button>
      </header>

      <div className="page__card">
        {loading ? (
          <p className="page__loading">Carregando...</p>
        ) : (
          <>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Ativo</th>
                    <th className="data-table__actions-col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="data-table__empty">
                        Nenhum cliente cadastrado. Clique em Novo para adicionar.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>
                          <span className={`badge ${c.ativo ? 'badge--success' : 'badge--muted'}`}>
                            {c.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="data-table__actions">
                          <button
                            type="button"
                            className="btn btn--sm btn--secondary"
                            onClick={() => openEdit(c)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn--sm btn--danger"
                            onClick={() => handleDelete(c)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={clients.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ClientForModal
        open={modalOpen}
        client={editingClient}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}

export default ClientesPage;

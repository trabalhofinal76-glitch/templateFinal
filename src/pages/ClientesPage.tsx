import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Pagination from '../components/Pagination';
import ProductFormModal from '../components/ClientForModal';
import {
  createClient,
  deleteClient,
  listClient,
  updateClient,
} from '../services/productService';
import { client,clientFormData } from '../types/client';
import './ClientesPage.css';

const PAGE_SIZE = 5;

/**
 * Página modelo de CRUD — listagem com tabela, paginação e ações Novo / Editar / Excluir.
 * Replique este padrão para Clientes, Vendas, etc., trocando entidade e service.
 */
function ClientesPage() {
  const [clients, setClients] = useState<client[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<client | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await listClient();
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

  const openEdit = (client: client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(null);
  };

  const handleSave = async (data: clientFormData) => {
    if (editingClient) {
      await updateClient(editingClient.id, data);
    } else {
      await createClient(data);
    }
    closeModal();
    await load();
  };

  const handleDelete = async (client: client) => {
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
          <p className="page__subtitle">CRUD de exemplo — cadastro e edição de clientes</p>
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
                    <th>SKU</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Status</th>
                    <th className="data-table__actions-col">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="data-table__empty">
                        Nenhum produto cadastrado. Clique em Novo para adicionar.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((p) => (
                      <tr key={p.id}>
                        <td>{p.nome}</td>
                        <td>
                          <span className={`badge ${p.ativo ? 'badge--success' : 'badge--muted'}`}>
                            {p.ativo ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="data-table__actions">
                          <button
                            type="button"
                            className="btn btn--sm btn--secondary"
                            onClick={() => openEdit(p)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn--sm btn--danger"
                            onClick={() => handleDelete(p)}
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

      <ProductFormModal
        open={modalOpen}
        client={editingClient}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}

export default ClientesPage;

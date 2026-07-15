import React, { useEffect, useState } from 'react';
import { Client, ClientFormData } from '../types/client';
import './ClientForModal.css';

interface ClientFormModalProps {
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onSave: (data: ClientFormData) => void;
}

const emptyForm: ClientFormData = {
  nome: '',
  ativo: true,
};

function ClientForModal({ open, client, onClose, onSave }: ClientFormModalProps) {
  const [form, setForm] = useState<ClientFormData>(emptyForm);

  useEffect(() => {
    if (client) {
      const { id: _id, ...data } = client;
      setForm(data);
    } else {
      setForm(emptyForm);
    }
  }, [client, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="client-modal-title"
      >
        <h2 id="client-modal-title">{client ? 'Editar cliente' : 'Novo cliente'}</h2>
        <form className="modal__form" onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="cli-nome">
              Nome
            </label>
            <input
              id="cli-nome"
              className="input"
              required
              placeholder="Ex: Nome completo"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />

          </div>

          <div className="field field--switch">
            <label className="switch">
              <input
                className="switch__input"
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              />
              <span className="switch__track">
                <span className="switch__thumb" />
              </span>
            </label>
            <span className="field__label field__label--inline">Cliente Ativo</span>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientForModal;

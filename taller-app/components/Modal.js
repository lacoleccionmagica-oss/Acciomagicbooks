'use client';

export default function Modal({ title, onClose, onSave, saving, large, children, saveLabel = 'Guardar' }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`modal ${large ? 'large' : ''}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="modal-body">{children}</div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={onSave} disabled={saving}>
            {saving ? 'Guardando...' : saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

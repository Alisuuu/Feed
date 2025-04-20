import React from 'react';

const Modal = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="custom-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="modal-header">
          {article.urlToImage && (
            <img src={article.urlToImage} alt="Imagem da notícia" className="modal-poster" />
          )}
          <div>
            <h2 className="modal-title">{article.title}</h2>
            <p>{article.source.name}</p>
          </div>
        </div>
        <div className="modal-body">
          <p>{article.description || 'Sem descrição disponível.'}</p>
          <p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: '#593BA2', textDecoration: 'underline' }}>
              Ler matéria completa
            </a>
          </p>
        </div>
        <div className="cast-list">
          {article.author && (
            <div className="actor-card">
              <div className="actor-name">{article.author}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

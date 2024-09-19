import React from 'react';
import { PrimaryButton } from '../Button/PrimaryButton'; // Dodaj ten import
import './ErrorModal.scss';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="error-modal__overlay">
      <div className="error-modal__content">
        <h2 className="error-modal__title">Błąd</h2>
        <p className="error-modal__message">{errorMessage}</p>
        <div className="error-modal__actions">
          <PrimaryButton onClick={onClose}>Zamknij</PrimaryButton>
        </div>
      </div>
    </div>
  );
};
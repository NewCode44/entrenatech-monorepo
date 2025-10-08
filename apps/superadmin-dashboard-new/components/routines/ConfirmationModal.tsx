
import React from 'react';
import Modal from '@/ui/Modal';
import Icon from '@/ui/Icon';
import { Routine } from '@/types';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  routine: Routine | null;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, routine }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Eliminación">
      <div className="text-center">
        <Icon name="Trash" className="w-16 h-16 text-danger mx-auto mb-4" />
        <p className="text-lg text-white mb-2">¿Estás seguro?</p>
        <p className="text-gray-400">
          Estás a punto de eliminar la rutina <strong className="text-white">{routine?.name}</strong>. Esta acción es irreversible.
        </p>
        <div className="flex justify-center gap-4 mt-6">
            <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
            <button onClick={onConfirm} className="bg-danger hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Sí, Eliminar</button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

import React from 'react';
import Modal from '@/ui/Modal';
import Icon from '@/ui/Icon';
import { Routine } from '@/types';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: () => void;
  routine: Routine | null;
}

const MOCK_MEMBERS = [
    { id: 'mem-1', name: 'Juan Pérez' },
    { id: 'mem-2', name: 'Maria García' },
    { id: 'mem-3', name: 'Carlos Rodríguez' },
    { id: 'mem-4', name: 'Ana Martínez' },
    { id: 'mem-5', name: 'Laura Gómez' },
];

const AssignModal: React.FC<AssignModalProps> = ({ isOpen, onClose, onAssign, routine }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Asignar Rutina: ${routine?.name}`}>
      <div>
        <div className="relative mb-4">
          <Icon name="Search" className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-500"/>
          <input type="text" placeholder="Buscar miembros..." className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-primary focus:border-primary" />
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {MOCK_MEMBERS.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-3">
                <img src={`https://i.pravatar.cc/40?u=${member.id}`} alt={member.name} className="w-8 h-8 rounded-full" />
                <span className="text-white">{member.name}</span>
              </div>
              <input type="checkbox" className="form-checkbox h-5 w-5 bg-gray-800 border-gray-600 rounded text-primary focus:ring-primary" style={{ accentColor: '#2196F3' }} />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
          <button onClick={onAssign} className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">Asignar a Miembros</button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignModal;
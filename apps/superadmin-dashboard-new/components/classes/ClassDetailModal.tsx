
import React from 'react';
import Icon from '@/ui/Icon';
import { GymClass, Instructor, ClassCategory } from '@/types';

interface ClassDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    gymClass: GymClass | null;
    instructor?: Instructor;
    category?: ClassCategory;
}

const ClassDetailModal: React.FC<ClassDetailModalProps> = ({ isOpen, onClose, gymClass, instructor, category }) => {
    if (!isOpen || !gymClass) return null;
    
    const capacityPercentage = (gymClass.enrolled / gymClass.capacity) * 100;
    
    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className={`bg-secondary rounded-xl border-l-8 shadow-xl w-full max-w-lg relative animate-slide-up ${category?.color.replace('text-', 'border-')}`} onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                             <span className={`px-3 py-1 text-sm font-bold rounded-full ${category?.lightColor} ${category?.color}`}>
                                {category?.name}
                            </span>
                            <h3 className="text-2xl font-bold text-white mt-2">{gymClass.name}</h3>
                        </div>
                        <button onClick={onClose} className="p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800">
                            <Icon name="X" className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-4">
                        <img src={instructor?.avatar} alt={instructor?.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="text-sm text-gray-500">Instructor</p>
                            <p className="font-semibold text-white">{instructor?.name}</p>
                        </div>
                    </div>
                    
                    <p className="text-gray-400 mt-4">{gymClass.description}</p>
                    
                    <hr className="border-gray-800 my-4"/>
                    
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-semibold text-white flex items-center gap-2"><Icon name="UsersRound" className="w-5 h-5"/>Capacidad</p>
                            <p className="text-sm text-gray-400">{gymClass.enrolled} / {gymClass.capacity}</p>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                            <div className={`h-2.5 rounded-full ${category?.color.replace('text-', 'bg-')}`} style={{ width: `${capacityPercentage}%` }}></div>
                        </div>
                    </div>
                    
                     <div className="mt-6 flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 text-sm text-white bg-primary hover:bg-primary-dark font-semibold py-2 px-4 rounded-lg transition-colors">
                            <Icon name="Edit" className="w-4 h-4"/>Editar Clase
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 text-sm text-red-500 bg-red-500/10 hover:bg-red-500/20 font-semibold py-2 px-4 rounded-lg transition-colors">
                             <Icon name="Trash" className="w-4 h-4"/>Cancelar Clase
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailModal;
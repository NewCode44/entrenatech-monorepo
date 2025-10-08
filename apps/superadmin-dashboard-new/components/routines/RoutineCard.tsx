
import React, { useState, useRef, useEffect } from 'react';
import { Routine } from '@/types';
import Icon from '@/ui/Icon';
import Card from '@/ui/Card';

interface RoutineCardProps {
    routine: Routine;
    view: 'grid' | 'list';
    onEdit: () => void;
    onAssign: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

const categoryStyles: { [key: string]: string } = {
    strength: 'bg-red-500/20 text-red-400',
    cardio: 'bg-blue-500/20 text-blue-400',
    hiit: 'bg-orange-500/20 text-orange-400',
    flexibility: 'bg-green-500/20 text-green-400',
    custom: 'bg-purple-500/20 text-purple-400',
};

const DifficultyStars: React.FC<{ level: number }> = ({ level }) => (
    <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
            <Icon key={i} name="Star" className={`w-3 h-3 ${i < level ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
        ))}
    </div>
);

const ActionsMenu: React.FC<Omit<RoutineCardProps, 'routine' | 'view'>> = ({ onEdit, onAssign, onDuplicate, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const createHandleClick = (action: () => void) => () => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <Icon name="MoreVertical" className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10">
                    <ul className="py-1">
                        <li><button onClick={createHandleClick(onEdit)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"><Icon name="Edit" className="w-4 h-4"/>Editar</button></li>
                        <li><button onClick={createHandleClick(onAssign)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"><Icon name="UserPlus" className="w-4 h-4"/>Asignar</button></li>
                        <li><button onClick={createHandleClick(onDuplicate)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"><Icon name="Copy" className="w-4 h-4"/>Duplicar</button></li>
                        <li><hr className="border-gray-700 my-1"/></li>
                        <li><button onClick={createHandleClick(onDelete)} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-800 hover:text-red-400"><Icon name="Trash" className="w-4 h-4"/>Eliminar</button></li>
                    </ul>
                </div>
            )}
        </div>
    );
};

const RoutineCard: React.FC<RoutineCardProps> = (props) => {
    const { routine, view, onEdit, onAssign } = props;

    if (view === 'list') {
      return (
         <Card className="p-4 flex items-center justify-between transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="text-3xl hidden sm:block">
                    {routine.category === 'strength' ? '💪' : routine.category === 'cardio' ? '❤️' : '⚡'}
                </div>
                <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{routine.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{routine.description}</p>
                </div>
            </div>
             <div className="hidden lg:flex items-center gap-6 text-sm text-gray-400 mx-6">
                <DifficultyStars level={routine.difficulty} />
                <div className="flex items-center gap-2" title="Duración"><Icon name="Clock" className="w-4 h-4"/><span>{routine.duration} min</span></div>
                <div className="flex items-center gap-2" title="Ejercicios"><Icon name="Activity" className="w-4 h-4"/><span>{routine.exercises.length}</span></div>
                <div className="flex items-center gap-2" title="Miembros Asignados"><Icon name="Users" className="w-4 h-4"/><span>{routine.assignedMembers || 0}</span></div>
            </div>
            <ActionsMenu {...props} />
         </Card>
      )
    }

    return (
      <Card className="p-0 flex flex-col group transition-all duration-300 hover:scale-[1.03] hover:shadow-glow">
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${categoryStyles[routine.category]}`}>
                        {routine.category.toUpperCase()}
                    </span>
                </div>
                <div className="relative -top-2 -right-2">
                   <ActionsMenu {...props} />
                </div>
            </div>
            <h3 className="font-bold text-xl text-white mb-1">{routine.name}</h3>
            <p className="text-sm text-gray-500 h-10">{routine.description}</p>
        </div>
        
        <div className="px-6 py-4 border-y border-gray-800 flex justify-around text-center">
            <div>
                <p className="text-xs text-gray-500">Duración</p>
                <p className="font-bold text-white flex items-center gap-1"><Icon name="Clock" className="w-4 h-4"/>{routine.duration} min</p>
            </div>
             <div>
                <p className="text-xs text-gray-500">Ejercicios</p>
                <p className="font-bold text-white flex items-center gap-1"><Icon name="Activity" className="w-4 h-4"/>{routine.exercises.length}</p>
            </div>
            <div>
                <p className="text-xs text-gray-500">Asignados</p>
                <p className="font-bold text-white flex items-center gap-1"><Icon name="Users" className="w-4 h-4"/>{routine.assignedMembers || 0}</p>
            </div>
        </div>
        
        <div className="p-6">
            <p className="text-xs font-semibold text-gray-400 mb-2">EJERCICIOS DESTACADOS</p>
             <div className="flex flex-wrap gap-2">
              {routine.exercises.slice(0, 3).map((ex) => (
                <span key={ex.id} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{ex.name}</span>
              ))}
              {routine.exercises.length > 3 && <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">+{routine.exercises.length - 3} más</span>}
            </div>
        </div>

        <div className="p-4 mt-auto flex gap-2">
            <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"><Icon name="Edit" className="w-4 h-4"/>Editar</button>
            <button onClick={onAssign} className="flex-1 flex items-center justify-center gap-2 text-sm text-white bg-primary hover:bg-primary-dark font-semibold py-2 px-4 rounded-lg transition-colors"><Icon name="UserPlus" className="w-4 h-4"/>Asignar</button>
        </div>
      </Card>
    );
};

export default RoutineCard;
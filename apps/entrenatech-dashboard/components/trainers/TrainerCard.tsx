
import React, { useState, useRef, useEffect } from 'react';
import { Instructor } from '@/types';
import Icon from '@/ui/Icon';
import Card from '@/ui/Card';

interface TrainerCardProps {
    trainer: Instructor;
}

const statusStyles: { [key in Instructor['status']]: string } = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
};

const ActionsMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                <Icon name="MoreVertical" className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10">
                    <ul className="py-1">
                        <li><button className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"><Icon name="FileText" className="w-4 h-4"/>Ver Perfil</button></li>
                        <li><button className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"><Icon name="Edit" className="w-4 h-4"/>Editar</button></li>
                        <li><hr className="border-gray-700 my-1"/></li>
                        <li><button className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-orange-400 hover:bg-gray-800"><Icon name="UserX" className="w-4 h-4"/>Desactivar</button></li>
                    </ul>
                </div>
            )}
        </div>
    );
};


const TrainerCard: React.FC<TrainerCardProps> = ({ trainer }) => {
    return (
        <Card className="p-0 flex flex-col text-center group transition-all duration-300 hover:scale-105 hover:shadow-glow">
            <div className="p-6">
                <div className="relative w-24 h-24 mx-auto">
                    <img src={trainer.avatar} alt={trainer.name} className="w-24 h-24 rounded-full border-4 border-gray-800 group-hover:border-primary transition-colors" />
                     <span className={`absolute bottom-0 right-0 block h-4 w-4 rounded-full border-2 border-secondary ${trainer.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                </div>
                <h3 className="mt-4 font-bold text-lg text-white">{trainer.name}</h3>
                <p className="text-sm text-gray-500">{trainer.email}</p>
                <span className={`mt-2 inline-block px-2 py-0.5 text-xs font-bold rounded-full ${statusStyles[trainer.status]}`}>{trainer.status}</span>
            </div>

            <div className="px-6 py-4 border-y border-gray-800">
                <p className="text-xs font-semibold text-gray-400 mb-2">ESPECIALIDADES</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {trainer.specialties.map(spec => (
                        <span key={spec} className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">{spec}</span>
                    ))}
                </div>
            </div>

            <div className="p-4 flex justify-around text-center bg-gray-900/50">
                 <div>
                    <p className="text-xs text-gray-500">Clases</p>
                    <p className="font-bold text-white flex items-center justify-center gap-1"><Icon name="Calendar" className="w-4 h-4"/>{trainer.classesTaught}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Miembros</p>
                    <p className="font-bold text-white flex items-center justify-center gap-1"><Icon name="Users" className="w-4 h-4"/>{trainer.activeMembers}</p>
                </div>
            </div>

            <div className="p-2 mt-auto">
                <ActionsMenu />
            </div>
        </Card>
    );
};

export default TrainerCard;
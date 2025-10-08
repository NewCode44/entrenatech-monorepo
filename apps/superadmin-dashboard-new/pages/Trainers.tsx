
import React, { useState, useMemo } from 'react';
import { Instructor } from '@/types';
import { INSTRUCTORS_DATA } from '../constants';
import Icon from '@/ui/Icon';
import StatsCard from '@/ui/StatsCard';
import TrainerCard from '../components/trainers/TrainerCard';
import AddTrainerModal from '../components/trainers/AddTrainerModal';

const Trainers: React.FC = () => {
    const [trainers, setTrainers] = useState<Instructor[]>(INSTRUCTORS_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const allSpecialties = useMemo(() => {
        const specialties = new Set<string>();
        INSTRUCTORS_DATA.forEach(t => t.specialties.forEach(s => specialties.add(s)));
        return Array.from(specialties);
    }, []);
    
    const handleAddTrainer = (newTrainerData: Omit<Instructor, 'id' | 'classesTaught' | 'activeMembers'>) => {
        const newTrainer: Instructor = {
            ...newTrainerData,
            id: `inst-${Date.now()}`,
            classesTaught: 0,
            activeMembers: 0,
        };
        setTrainers(prev => [newTrainer, ...prev]);
        setAddModalOpen(false);
    };

    const filteredTrainers = useMemo(() => {
        return trainers
            .filter(t => statusFilter === 'all' || t.status === statusFilter)
            .filter(t => specialtyFilter === 'all' || t.specialties.includes(specialtyFilter))
            .filter(t => {
                const search = searchTerm.toLowerCase();
                return (
                    t.name.toLowerCase().includes(search) ||
                    t.specialties.some(s => s.toLowerCase().includes(search))
                );
            });
    }, [searchTerm, specialtyFilter, statusFilter, trainers]);

    return (
        <>
            <div className="space-y-8">
                {/* Header */}
                <div className="md:flex justify-between items-center bg-secondary p-8 rounded-xl border border-gray-800">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <Icon name="User" className="w-10 h-10 text-primary"/>
                            <span className="gradient-text">Gestión de Entrenadores</span>
                        </h1>
                        <p className="text-lg text-gray-500">
                            Administra los perfiles y especialidades de tu equipo de entrenadores.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <Icon name="UserPlus" className="w-4 h-4" />
                            Añadir Entrenador
                        </button>
                    </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Entrenadores" value={trainers.length.toString()} icon="Users" />
                    <StatsCard title="Entrenadores Activos" value={trainers.filter(t => t.status === 'active').length.toString()} icon="Zap" />
                    <StatsCard title="Clases este Mes" value="128" change="+15" icon="Calendar" />
                    <StatsCard title="Top Especialidad" value="Funcional" icon="Sparkles" />
                </div>

                {/* Filters and Search */}
                 <div className="bg-secondary p-4 rounded-xl border border-gray-800">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-auto">
                            <Icon name="Search" className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre o especialidad..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div className="flex gap-2">
                             <select 
                                value={specialtyFilter}
                                onChange={e => setSpecialtyFilter(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                            >
                                <option value="all">Toda Especialidad</option>
                                {allSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select 
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                            >
                                <option value="all">Todo Estado</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                {/* Trainers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTrainers.map(trainer => (
                        <TrainerCard key={trainer.id} trainer={trainer} />
                    ))}
                </div>

            </div>
            <AddTrainerModal 
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAddTrainer={handleAddTrainer}
            />
        </>
    );
};

export default Trainers;
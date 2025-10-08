
import React, { useState } from 'react';
import { Page, Routine, RoutineCategory } from '@/types';
import { ROUTINES_DATA, ROUTINE_CATEGORIES } from '../constants';
import Icon from '@/ui/Icon';
import StatsCard from '@/ui/StatsCard';
import RoutineCard from '../components/routines/RoutineCard';
import AssignModal from '../components/routines/AssignModal';
import ConfirmationModal from '../components/routines/ConfirmationModal';
import ImportRoutinesModal from '../components/routines/ImportRoutinesModal';

interface RoutinesProps {
    setCurrentPage: (page: Page) => void;
    onEditRoutine: (routine: Routine) => void;
}

const Routines: React.FC<RoutinesProps> = ({ setCurrentPage, onEditRoutine }) => {
    const [routines, setRoutines] = useState<Routine[]>(ROUTINES_DATA);
    const [filter, setFilter] = useState<RoutineCategory | 'all'>('all');
    const [view, setView] = useState<'grid' | 'list'>('grid');

    const [isAssignModalOpen, setAssignModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isImportModalOpen, setImportModalOpen] = useState(false);
    const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

    const handleAssignClick = (routine: Routine) => {
        setSelectedRoutine(routine);
        setAssignModalOpen(true);
    };

    const handleDeleteClick = (routineId: string) => {
        const routineToDelete = routines.find(r => r.id === routineId);
        if (routineToDelete) {
            setSelectedRoutine(routineToDelete);
            setDeleteModalOpen(true);
        }
    };
    
    const handleDuplicate = (routineToDuplicate: Routine) => {
        const newRoutine: Routine = {
            ...routineToDuplicate,
            id: `routine-${Date.now()}`,
            name: `${routineToDuplicate.name} (Copia)`,
        };
        setRoutines(prevRoutines => [newRoutine, ...prevRoutines]);
    };

    const confirmDelete = () => {
        if (selectedRoutine) {
            setRoutines(prevRoutines => prevRoutines.filter(r => r.id !== selectedRoutine.id));
            setDeleteModalOpen(false);
            setSelectedRoutine(null);
        }
    };
    
    const confirmAssign = () => {
        // Lógica de asignación aquí
        alert(`Rutina "${selectedRoutine?.name}" asignada!`);
        setAssignModalOpen(false);
        setSelectedRoutine(null);
    }
    
    const handleImport = (importedRoutines: Routine[]) => {
        setRoutines(prev => [...prev, ...importedRoutines]);
        setImportModalOpen(false);
        alert(`${importedRoutines.length} rutinas importadas con éxito!`);
    };

    const filteredRoutines = filter === 'all'
        ? routines
        : routines.filter(r => r.category === filter);

    return (
        <>
            <div className="space-y-8">
                {/* Header Premium */}
                <div className="md:flex justify-between items-center bg-secondary p-8 rounded-xl border border-gray-800">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <Icon name="Dumbbell" className="w-10 h-10 text-primary"/>
                            <span className="gradient-text">Gestión de Rutinas</span>
                        </h1>
                        <p className="text-lg text-gray-500">
                            Administra y asigna rutinas personalizadas a tus miembros.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <button onClick={() => setCurrentPage('Creador de Rutinas')} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <Icon name="Plus" className="w-4 h-4" />
                            Nueva Rutina
                        </button>
                        <button onClick={() => setImportModalOpen(true)} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors">
                            <Icon name="Upload" className="w-4 h-4" />
                            Importar
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Rutinas" value={routines.length.toString()} change={`+${routines.length - ROUTINES_DATA.length}`} icon="Dumbbell" />
                    <StatsCard title="Rutinas Activas" value={routines.filter(r => r.assignedMembers && r.assignedMembers > 0).length.toString()} change="+5" icon="Play" />
                    <StatsCard title="Miembros Asignados" value={routines.reduce((sum, r) => sum + (r.assignedMembers || 0), 0).toString()} change="+23" icon="Users" />
                    <StatsCard title="Promedio Dificultad" value={routines.length > 0 ? `${(routines.reduce((sum, r) => sum + r.difficulty, 0) / routines.length).toFixed(1)} / 5` : 'N/A'} change="" icon="TrendingUp" />
                </div>

                {/* Filtros y Vista */}
                <div className="flex justify-between items-center bg-secondary p-4 rounded-xl border border-gray-800">
                     <div className="flex items-center bg-secondary-light p-1 rounded-lg border border-gray-800 space-x-1">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>
                            Todas
                        </button>
                        {ROUTINE_CATEGORIES.map(cat => (
                             <button key={cat.id} onClick={() => setFilter(cat.id)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === cat.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>
                                {cat.name}
                             </button>
                        ))}
                    </div>
                    <div className="flex items-center bg-secondary-light p-1 rounded-lg border border-gray-800 space-x-1">
                        <button onClick={() => setView('grid')} className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>
                            <Icon name="Grid3X3" className="w-5 h-5" />
                        </button>
                        <button onClick={() => setView('list')} className={`p-2 rounded-md transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}>
                            <Icon name="List" className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Rutinas Grid/List */}
                <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                    {filteredRoutines.map(routine => (
                        <RoutineCard 
                            key={routine.id} 
                            routine={routine} 
                            view={view}
                            onEdit={() => onEditRoutine(routine)}
                            onAssign={() => handleAssignClick(routine)}
                            onDuplicate={() => handleDuplicate(routine)}
                            onDelete={() => handleDeleteClick(routine.id)}
                        />
                    ))}
                </div>
            </div>
            <AssignModal 
                isOpen={isAssignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                onAssign={confirmAssign}
                routine={selectedRoutine}
            />
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                routine={selectedRoutine}
            />
            <ImportRoutinesModal
                isOpen={isImportModalOpen}
                onClose={() => setImportModalOpen(false)}
                onImport={handleImport}
            />
        </>
    );
};

export default Routines;
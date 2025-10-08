
import React, { useState } from 'react';
import Icon from '@/ui/Icon';
import { Exercise } from '@/types';
import { EXERCISE_DATABASE, EXERCISE_CATEGORIES } from '../../constants';

interface ExerciseLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddExercise: (exercise: Exercise) => void;
    routineExercises: Exercise[];
}

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'chest': return '흉';
        case 'back': return 'ጀ';
        case 'legs': return '🦵';
        case 'shoulders': return '💪';
        case 'arms': return '✊';
        case 'core': return '🧘';
        case 'cardio': return '❤️';
        case 'functional': return '⚡';
        case 'plyometrics': return '🐰';
        case 'mobility': return '🧘‍♂️';
        case 'olympic': return '🏋️‍♀️';
        default: return '🤸';
    }
};

const ExerciseCard: React.FC<{ exercise: Exercise; onAdd: () => void; isInRoutine: boolean; }> = ({ exercise, onAdd, isInRoutine }) => (
    <div className="flex items-center p-3 bg-gray-900 rounded-lg border border-gray-800">
        <div className="w-12 h-12 bg-gray-800 rounded-md mr-4 flex items-center justify-center text-2xl">
            {getCategoryIcon(exercise.category)}
        </div>
        <div className="flex-grow">
            <h4 className="font-bold text-white">{exercise.name}</h4>
            <p className="text-xs text-gray-500">{exercise.muscle_groups.join(', ')}</p>
        </div>
        <button 
            onClick={onAdd}
            disabled={isInRoutine}
            className="p-2 bg-primary disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
           {isInRoutine ? <Icon name="CheckCircle" className="w-5 h-5" /> : <Icon name="Plus" className="w-5 h-5" />}
        </button>
    </div>
);


const ExerciseLibraryModal: React.FC<ExerciseLibraryModalProps> = ({ isOpen, onClose, onAddExercise, routineExercises }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    if (!isOpen) return null;

    const filteredExercises = EXERCISE_DATABASE
        .filter(ex => selectedCategory === 'all' || ex.category === selectedCategory)
        .filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="bg-secondary rounded-xl border border-gray-800 shadow-xl w-full max-w-4xl h-[90vh] flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2"><Icon name="Library" className="w-6 h-6"/>Biblioteca Completa de Ejercicios</h3>
                  <button onClick={onClose} className="p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800">
                    <Icon name="X" className="w-6 h-6" />
                  </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-800 flex-shrink-0">
                    <div className="relative flex-grow mb-3">
                        <Icon name="Search" className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                        <input
                            type="text"
                            placeholder="Buscar en la biblioteca completa..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {EXERCISE_CATEGORIES.map(cat => (
                            <button 
                                key={cat.id} 
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Exercise List */}
                <div className="p-4 flex-grow overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredExercises.length > 0 ? filteredExercises.map(ex => (
                        <ExerciseCard 
                            key={ex.id} 
                            exercise={ex} 
                            onAdd={() => onAddExercise(ex)}
                            isInRoutine={routineExercises.some(e => e.id === ex.id)}
                        />
                    )) : (
                        <div className="text-center py-10 text-gray-600 md:col-span-2">
                            <p>No se encontraron ejercicios para los filtros seleccionados.</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseLibraryModal;
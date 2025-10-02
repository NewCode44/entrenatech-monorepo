
import React, { useState } from 'react';
import Card from '@/ui/Card';
import Icon from '@/ui/Icon';
import { Routine, Exercise } from '@/types';
import { TOP_EXERCISES } from '../../constants';
import ExerciseLibraryModal from './ExerciseLibraryModal';

interface ExerciseBuilderStepProps {
    routine: Partial<Routine>;
    setRoutine: React.Dispatch<React.SetStateAction<Partial<Routine>>>;
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

const ExerciseBuilderStep: React.FC<ExerciseBuilderStepProps> = ({ routine, setRoutine }) => {
    const [isLibraryOpen, setLibraryOpen] = useState(false);
    
    const addExercise = (exercise: Exercise) => {
        const newExercise = { ...exercise, sets: 3, reps: '12', rest: '60s' };
        if (!(routine.exercises || []).some(e => e.id === exercise.id)) {
            setRoutine(prev => ({ ...prev, exercises: [...(prev.exercises || []), newExercise] }));
        }
    };
    
    const removeExercise = (exerciseId: number) => {
        setRoutine(prev => ({ ...prev, exercises: (prev.exercises || []).filter(e => e.id !== exerciseId) }));
    };

    const updateExerciseConfig = (id: number, field: string, value: any) => {
        setRoutine(prev => ({
            ...prev,
            exercises: (prev.exercises || []).map(ex => ex.id === id ? { ...ex, [field]: value } : ex)
        }));
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Popular Exercises & Library Access */}
                <Card className="flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4">Acceso Rápido</h3>
                     <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                        {TOP_EXERCISES.map(ex => (
                            <ExerciseCard 
                                key={ex.id} 
                                exercise={ex} 
                                onAdd={() => addExercise(ex)}
                                isInRoutine={(routine.exercises || []).some(e => e.id === ex.id)}
                            />
                        ))}
                    </div>
                    <button 
                        onClick={() => setLibraryOpen(true)}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                        <Icon name="Library" className="w-5 h-5" />
                        Explorar Biblioteca Completa
                    </button>
                </Card>

                {/* Routine Builder */}
                <Card className="flex flex-col">
                     <h3 className="text-lg font-bold text-white mb-4">Tu Rutina</h3>
                     <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                        {(routine.exercises || []).length > 0 ? (
                            (routine.exercises || []).map(ex => (
                                <div key={ex.id} className="p-3 bg-gray-900 rounded-lg border border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-white">{ex.name}</h4>
                                        <button onClick={() => removeExercise(ex.id)} className="text-gray-500 hover:text-red-500"><Icon name="X" className="w-5 h-5"/></button>
                                    </div>
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="text-xs text-gray-500">Sets</label>
                                            <input type="number" value={ex.sets} onChange={e => updateExerciseConfig(ex.id, 'sets', parseInt(e.target.value))} className="w-full bg-gray-800 p-1 rounded border border-gray-700 text-center"/>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Reps</label>
                                            <input type="text" value={ex.reps} onChange={e => updateExerciseConfig(ex.id, 'reps', e.target.value)} className="w-full bg-gray-800 p-1 rounded border border-gray-700 text-center"/>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Descanso</label>
                                            <input type="text" value={ex.rest} onChange={e => updateExerciseConfig(ex.id, 'rest', e.target.value)} className="w-full bg-gray-800 p-1 rounded border border-gray-700 text-center"/>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                                <Icon name="Dumbbell" className="w-16 h-16"/>
                                <p className="mt-2">Añade ejercicios desde el acceso rápido o explora la biblioteca completa.</p>
                            </div>
                        )}
                     </div>
                </Card>
            </div>
            <ExerciseLibraryModal 
                isOpen={isLibraryOpen}
                onClose={() => setLibraryOpen(false)}
                onAddExercise={addExercise}
                routineExercises={routine.exercises || []}
            />
        </>
    );
};

export default ExerciseBuilderStep;
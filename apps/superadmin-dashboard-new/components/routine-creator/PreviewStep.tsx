
import React from 'react';
import Card from '@/ui/Card';
import { Routine } from '@/types';
import Icon from '@/ui/Icon';

interface PreviewStepProps {
    routine: Partial<Routine>;
}

const PreviewStep: React.FC<PreviewStepProps> = ({ routine }) => {
    return (
        <Card>
            <h3 className="text-2xl font-bold text-white mb-4">Previsualización de la Rutina</h3>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                <h4 className="text-xl font-bold text-primary">{routine.name || 'Rutina sin nombre'}</h4>
                <p className="text-gray-400 mt-1">{routine.description || 'Sin descripción.'}</p>

                <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Categoría</p>
                        <p className="font-semibold text-white capitalize">{routine.category}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Dificultad</p>
                        <p className="font-semibold text-white">{routine.difficulty} / 5</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Duración</p>
                        <p className="font-semibold text-white">{routine.duration} min</p>
                    </div>
                </div>

                <hr className="border-gray-700 my-4"/>

                <h5 className="font-bold text-white mb-2">Ejercicios ({routine.exercises?.length || 0})</h5>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {(routine.exercises || []).map(ex => (
                        <div key={ex.id} className="bg-gray-800 p-2 rounded-md flex justify-between items-center text-sm">
                            <span className="text-gray-300">{ex.name}</span>
                            <span className="text-gray-400">{ex.sets}x{ex.reps}</span>
                        </div>
                    ))}
                </div>
            </div>
             <div className="text-center py-10">
                <Icon name="CheckCircle" className="w-16 h-16 text-success mx-auto mb-4"/>
                <h1 className="text-2xl font-bold text-white">¡Rutina Lista!</h1>
                <p className="text-gray-500 mt-2">Revisa los detalles y haz clic en "Finalizar y Guardar" para añadirla a tu biblioteca.</p>
             </div>
        </Card>
    );
};

export default PreviewStep;

import React, { useState, useEffect } from 'react';
import { Page, Routine } from '@/types';
import Icon from '@/ui/Icon';
import BasicInfoStep from '../components/routine-creator/BasicInfoStep';
import ExerciseBuilderStep from '../components/routine-creator/ExerciseBuilderStep';
import PreviewStep from '../components/routine-creator/PreviewStep';

interface RoutineCreatorProps {
    setCurrentPage: (page: Page) => void;
    routineToEdit: Routine | null;
}

const RoutineCreator: React.FC<RoutineCreatorProps> = ({ setCurrentPage, routineToEdit }) => {
    const [step, setStep] = useState(1);
    const [routine, setRoutine] = useState<Partial<Routine>>({
        name: '',
        description: '',
        category: 'strength',
        difficulty: 1,
        duration: 30,
        exercises: [],
    });

    useEffect(() => {
        if (routineToEdit) {
            setRoutine(routineToEdit);
        }
    }, [routineToEdit]);

    const STEPS = [
        { number: 1, label: 'Información Básica' },
        { number: 2, label: 'Ejercicios' },
        { number: 3, label: 'Preview & Guardar' },
    ];
    
    const handleBack = () => {
        if (step === 1) {
            setCurrentPage('Rutinas');
        } else {
            setStep(s => s - 1);
        }
    }
    
    const handleSave = () => {
        alert(routineToEdit ? `Rutina "${routine.name}" actualizada!` : `Rutina "${routine.name}" creada!`);
        setCurrentPage('Rutinas');
    }

    const title = routineToEdit ? "Editor de Rutina" : "Creador de Rutinas";

    return (
        <div className="space-y-8 flex flex-col h-full">
            {/* Header con Progress */}
            <div className="bg-secondary p-8 rounded-xl border border-gray-800">
                <div className="md:flex justify-between items-center">
                    <div>
                         <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <Icon name={routineToEdit ? "Edit" : "Zap"} className={`w-8 h-8 ${routineToEdit ? 'text-primary' : 'text-accent'}`}/>
                            <span className="gradient-text">{title}</span>
                        </h1>
                        <p className="text-lg text-gray-500">
                            {routineToEdit ? `Editando la rutina: ${routineToEdit.name}` : 'Diseña rutinas personalizadas con nuestra biblioteca de ejercicios.'}
                        </p>
                    </div>
                </div>
                 {/* Progress Stepper */}
                <div className="mt-6 flex justify-between items-center">
                    {STEPS.map((s, index) => (
                        <React.Fragment key={s.number}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.number ? 'bg-primary border-primary' : 'bg-gray-800 border-gray-700'}`}>
                                    {step > s.number ? <Icon name="CheckCircle" className="w-6 h-6 text-white"/> : <span className="font-bold text-lg">{s.number}</span>}
                                </div>
                                <p className={`mt-2 text-sm font-medium ${step >= s.number ? 'text-white' : 'text-gray-500'}`}>{s.label}</p>
                            </div>
                            {index < STEPS.length - 1 && <div className={`flex-1 h-1 mx-4 rounded-full ${step > s.number ? 'bg-primary' : 'bg-gray-700'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow">
                {step === 1 && <BasicInfoStep routine={routine} setRoutine={setRoutine} />}
                {step === 2 && <ExerciseBuilderStep routine={routine} setRoutine={setRoutine} />}
                {step === 3 && <PreviewStep routine={routine} />}
            </div>

            {/* Navigation */}
            <div className="bg-secondary p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                 <button
                    onClick={handleBack}
                    className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    <Icon name="ArrowLeft" className="w-4 h-4" />
                    {step === 1 ? 'Volver a Rutinas' : 'Anterior'}
                </button>

                 <button className="flex items-center gap-2 bg-transparent hover:bg-gray-800 text-gray-400 font-semibold py-2 px-4 rounded-lg transition-colors">
                    <Icon name="Save" className="w-4 h-4" />
                    Guardar Borrador
                </button>
                
                {step < 3 ? (
                    <button
                        onClick={() => setStep(s => Math.min(3, s + 1))}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Siguiente
                        <Icon name="ArrowRight" className="w-4 h-4" />
                    </button>
                ) : (
                    <button onClick={handleSave} className="flex items-center gap-2 bg-success hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        <Icon name="CheckCircle" className="w-4 h-4" />
                        {routineToEdit ? 'Actualizar Rutina' : 'Finalizar y Guardar'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RoutineCreator;
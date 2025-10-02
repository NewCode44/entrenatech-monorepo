import React, { useState } from 'react';
import Card from '@/ui/Card';
import Icon from '@/ui/Icon';
import { Routine, RoutineCategory } from '@/types';
import { RoutineGeneratorAI, AIRoutineRequest } from '../../services/ai/routineGenerator';

interface BasicInfoStepProps {
    routine: Partial<Routine>;
    setRoutine: React.Dispatch<React.SetStateAction<Partial<Routine>>>;
}

const CATEGORIES: { id: RoutineCategory; name: string; icon: string; }[] = [
    { id: 'strength', name: 'Fuerza', icon: '💪' },
    { id: 'cardio', name: 'Cardio', icon: '❤️' },
    { id: 'hiit', name: 'HIIT', icon: '⚡' },
    { id: 'flexibility', name: 'Flexibilidad', icon: '🧘‍♀️' },
    { id: 'custom', name: 'Personalizada', icon: '✨' },
];

const getDifficultyLabel = (level: number) => {
    switch(level) {
        case 1: return "Muy Fácil";
        case 2: return "Fácil";
        case 3: return "Moderado";
        case 4: return "Difícil";
        case 5: return "Experto";
        default: return "";
    }
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ routine, setRoutine }) => {
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null);

    const handleFieldChange = (field: keyof Routine, value: any) => {
        setRoutine(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateWithAI = async () => {
        setIsGenerating(true);

        const request: AIRoutineRequest = {
            goal: (routine.category as any) || 'general',
            experience: routine.difficulty && routine.difficulty >= 4 ? 'advanced' : routine.difficulty && routine.difficulty >= 3 ? 'intermediate' : 'beginner',
            daysPerWeek: 4,
            sessionDuration: routine.duration || 60,
            equipment: ['Barra', 'Mancuernas', 'Polea', 'Máquina'],
        };

        try {
            const result = await RoutineGeneratorAI.generateRoutine(request);
            setAiResult(result);

            // Aplicar la rutina generada
            setRoutine(prev => ({
                ...prev,
                ...result.routine,
                name: routine.name || result.routine.name,
                description: routine.description || result.routine.description,
            }));

            alert('¡Rutina generada con IA! ✨\n\n' + result.explanation);
        } catch (error) {
            alert('Error al generar rutina');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Información Principal</h3>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Nombre de la Rutina</label>
                            <input
                                id="name"
                                type="text"
                                value={routine.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                placeholder="Ej: Rutina de Fuerza para Principiantes"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                            />
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                            <textarea
                                id="description"
                                value={routine.description}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                placeholder="Describe los objetivos y características de la rutina..."
                                rows={4}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </Card>
                 <Card>
                    <h3 className="text-lg font-bold text-white mb-4">Categoría</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleFieldChange('category', cat.id)}
                                className={`p-4 border-2 rounded-lg text-center transition-colors ${routine.category === cat.id ? 'bg-primary/20 border-primary' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`}
                            >
                                <div className="text-4xl mb-2">{cat.icon}</div>
                                <p className="font-semibold text-white">{cat.name}</p>
                            </button>
                        ))}
                    </div>
                </Card>
            </div>
            
            {/* Columna Derecha */}
            <div className="space-y-6">
                 <Card>
                     <h3 className="text-lg font-bold text-white mb-4">Configuración</h3>
                    <div className="space-y-6">
                         <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Nivel de Dificultad</label>
                             <div className="flex items-center justify-between">
                                {[1, 2, 3, 4, 5].map(level => (
                                    <button key={level} onClick={() => handleFieldChange('difficulty', level)}>
                                        <Icon name="Star" className={`w-8 h-8 transition-colors ${level <= (routine.difficulty || 0) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-500 mt-2">{getDifficultyLabel(routine.difficulty || 1)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Duración Estimada (min)</label>
                            <input 
                                type="range" 
                                min="15" 
                                max="120" 
                                step="5"
                                value={routine.duration || 30}
                                onChange={(e) => handleFieldChange('duration', parseInt(e.target.value, 10))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>15</span>
                                <span className="text-lg font-bold text-white -mt-1">{routine.duration} min</span>
                                <span>120</span>
                            </div>
                        </div>
                    </div>
                </Card>
                 <Card className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-primary/50">
                     <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Icon name="Brain" className="w-5 h-5"/>Generador con IA</h3>
                     <p className="text-sm text-gray-400 mb-4">Deja que la IA genere automáticamente una rutina personalizada basada en tus parámetros.</p>
                     <button
                        onClick={handleGenerateWithAI}
                        disabled={isGenerating || !routine.category}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                     >
                        {isGenerating ? (
                            <>
                                <Icon name="Loader" className="w-5 h-5 animate-spin"/>
                                Generando...
                            </>
                        ) : (
                            <>
                                <Icon name="Sparkles" className="w-5 h-5"/>
                                Generar con IA
                            </>
                        )}
                     </button>
                     {aiResult && (
                        <div className="mt-4 p-3 bg-black/30 rounded-lg">
                            <p className="text-xs text-green-400 font-bold mb-1">✓ Rutina generada</p>
                            <p className="text-xs text-gray-300">{aiResult.estimatedResults}</p>
                        </div>
                     )}
                </Card>
            </div>
        </div>
    );
};

export default BasicInfoStep;
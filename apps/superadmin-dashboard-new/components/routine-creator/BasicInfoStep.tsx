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
    const [showResultModal, setShowResultModal] = useState(false);
    const [aiFormData, setAiFormData] = useState({
        age: '',
        weight: '',
        height: '',
        gender: 'male' as 'male' | 'female' | 'other',
        activityLevel: 'sedentary' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
        injuries: '',
        availableDays: 3,
        sessionDuration: 60,
        equipment: [] as string[],
    });

    const handleFieldChange = (field: keyof Routine, value: any) => {
        setRoutine(prev => ({ ...prev, [field]: value }));
    };

    const handleGenerateWithAI = async () => {
        setIsGenerating(true);
        setShowAIGenerator(false);

        const request: AIRoutineRequest = {
            goal: (routine.category as any) || 'general',
            experience: routine.difficulty && routine.difficulty >= 4 ? 'advanced' : routine.difficulty && routine.difficulty >= 3 ? 'intermediate' : 'beginner',
            daysPerWeek: aiFormData.availableDays,
            sessionDuration: aiFormData.sessionDuration,
            equipment: aiFormData.equipment.length > 0 ? aiFormData.equipment : ['Barra', 'Mancuernas', 'Polea', 'Máquina'],
            restrictions: aiFormData.injuries ? [aiFormData.injuries] : undefined,
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

            setShowResultModal(true);
        } catch (error) {
            console.error('Error al generar rutina:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleEquipment = (equipment: string) => {
        setAiFormData(prev => ({
            ...prev,
            equipment: prev.equipment.includes(equipment)
                ? prev.equipment.filter(e => e !== equipment)
                : [...prev.equipment, equipment]
        }));
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
                        onClick={() => setShowAIGenerator(true)}
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

            {/* Modal Formulario IA */}
            {showAIGenerator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-primary/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-primary/30 p-6 sticky top-0 z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                        <Icon name="Brain" className="w-6 h-6 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">Generador con IA</h3>
                                        <p className="text-sm text-gray-400">Cuéntanos sobre ti para crear tu rutina perfecta</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAIGenerator(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Icon name="X" className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Datos Personales */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Icon name="User" className="w-5 h-5 text-primary"/>
                                    Datos Personales
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Edad</label>
                                        <input
                                            type="number"
                                            value={aiFormData.age}
                                            onChange={(e) => setAiFormData({...aiFormData, age: e.target.value})}
                                            placeholder="Ej: 25"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Género</label>
                                        <select
                                            value={aiFormData.gender}
                                            onChange={(e) => setAiFormData({...aiFormData, gender: e.target.value as any})}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                                        >
                                            <option value="male">Masculino</option>
                                            <option value="female">Femenino</option>
                                            <option value="other">Otro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Peso (kg)</label>
                                        <input
                                            type="number"
                                            value={aiFormData.weight}
                                            onChange={(e) => setAiFormData({...aiFormData, weight: e.target.value})}
                                            placeholder="Ej: 70"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Altura (cm)</label>
                                        <input
                                            type="number"
                                            value={aiFormData.height}
                                            onChange={(e) => setAiFormData({...aiFormData, height: e.target.value})}
                                            placeholder="Ej: 175"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Nivel de Actividad */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Icon name="Activity" className="w-5 h-5 text-primary"/>
                                    Nivel de Actividad Actual
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { value: 'sedentary', label: 'Sedentario', desc: 'Poco o ningún ejercicio' },
                                        { value: 'light', label: 'Ligero', desc: '1-3 días/semana' },
                                        { value: 'moderate', label: 'Moderado', desc: '3-5 días/semana' },
                                        { value: 'active', label: 'Activo', desc: '6-7 días/semana' },
                                        { value: 'very_active', label: 'Muy Activo', desc: 'Entrenamientos intensos diarios' },
                                    ].map(level => (
                                        <button
                                            key={level.value}
                                            onClick={() => setAiFormData({...aiFormData, activityLevel: level.value as any})}
                                            className={`p-3 border-2 rounded-lg text-left transition-colors ${
                                                aiFormData.activityLevel === level.value
                                                    ? 'bg-primary/20 border-primary'
                                                    : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <p className="font-semibold text-white text-sm">{level.label}</p>
                                            <p className="text-xs text-gray-400">{level.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Equipamiento */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Icon name="Dumbbell" className="w-5 h-5 text-primary"/>
                                    Equipamiento Disponible
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {['Barra', 'Mancuernas', 'Máquinas', 'Polea', 'Peso Corporal', 'Bandas Elásticas', 'Kettlebells', 'TRX'].map(equip => (
                                        <button
                                            key={equip}
                                            onClick={() => toggleEquipment(equip)}
                                            className={`p-3 border-2 rounded-lg text-center transition-colors ${
                                                aiFormData.equipment.includes(equip)
                                                    ? 'bg-primary/20 border-primary'
                                                    : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                                            }`}
                                        >
                                            <p className="font-semibold text-white text-sm">{equip}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Disponibilidad */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Icon name="Calendar" className="w-5 h-5 text-primary"/>
                                    Disponibilidad
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Días por semana</label>
                                        <input
                                            type="range"
                                            min="2"
                                            max="7"
                                            value={aiFormData.availableDays}
                                            onChange={(e) => setAiFormData({...aiFormData, availableDays: parseInt(e.target.value)})}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>2</span>
                                            <span className="text-lg font-bold text-white -mt-1">{aiFormData.availableDays} días</span>
                                            <span>7</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Duración por sesión (min)</label>
                                        <input
                                            type="range"
                                            min="20"
                                            max="120"
                                            step="10"
                                            value={aiFormData.sessionDuration}
                                            onChange={(e) => setAiFormData({...aiFormData, sessionDuration: parseInt(e.target.value)})}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>20</span>
                                            <span className="text-lg font-bold text-white -mt-1">{aiFormData.sessionDuration} min</span>
                                            <span>120</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lesiones/Limitaciones */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <Icon name="AlertCircle" className="w-5 h-5 text-yellow-400"/>
                                    Lesiones o Limitaciones
                                </h4>
                                <textarea
                                    value={aiFormData.injuries}
                                    onChange={(e) => setAiFormData({...aiFormData, injuries: e.target.value})}
                                    placeholder="Describe cualquier lesión, dolor crónico o limitación física que debamos considerar..."
                                    rows={3}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                                />
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowAIGenerator(false)}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleGenerateWithAI}
                                    disabled={!aiFormData.age || !aiFormData.weight || !aiFormData.height}
                                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Icon name="Sparkles" className="w-5 h-5"/>
                                    Generar Rutina Personalizada
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Resultados IA */}
            {showResultModal && aiResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-primary/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-b border-primary/30 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                        <Icon name="Sparkles" className="w-6 h-6 text-white"/>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white">¡Rutina Generada!</h3>
                                        <p className="text-sm text-gray-400">Creada con inteligencia artificial</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowResultModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <Icon name="X" className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Explicación */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Icon name="Info" className="w-5 h-5 text-primary"/>
                                    Cómo funciona esta rutina
                                </h4>
                                <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                                    {aiResult.explanation}
                                </div>
                            </div>

                            {/* Resultados Estimados */}
                            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Icon name="TrendingUp" className="w-5 h-5 text-green-400"/>
                                    Resultados Esperados
                                </h4>
                                <p className="text-sm text-gray-300">
                                    {aiResult.estimatedResults}
                                </p>
                            </div>

                            {/* Tips */}
                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <Icon name="Lightbulb" className="w-5 h-5 text-yellow-400"/>
                                    Consejos para el éxito
                                </h4>
                                <ul className="space-y-2">
                                    {aiResult.tips.map((tip: string, index: number) => (
                                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                                            <span className="text-primary mt-0.5">•</span>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowResultModal(false)}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Icon name="Check" className="w-5 h-5"/>
                                    Continuar Editando
                                </button>
                                <button
                                    onClick={() => {
                                        setAiResult(null);
                                        setShowResultModal(false);
                                    }}
                                    className="px-4 py-3 text-gray-400 hover:text-white transition-colors"
                                >
                                    <Icon name="RotateCcw" className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BasicInfoStep;

import React, { useState } from 'react';
import Icon from '@/ui/Icon';
import { GymClass, Instructor, ClassCategory } from '@/types';
import { INSTRUCTORS_DATA, CLASS_CATEGORIES_DATA } from '../../constants';

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddClass: (gymClass: Omit<GymClass, 'id'>) => void;
}

const STEPS = [
    { number: 1, label: 'Detalles de la Clase', icon: 'Edit' as const },
    { number: 2, label: 'Horario y Capacidad', icon: 'Clock' as const },
    { number: 3, label: 'Confirmación', icon: 'CheckCircle' as const },
];

const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onAddClass }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Omit<GymClass, 'id'>>({
        name: '',
        description: '',
        instructorId: '',
        categoryId: '',
        startTime: '09:00',
        duration: 60,
        dayOfWeek: 1,
        capacity: 20,
        enrolled: 0,
    });

    const resetState = () => {
        setStep(1);
        setFormData({ name: '', description: '', instructorId: '', categoryId: '', startTime: '09:00', duration: 60, dayOfWeek: 1, capacity: 20, enrolled: 0 });
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = () => {
        onAddClass(formData);
        resetState();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'dayOfWeek' || name === 'duration' || name === 'capacity' ? parseInt(value) : value }));
    };

    if (!isOpen) return null;
    
    const selectedInstructor = INSTRUCTORS_DATA.find(i => i.id === formData.instructorId);
    const selectedCategory = CLASS_CATEGORIES_DATA.find(c => c.id === formData.categoryId);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-secondary rounded-xl border border-gray-800 shadow-xl w-full max-w-2xl relative animate-slide-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">Añadir Nueva Clase</h3>
                            <p className="text-sm text-gray-500">Completa los pasos para programar una nueva clase.</p>
                        </div>
                        <button onClick={onClose} className="p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800">
                            <Icon name="X" className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                        {STEPS.map((s, index) => (
                            <React.Fragment key={s.number}>
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.number ? 'bg-primary border-primary' : 'bg-gray-800 border-gray-700'}`}>
                                        {step > s.number ? <Icon name="CheckCircle" className="w-6 h-6 text-white"/> : <Icon name={s.icon} className={`w-5 h-5 ${step >= s.number ? 'text-white' : 'text-gray-500'}`}/>}
                                    </div>
                                    <p className={`mt-2 text-xs font-medium ${step >= s.number ? 'text-white' : 'text-gray-500'}`}>{s.label}</p>
                                </div>
                                {index < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 sm:mx-4 rounded-full ${step > s.number ? 'bg-primary' : 'bg-gray-700'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="p-6 flex-grow">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de la Clase</label>
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej: Yoga Vinyasa" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                                <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary">
                                    <option value="">Selecciona una categoría</option>
                                    {CLASS_CATEGORIES_DATA.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Instructor</label>
                                <select name="instructorId" value={formData.instructorId} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary">
                                    <option value="">Selecciona un instructor</option>
                                    {INSTRUCTORS_DATA.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Breve descripción de la clase..." className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"/>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Día de la Semana</label>
                                <select name="dayOfWeek" value={formData.dayOfWeek} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary">
                                    <option value={1}>Lunes</option>
                                    <option value={2}>Martes</option>
                                    <option value={3}>Miércoles</option>
                                    <option value={4}>Jueves</option>
                                    <option value={5}>Viernes</option>
                                    <option value={6}>Sábado</option>
                                    <option value={7}>Domingo</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Hora de Inicio</label>
                                <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Duración (minutos)</label>
                                <input type="number" name="duration" value={formData.duration} onChange={handleInputChange} step="15" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Capacidad Máxima</label>
                                <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"/>
                            </div>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                           <h3 className={`text-2xl font-bold ${selectedCategory?.color}`}>{formData.name}</h3>
                           <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                                <img src={selectedInstructor?.avatar} alt={selectedInstructor?.name} className="w-6 h-6 rounded-full"/>
                                <span>{selectedInstructor?.name}</span>
                           </div>
                           <p className="text-gray-400 mt-4">{formData.description}</p>
                           <hr className="border-gray-700 my-4"/>
                           <div className="grid grid-cols-2 gap-4 text-sm">
                               <div><p className="text-gray-500">Categoría</p><p className="font-semibold text-white">{selectedCategory?.name}</p></div>
                               <div><p className="text-gray-500">Día</p><p className="font-semibold text-white">{['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][formData.dayOfWeek]}</p></div>
                               <div><p className="text-gray-500">Horario</p><p className="font-semibold text-white">{formData.startTime}</p></div>
                               <div><p className="text-gray-500">Duración</p><p className="font-semibold text-white">{formData.duration} min</p></div>
                               <div><p className="text-gray-500">Capacidad</p><p className="font-semibold text-white">{formData.capacity} personas</p></div>
                           </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-900/50 border-t border-gray-800 flex justify-between items-center">
                    <button onClick={handleBack} disabled={step === 1} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Icon name="ArrowLeft" className="w-4 h-4" />
                        Anterior
                    </button>
                    {step < 3 ? (
                        <button onClick={handleNext} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            Siguiente
                            <Icon name="ArrowRight" className="w-4 h-4" />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} className="flex items-center gap-2 bg-success hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <Icon name="Plus" className="w-4 h-4" />
                            Añadir Clase
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddClassModal;
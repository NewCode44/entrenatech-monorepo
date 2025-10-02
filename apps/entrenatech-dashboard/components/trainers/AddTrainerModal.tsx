
import React, { useState, useRef, DragEvent } from 'react';
import Icon from '@/ui/Icon';
import { Instructor } from '@/types';
import { CLASS_CATEGORIES_DATA } from '../../constants';

interface AddTrainerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddTrainer: (trainer: Omit<Instructor, 'id' | 'classesTaught' | 'activeMembers'>) => void;
}

const STEPS = [
    { number: 1, label: 'Información Personal', icon: 'User' as const },
    { number: 2, label: 'Especialidades', icon: 'Sparkles' as const },
    { number: 3, label: 'Confirmación', icon: 'UserCheck' as const },
];

const AddTrainerModal: React.FC<AddTrainerModalProps> = ({ isOpen, onClose, onAddTrainer }) => {
    const [step, setStep] = useState(1);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<Omit<Instructor, 'id' | 'classesTaught' | 'activeMembers'>>({
        name: '',
        email: '',
        phone: '',
        avatar: '',
        specialties: [],
        bio: '',
        status: 'active',
    });

    const resetState = () => {
        setStep(1);
        setPhotoPreview(null);
        setFormData({ name: '', email: '', phone: '', avatar: '', specialties: [], bio: '', status: 'active' });
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = () => {
        onAddTrainer({ ...formData, avatar: photoPreview || '' });
        resetState();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSpecialtyToggle = (specialty: string) => {
        setFormData(prev => {
            const specialties = prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty];
            return { ...prev, specialties };
        });
    };

    const handleFileChange = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFileChange(e.dataTransfer.files[0]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-secondary rounded-xl border border-gray-800 shadow-xl w-full max-w-2xl relative animate-slide-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">Añadir Nuevo Entrenador</h3>
                            <p className="text-sm text-gray-500">Completa los pasos para registrar un nuevo entrenador.</p>
                        </div>
                        <button onClick={onClose} className="p-1 text-gray-500 hover:text-white rounded-full hover:bg-gray-800">
                            <Icon name="X" className="w-5 h-5" />
                        </button>
                    </div>
                    {/* Stepper */}
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

                {/* Content */}
                <div className="p-6 flex-grow">
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-400 mb-2 text-center">Foto de Perfil</label>
                                <div className="relative w-40 h-40 mx-auto border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center text-center cursor-pointer hover:border-primary transition-colors"
                                    onClick={() => fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept="image/*" className="hidden" />
                                    {photoPreview ? <img src={photoPreview} alt="Vista previa" className="w-full h-full rounded-full object-cover" /> : (
                                        <div className="text-gray-500"><Icon name="UploadCloud" className="w-10 h-10 mx-auto" /><p className="text-xs mt-1">Arrastra o haz clic</p></div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre Completo" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"/>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Correo Electrónico" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"/>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Teléfono" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"/>
                                <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} placeholder="Biografía corta..." className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white"/>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                             <label className="block text-sm font-medium text-gray-400 mb-2">Especialidades</label>
                             <div className="flex flex-wrap gap-2 mb-4">
                                {CLASS_CATEGORIES_DATA.map(cat => (
                                    <button key={cat.id} onClick={() => handleSpecialtyToggle(cat.name)} className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors border ${formData.specialties.includes(cat.name) ? 'bg-primary/20 border-primary text-primary' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                                        {cat.name}
                                    </button>
                                ))}
                             </div>
                             <label className="block text-sm font-medium text-gray-400 mb-2">Estado</label>
                             <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white">
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                             </select>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="text-center bg-gray-900 p-6 rounded-lg border border-gray-700">
                           <img src={photoPreview || `https://i.pravatar.cc/80?u=${formData.email}`} alt="avatar" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary"/>
                           <h3 className="text-2xl font-bold text-white">{formData.name}</h3>
                           <p className="text-gray-400">{formData.email} | {formData.phone}</p>
                           <div className="flex flex-wrap justify-center gap-2 my-2">
                                {formData.specialties.map(spec => <span key={spec} className="text-xs bg-primary/20 text-primary font-semibold px-2 py-1 rounded-full">{spec}</span>)}
                           </div>
                           <p className="text-gray-500 mt-4 text-sm">{formData.bio}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
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
                            <Icon name="UserPlus" className="w-4 h-4" />
                            Añadir Entrenador
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddTrainerModal;

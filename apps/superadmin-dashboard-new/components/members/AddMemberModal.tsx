
import React, { useState, useRef, DragEvent } from 'react';
import Icon from '@/ui/Icon';
import { Member } from '@/types';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMember: (member: Omit<Member, 'id' | 'joinDate'>) => void;
}

const STEPS = [
    { number: 1, label: 'Información Personal', icon: 'User' as const },
    { number: 2, label: 'Plan de Membresía', icon: 'IdCard' as const },
    { number: 3, label: 'Confirmación', icon: 'UserCheck' as const },
];

const PLANS: { id: Member['plan'], name: string, description: string }[] = [
    { id: 'basic', name: 'Básico', description: 'Acceso estándar al gimnasio.' },
    { id: 'premium', name: 'Premium', description: 'Acceso a clases y áreas premium.' },
    { id: 'vip', name: 'VIP', description: 'Todos los beneficios, incluyendo entrenador personal.' },
];

const planStyles: { [key in Member['plan']]: string } = {
    basic: 'bg-gray-700 text-gray-300',
    premium: 'bg-blue-500/20 text-blue-400',
    vip: 'bg-yellow-500/20 text-yellow-400',
};

const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onAddMember }) => {
    const [step, setStep] = useState(1);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: 'active' as Member['status'],
        plan: 'basic' as Member['plan'],
    });

    const resetState = () => {
        setStep(1);
        setPhotoPreview(null);
        setFormData({ name: '', email: '', phone: '', status: 'active', plan: 'basic' });
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));
    
    const handleSubmit = () => {
        onAddMember({ ...formData, avatar: photoPreview || '' });
        resetState();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" 
            onClick={onClose}
        >
            <div 
                className="bg-secondary rounded-xl border border-gray-800 shadow-xl w-full max-w-2xl relative animate-slide-up flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header and Stepper */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">Añadir Nuevo Miembro</h3>
                            <p className="text-sm text-gray-500">Sigue los pasos para registrar un nuevo miembro.</p>
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
                                <div
                                    className="relative w-40 h-40 mx-auto border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-gray-800/50 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <input type="file" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept="image/*" className="hidden" />
                                    {photoPreview ? (
                                        <>
                                            <img src={photoPreview} alt="Vista previa" className="w-full h-full rounded-full object-cover" />
                                            <button onClick={(e) => { e.stopPropagation(); setPhotoPreview(null); }} className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                                                <Icon name="X" className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-gray-500">
                                            <Icon name="UploadCloud" className="w-10 h-10 mx-auto" />
                                            <p className="text-xs mt-1">Arrastra o haz clic para subir</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4 md:col-span-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej: Juan Pérez" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Correo Electrónico</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="ej: juan.perez@email.com" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono Celular</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ej: 555-123-4567" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"/>
                                </div>
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {PLANS.map(plan => (
                               <button key={plan.id} onClick={() => setFormData(p => ({...p, plan: plan.id}))} className={`relative p-4 text-left border-2 rounded-lg transition-colors ${formData.plan === plan.id ? 'border-primary bg-primary/10' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}>
                                   <h4 className="font-bold text-white text-lg">{plan.name}</h4>
                                   <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
                                   {formData.plan === plan.id && <Icon name="CheckCircle" className="w-5 h-5 text-primary absolute top-3 right-3"/>}
                               </button>
                           ))}
                        </div>
                    )}
                    {step === 3 && (
                        <div className="text-center bg-gray-900 p-6 rounded-lg border border-gray-700">
                           <img src={photoPreview || `https://i.pravatar.cc/80?u=${formData.email}`} alt="avatar" className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary"/>
                           <h3 className="text-2xl font-bold text-white">{formData.name}</h3>
                           <p className="text-gray-400">{formData.email}</p>
                           <p className="text-gray-400 text-sm">{formData.phone}</p>
                           <span className={`mt-2 inline-block px-3 py-1 text-sm font-bold rounded-full ${planStyles[formData.plan]}`}>{formData.plan}</span>
                           <p className="text-gray-500 mt-4">Por favor, confirma que los detalles son correctos antes de finalizar el registro.</p>
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
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
                            Finalizar Registro
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
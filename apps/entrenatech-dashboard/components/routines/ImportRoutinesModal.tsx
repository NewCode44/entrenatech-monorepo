import React, { useState, DragEvent } from 'react';
import Modal from '@/ui/Modal';
import Icon from '@/ui/Icon';
import { Routine } from '@/types/index';
import { EXERCISE_DATABASE } from '../../constants';

interface ImportRoutinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (routines: Routine[]) => void;
}

const MOCK_IMPORTED_ROUTINES: Routine[] = [
    {
        id: `imported-${Date.now()}-1`,
        name: 'Rutina Importada de Espalda',
        description: 'Rutina de volumen para espalda, importada desde archivo JSON.',
        category: 'strength',
        difficulty: 4,
        duration: 60,
        assignedMembers: 0,
        exercises: EXERCISE_DATABASE.filter(e => [11, 12, 14, 15, 17])
    },
    {
        id: `imported-${Date.now()}-2`,
        name: 'Rutina Funcional Importada',
        description: 'Circuito funcional para todo el cuerpo, importado desde archivo JSON.',
        category: 'custom',
        difficulty: 3,
        duration: 40,
        assignedMembers: 0,
        exercises: EXERCISE_DATABASE.filter(e => [71, 72, 73, 74, 75])
    },
];

const ImportRoutinesModal: React.FC<ImportRoutinesModalProps> = ({ isOpen, onClose, onImport }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            setSelectedFile(files[0]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };
    
    const handleImportClick = () => {
        // En una aplicación real, aquí se procesaría el `selectedFile`.
        // Para esta demostración, simplemente usamos los datos de muestra.
        onImport(MOCK_IMPORTED_ROUTINES);
        setSelectedFile(null); // Reset after import
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Importar Rutinas desde Archivo">
            <div className="space-y-4">
                <p className="text-sm text-gray-400">
                    Sube un archivo JSON con el formato correcto para añadir nuevas rutinas a tu biblioteca de forma masiva.
                </p>
                
                <div 
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                        ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-gray-500'}`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                >
                    <Icon name="FileUp" className="w-12 h-12 mx-auto text-gray-500 mb-2"/>
                    <p className="text-white font-semibold">Arrastra y suelta un archivo aquí</p>
                    <p className="text-xs text-gray-500">o haz clic para seleccionar (solo .json)</p>
                    <input 
                        type="file" 
                        id="file-upload" 
                        className="hidden" 
                        accept=".json"
                        onChange={(e) => handleFileChange(e.target.files)}
                    />
                </div>

                {selectedFile && (
                    <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                        <Icon name="FileJson" className="w-8 h-8 text-primary"/>
                        <div>
                            <p className="text-sm font-semibold text-white">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                    </div>
                )}
                
                <div className="flex justify-end gap-4 pt-4">
                    <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-lg transition-colors">Cancelar</button>
                    <button 
                        onClick={handleImportClick}
                        disabled={!selectedFile}
                        className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Importar Rutinas
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ImportRoutinesModal;
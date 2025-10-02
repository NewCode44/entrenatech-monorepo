
import React, { useState } from 'react';
import { GymClass, Instructor, ClassCategory } from '@/types';
import { CLASSES_DATA, INSTRUCTORS_DATA, CLASS_CATEGORIES_DATA } from '../constants';
import Icon from '@/ui/Icon';
import AddClassModal from '../components/classes/AddClassModal';
import ClassDetailModal from '../components/classes/ClassDetailModal';

const Classes: React.FC = () => {
    const [classes, setClasses] = useState<GymClass[]>(CLASSES_DATA);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const getWeekDays = (date: Date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Monday as start of week
        return Array.from({ length: 7 }, (_, i) => {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            return day;
        });
    };

    const weekDays = getWeekDays(currentDate);

    const handlePrevWeek = () => setCurrentDate(d => { const newDate = new Date(d); newDate.setDate(d.getDate() - 7); return newDate; });
    const handleNextWeek = () => setCurrentDate(d => { const newDate = new Date(d); newDate.setDate(d.getDate() + 7); return newDate; });
    
    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':');
        const h = parseInt(hour);
        const suffix = h >= 12 ? 'PM' : 'AM';
        const formattedHour = ((h + 11) % 12 + 1);
        return `${formattedHour}:${minute} ${suffix}`;
    };
    
    const handleAddClass = (newClassData: Omit<GymClass, 'id'>) => {
        const newClass: GymClass = {
            ...newClassData,
            id: `class-${Date.now()}`,
        };
        setClasses(prev => [...prev, newClass]);
        setAddModalOpen(false);
    }
    
    const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => `${(i + 7).toString().padStart(2, '0')}:00`);

    return (
        <>
            <div className="space-y-8">
                {/* Header */}
                <div className="md:flex justify-between items-center bg-secondary p-8 rounded-xl border border-gray-800">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <Icon name="Calendar" className="w-10 h-10 text-primary"/>
                            <span className="gradient-text">Gestión de Clases</span>
                        </h1>
                        <p className="text-lg text-gray-500">
                            Visualiza, crea y administra el horario de clases de tu gimnasio.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                         <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <Icon name="Plus" className="w-4 h-4" />
                            Añadir Clase
                        </button>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-secondary rounded-xl border border-gray-800">
                    {/* Calendar Header */}
                    <div className="p-4 flex justify-between items-center border-b border-gray-800">
                        <button onClick={handlePrevWeek} className="p-2 rounded-lg hover:bg-gray-800"><Icon name="ArrowLeft" /></button>
                        <h2 className="text-lg font-bold text-white">
                            {weekDays[0].toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })} - {weekDays[6].toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </h2>
                        <button onClick={handleNextWeek} className="p-2 rounded-lg hover:bg-gray-800"><Icon name="ArrowRight" /></button>
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-8">
                        {/* Time Column */}
                        <div className="col-span-1 border-r border-gray-800">
                           <div className="h-16"></div> {/* Empty corner */}
                            {TIME_SLOTS.map(time => (
                                <div key={time} className="h-24 text-right pr-2 pt-1 text-xs text-gray-500 border-t border-gray-800">
                                    {formatTime(time)}
                                </div>
                            ))}
                        </div>
                        
                        {/* Day Columns */}
                        {weekDays.map((day, dayIndex) => (
                            <div key={day.toISOString()} className={`col-span-1 ${dayIndex < 6 ? 'border-r border-gray-800' : ''}`}>
                                <div className="h-16 flex flex-col items-center justify-center border-b border-gray-800">
                                    <p className="text-sm font-semibold">{day.toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                                    <p className="text-2xl font-bold">{day.getDate()}</p>
                                </div>
                                <div className="relative">
                                    {TIME_SLOTS.map(time => (
                                        <div key={time} className="h-24 border-t border-gray-800"></div>
                                    ))}
                                    {classes.filter(c => c.dayOfWeek === day.getDay()).map(gymClass => {
                                        const category = CLASS_CATEGORIES_DATA.find(c => c.id === gymClass.categoryId);
                                        const instructor = INSTRUCTORS_DATA.find(i => i.id === gymClass.instructorId);
                                        const top = (parseInt(gymClass.startTime.split(':')[0]) - 7) * 96 + (parseInt(gymClass.startTime.split(':')[1]) / 60) * 96;
                                        const height = (gymClass.duration / 60) * 96 - 4;

                                        return (
                                            <div
                                                key={gymClass.id}
                                                className={`absolute w-[95%] left-1/2 -translate-x-1/2 p-2 rounded-lg cursor-pointer ${category?.lightColor} border-l-4 ${category?.color.replace('text-', 'border-')}`}
                                                style={{ top: `${top}px`, height: `${height}px` }}
                                                onClick={() => setSelectedClass(gymClass)}
                                            >
                                                <p className={`font-bold text-sm ${category?.color}`}>{gymClass.name}</p>
                                                <p className="text-xs text-gray-400">{instructor?.name}</p>
                                                <p className="text-xs text-gray-500">{formatTime(gymClass.startTime)}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedClass && (
                <ClassDetailModal
                    isOpen={!!selectedClass}
                    onClose={() => setSelectedClass(null)}
                    gymClass={selectedClass}
                    instructor={INSTRUCTORS_DATA.find(i => i.id === selectedClass.instructorId)}
                    category={CLASS_CATEGORIES_DATA.find(c => c.id === selectedClass.categoryId)}
                />
            )}
            <AddClassModal 
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAddClass={handleAddClass}
            />
        </>
    );
};

export default Classes;

import React, { useState } from 'react';
import { PORTAL_TEMPLATES } from '../../constants';
import Icon from '@/ui/Icon';

const TemplateSelector: React.FC = () => {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(PORTAL_TEMPLATES[0].id);
    const [filter, setFilter] = useState('all');

    const filteredTemplates = filter === 'all'
      ? PORTAL_TEMPLATES
      : PORTAL_TEMPLATES.filter(t => t.category === filter);
    
    const TABS = ['all', 'premium', 'wellness', 'combat', 'functional'];

    return (
        <div className="bg-secondary p-6 rounded-xl border border-gray-800">
            {/* Header with Filters */}
            <div className="md:flex justify-between items-end mb-6 pb-6 border-b border-gray-800">
                <div>
                    <h2 className="text-2xl font-bold text-white">🎨 Elige tu Plantilla Premium</h2>
                    <p className="text-gray-500">Cada plantilla está optimizada con IA para máxima conversión.</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center bg-secondary-light p-1 rounded-lg border border-gray-800 space-x-1">
                    {TABS.map(tab => (
                         <button 
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === tab ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                           {tab.charAt(0).toUpperCase() + tab.slice(1)}
                         </button>
                    ))}
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTemplates.map(template => {
                    const isSelected = selectedTemplateId === template.id;
                    return (
                        <div
                            key={template.id}
                            onClick={() => setSelectedTemplateId(template.id)}
                            className={`relative cursor-pointer bg-secondary-light rounded-xl overflow-hidden border-2 transition-all duration-300 group ${isSelected ? 'border-primary shadow-glow' : 'border-gray-800 hover:border-primary hover:scale-105 hover:-translate-y-1'}`}
                        >
                           {template.badge && <div className="absolute top-4 left-4 z-10 text-xs bg-black/50 text-white px-2 py-1 rounded-full font-bold">{template.badge}</div>}
                           
                           {isSelected && <div className="absolute top-4 right-4 z-10 text-success"><Icon name="CheckCircle" className="w-6 h-6"/></div>}

                            {/* Preview Section */}
                            <div className={`h-48 p-4 relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${template.gradient}`}>
                               <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                    <div className="flex items-center gap-1 text-xs bg-black/30 text-white px-2 py-1 rounded-full"><Icon name="TrendingUp" className="w-3 h-3"/><span>{template.conversions}</span></div>
                                    <div className="flex items-center gap-1 text-xs bg-black/30 text-white px-2 py-1 rounded-full"><Icon name="Heart" className="w-3 h-3"/><span>{template.popularity}%</span></div>
                               </div>
                               <div className="text-6xl z-0 opacity-80">{template.icon}</div>
                            </div>
                            
                            {/* Info Section */}
                            <div className="p-6">
                                <h3 className="font-bold text-lg text-white">{template.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 h-10">{template.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {template.features.slice(0, 4).map(feature => (
                                        <span key={feature} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{feature}</span>
                                    ))}
                                </div>
                                
                                <div className="flex gap-3 mt-6">
                                    <button className="flex-1 w-full flex items-center justify-center gap-2 text-sm text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors"><Icon name="Eye" className="w-4 h-4" />Preview</button>
                                    <button className="flex-1 w-full flex items-center justify-center gap-2 text-sm text-white bg-primary hover:bg-primary-dark font-semibold py-2 px-4 rounded-lg transition-colors"><Icon name="Palette" className="w-4 h-4" />Personalizar</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default TemplateSelector;
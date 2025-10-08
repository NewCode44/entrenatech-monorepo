
import React, { useState } from 'react';
import Card from '@/ui/Card';
import AttendanceChart from '../components/dashboard/AttendanceChart';
import { DASHBOARD_STATS, QUICK_ACTIONS } from '../constants';
import Icon from '@/ui/Icon';
import { Page } from '@/types';

const StatsGrid: React.FC = () => (
    <Card>
        <div className="flex items-center gap-2 mb-4">
            <Icon name="BarChart3" className="text-primary w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Métricas Premium</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DASHBOARD_STATS.map((stat) => (
                <div key={stat.label} className="bg-secondary-light p-4 rounded-lg border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                         <p className="text-sm text-gray-500">{stat.label}</p>
                         <Icon name={stat.icon} className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className={`flex items-center text-sm font-semibold ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                        {stat.trend === 'up' ? <Icon name="ArrowUp" className="w-4 h-4 mr-1" /> : <Icon name="ArrowDown" className="w-4 h-4 mr-1" />}
                        <span>{stat.change}</span>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

const QuickActionsGrid: React.FC<{setCurrentPage: (page: Page) => void}> = ({setCurrentPage}) => (
    <Card>
        <div className="flex items-center gap-2 mb-6">
            <Icon name="Zap" className="text-accent w-6 h-6" />
            <h3 className="text-xl font-bold text-white">Herramientas Rápidas</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
            {QUICK_ACTIONS.map((action) => (
                 <button
                    key={action.title}
                    onClick={() => setCurrentPage(action.page)}
                    className={`relative text-left p-5 rounded-2xl overflow-hidden group transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r ${action.gradient} shadow-lg hover:shadow-xl`}
                >
                    {action.badge && (
                        <div className="absolute top-3 right-3 text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold shadow-md">{action.badge}</div>
                    )}
                    <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Icon name={action.icon} className="w-7 h-7 text-white" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-lg mb-0.5">{action.title}</p>
                            <p className="text-sm text-white/80">{action.description}</p>
                         </div>
                         <Icon name="ArrowRight" className="w-6 h-6 text-white/60 transform transition-transform group-hover:translate-x-1 flex-shrink-0" />
                    </div>
                </button>
            ))}
        </div>
    </Card>
);

interface DashboardProps {
    setCurrentPage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  return (
    <div className="space-y-8">
        {/* Hero Header */}
        <div className="text-center md:text-left md:flex justify-between items-center bg-secondary p-8 rounded-xl border border-gray-800">
          <div>
            <h1 className="text-4xl font-black mb-2">
              <span className="gradient-text">Dashboard Entrenatech</span>
              <span className="ml-2">🚀</span>
            </h1>
            <p className="text-lg text-gray-500">
              Gestiona tu imperio fitness con IA y tecnología premium.
            </p>
          </div>
           <div className="hidden md:flex items-center gap-4 mt-4 md:mt-0">
                <div className="flex items-center gap-2 text-sm bg-secondary-light px-3 py-2 rounded-full border border-gray-800">
                    <Icon name="TrendingUp" className="w-4 h-4 text-success" />
                    <span className="text-gray-400">Ingresos +23%</span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-secondary-light px-3 py-2 rounded-full border border-gray-800">
                    <Icon name="Users" className="w-4 h-4 text-primary" />
                    <span className="text-gray-400">1,247 Miembros</span>
                </div>
           </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-8">
                <StatsGrid />
                <Card>
                    <h3 className="text-xl font-bold mb-4 text-white">Check-ins de la Semana</h3>
                    <AttendanceChart />
                </Card>
            </div>
            <div className="lg:col-span-2">
                <QuickActionsGrid setCurrentPage={setCurrentPage}/>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
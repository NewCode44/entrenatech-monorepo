import React, { useState, useMemo } from 'react';
import Icon from '@/ui/Icon';
import StatsCard from '@/ui/StatsCard';

interface Nutritionist {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  certifications: string[];
  activeClients: number;
  totalRevenue: number;
  rating: number;
  status: 'active' | 'inactive';
  avatar?: string;
  joinedAt: string;
}

interface ClientAssignment {
  id: string;
  nutritionistId: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  plan: string;
  startDate: string;
  nextReview: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
}

const NutritionServices: React.FC = () => {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([
    {
      id: 'nut-1',
      name: 'Dra. Ana Martínez',
      email: 'ana.martinez@nutrifit.com',
      phone: '+34600123456',
      specialty: 'Deporte de Rendimiento',
      certifications: ['CNED', 'ISSA', 'NSCA'],
      activeClients: 15,
      totalRevenue: 2250,
      rating: 4.9,
      status: 'active',
      avatar: 'https://i.pravatar.cc/40?u=ana-martinez',
      joinedAt: '2024-01-15'
    },
    {
      id: 'nut-2',
      name: 'Dr. Carlos Rodríguez',
      email: 'carlos.rodriguez@nutrifit.com',
      phone: '+34600123457',
      specialty: 'Pérdida de Peso',
      certifications: ['ACSM', 'ACE'],
      activeClients: 12,
      totalRevenue: 1800,
      rating: 4.7,
      status: 'active',
      avatar: 'https://i.pravatar.cc/40?u=carlos-rodriguez',
      joinedAt: '2024-02-01'
    },
    {
      id: 'nut-3',
      name: 'Lic. Sofía García',
      email: 'sofia.garcia@nutrifit.com',
      phone: '+34600123458',
      specialty: 'Nutrición Clínica',
      certifications: ['COLNUT', 'ASPEN'],
      activeClients: 8,
      totalRevenue: 1200,
      rating: 4.8,
      status: 'active',
      avatar: 'https://i.pravatar.cc/40?u=sofia-garcia',
      joinedAt: '2024-03-10'
    }
  ]);

  const [assignments, setAssignments] = useState<ClientAssignment[]>([
    {
      id: 'assign-1',
      nutritionistId: 'nut-1',
      memberId: 'mem-1',
      memberName: 'Juan Pérez',
      memberEmail: 'juan.perez@fitlife.com',
      plan: 'Premium',
      startDate: '2024-10-01',
      nextReview: '2024-10-15',
      progress: 75,
      status: 'active'
    },
    {
      id: 'assign-2',
      nutritionistId: 'nut-1',
      memberId: 'mem-2',
      memberName: 'María García',
      memberEmail: 'maria.garcia@fitlife.com',
      plan: 'Premium',
      startDate: '2024-09-15',
      nextReview: '2024-10-15',
      progress: 60,
      status: 'active'
    },
    {
      id: 'assign-3',
      nutritionistId: 'nut-2',
      memberId: 'mem-3',
      memberName: 'Carlos López',
      memberEmail: 'carlos.lopez@fitlife.com',
      plan: 'Basic',
      startDate: '2024-10-05',
      nextReview: '2024-10-19',
      progress: 85,
      status: 'active'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'nutritionists' | 'assignments' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredNutritionists = useMemo(() => {
    return nutritionists.filter(nutritionist => {
      const matchesSearch = searchTerm === '' ||
        nutritionist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nutritionist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nutritionist.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || nutritionist.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [nutritionists, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const totalRevenue = nutritionists.reduce((sum, n) => sum + n.totalRevenue, 0);
    const totalClients = nutritionists.reduce((sum, n) => sum + n.activeClients, 0);
    const avgRating = nutritionists.length > 0
      ? nutritionists.reduce((sum, n) => sum + n.rating, 0) / nutritionists.length
      : 0;
    const activeNutritionists = nutritionists.filter(n => n.status === 'active').length;

    return {
      totalRevenue,
      totalClients,
      avgRating: avgRating.toFixed(1),
      activeNutritionists
    };
  }, [nutritionists]);

  const handleAddNutritionist = () => {
    console.log('Añadir nuevo nutriólogo');
    // TODO: Implementar modal para añadir nutriólogo
  };

  const handleAssignClient = (nutritionistId: string) => {
    console.log('Asignar cliente a nutriólogo:', nutritionistId);
    // TODO: Implementar modal de asignación
  };

  const handleViewNutritionist = (nutritionistId: string) => {
    console.log('Ver detalles del nutriólogo:', nutritionistId);
    // TODO: Implementar modal de detalles
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex justify-between items-center bg-secondary p-8 rounded-xl border border-gray-800">
        <div>
          <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
            <Icon name="Apple" className="w-10 h-10 text-primary"/>
            <span className="gradient-text">Servicios de Nutrición</span>
          </h1>
          <p className="text-lg text-gray-500">
            Gestiona nutriólogos, asigna clientes y ofrece planes nutricionales personalizados.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            onClick={handleAddNutritionist}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Icon name="UserPlus" className="w-4 h-4" />
            Contratar Nutriólogo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Ingresos Mensuales"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="DollarSign"
          change="+12%"
        />
        <StatsCard
          title="Clientes Activos"
          value={stats.totalClients.toString()}
          icon="Users"
          change="+8%"
        />
        <StatsCard
          title="Nutriólogos Activos"
          value={stats.activeNutritionists.toString()}
          icon="UserCheck"
          change="+1"
        />
        <StatsCard
          title="Rating Promedio"
          value={`⭐ ${stats.avgRating}`}
          icon="Star"
          change="+0.2"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-secondary p-6 rounded-xl border border-gray-800">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-700">
          {[
            { id: 'overview', label: 'Resumen', icon: 'LayoutDashboard' },
            { id: 'nutritionists', label: 'Nutriólogos', icon: 'Users' },
            { id: 'assignments', label: 'Asignaciones', icon: 'UserCheck' },
            { id: 'analytics', label: 'Análisis', icon: 'BarChart3' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                  <Icon name="Zap" className="w-5 h-5 text-yellow-400" />
                  Acciones Rápidas
                </h3>
                <div className="space-y-3">
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                    <Icon name="UserPlus" className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-gray-300">Asignar cliente a nutriólogo</span>
                  </button>
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                    <Icon name="FileText" className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Generar reporte mensual</span>
                  </button>
                  <button className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                    <Icon name="Calendar" className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-300">Programar revisiones</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                  <Icon name="TrendingUp" className="w-5 h-5 text-green-400" />
                  Métricas Clave
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Tasa de conversión</span>
                    <span className="text-sm font-semibold text-green-400">+23%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Satisfacción del cliente</span>
                    <span className="text-sm font-semibold text-cyan-400">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Planes activos</span>
                    <span className="text-sm font-semibold text-yellow-400">27</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Ingresos por cliente</span>
                    <span className="text-sm font-semibold text-purple-400">$150/mes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Actividad Reciente</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">Nuevo plan asignado</p>
                      <p className="text-xs text-gray-400">Juan Pérez → Dra. Ana Martínez</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Hace 2 horas</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">Revisión completada</p>
                      <p className="text-xs text-gray-400">María García - 85% progreso</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Hace 5 horas</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-white">Meta alcanzada</p>
                      <p className="text-xs text-gray-400">Carlos López - 10kg perdidos</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Ayer</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutritionists' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-auto">
                <Icon name="Search" className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                <input
                  type="text"
                  placeholder="Buscar nutriólogo..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                >
                  <option value="all">Todo Estado</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>

            {/* Nutritionists Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNutritionists.map(nutritionist => (
                <div key={nutritionist.id} className="rounded-xl border border-gray-700 bg-gray-900/50 p-6 hover:border-gray-600 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={nutritionist.avatar}
                        alt={nutritionist.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-white">{nutritionist.name}</h3>
                        <p className="text-xs text-gray-400">{nutritionist.specialty}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-xs text-gray-400">{nutritionist.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      nutritionist.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {nutritionist.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-gray-300">{nutritionist.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Clientes:</span>
                      <span className="text-gray-300">{nutritionist.activeClients}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ingresos:</span>
                      <span className="text-gray-300">${nutritionist.totalRevenue}/mes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Certificaciones:</span>
                      <span className="text-gray-300 text-right">
                        {nutritionist.certifications.slice(0, 2).join(', ')}
                        {nutritionist.certifications.length > 2 && '...'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => handleViewNutritionist(nutritionist.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-xs py-2 rounded-lg transition-colors"
                    >
                      <Icon name="Eye" className="w-3 h-3" />
                      Ver
                    </button>
                    <button
                      onClick={() => handleAssignClient(nutritionist.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-primary hover:bg-primary-dark text-white text-xs py-2 rounded-lg transition-colors"
                    >
                      <Icon name="UserPlus" className="w-3 h-3" />
                      Asignar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            {/* Assignments Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3">Miembro</th>
                    <th scope="col" className="px-6 py-3">Nutriólogo</th>
                    <th scope="col" className="px-6 py-3">Plan</th>
                    <th scope="col" className="px-6 py-3">Progreso</th>
                    <th scope="col" className="px-6 py-3">Próxima Revisión</th>
                    <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => {
                    const nutritionist = nutritionists.find(n => n.id === assignment.nutritionistId);
                    return (
                      <tr key={assignment.id} className="bg-secondary border-b border-gray-800 hover:bg-gray-900">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-white">{assignment.memberName}</div>
                            <div className="text-xs text-gray-500">{assignment.memberEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{nutritionist?.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-400">
                            {assignment.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: `${assignment.progress}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{assignment.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">{assignment.nextReview}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg">
                            <Icon name="MoreVertical" className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Distribución de Clientes</h3>
                <div className="space-y-3">
                  {nutritionists.map(nutritionist => (
                    <div key={nutritionist.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{nutritionist.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 bg-primary rounded-full"
                            style={{ width: `${(nutritionist.activeClients / Math.max(...nutritionists.map(n => n.activeClients))) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{nutritionist.activeClients}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Ingresos por Nutriólogo</h3>
                <div className="space-y-3">
                  {nutritionists.map(nutritionist => (
                    <div key={nutritionist.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{nutritionist.name}</span>
                      <span className="text-sm font-semibold text-green-400">${nutritionist.totalRevenue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionServices;
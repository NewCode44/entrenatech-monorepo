import React, { useState, useMemo, useEffect } from 'react';
import { Member } from '@/types';
import Icon from '@/ui/Icon';
import StatsCard from '@/ui/StatsCard';
import AddMemberModal from '../components/members/AddMemberModal';
import { useCollection } from '@/hooks';
import { doc, updateDoc, deleteDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';

const statusStyles: { [key in Member['status']]: string } = {
    active: 'bg-green-500/20 text-green-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    suspended: 'bg-orange-500/20 text-orange-400',
};

const planStyles: { [key in Member['plan']]: string } = {
    basic: 'bg-gray-700 text-gray-300',
    premium: 'bg-blue-500/20 text-blue-400 border border-blue-500/50',
    vip: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
};

const Members: React.FC = () => {
    const { data: rawMembers, loading } = useCollection('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const itemsPerPage = 8;

    const members: Member[] = useMemo(() => {
        return rawMembers.map((doc: any) => ({
            id: doc.id,
            name: `${doc.firstName || ''} ${doc.lastName || ''}`.trim() || 'Sin Nombre',
            email: doc.email || '',
            phone: doc.phoneNumber || '',
            avatar: doc.profileImage || `https://i.pravatar.cc/40?u=${doc.id}`,
            status: (doc.membershipStatus as Member['status']) || 'inactive',
            plan: (doc.currentPlan as Member['plan']) || 'basic',
            joinDate: doc.createdAt?.toDate ? doc.createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));
    }, [rawMembers]);

    const handleAddNewMember = async (newMemberData: Omit<Member, 'id' | 'joinDate'>) => {
        try {
            // Split name into first and last name roughly
            const nameParts = newMemberData.name.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');

            await addDoc(collection(db, 'users'), {
                firstName,
                lastName,
                email: newMemberData.email,
                phoneNumber: newMemberData.phone,
                profileImage: newMemberData.avatar,
                membershipStatus: newMemberData.status,
                currentPlan: newMemberData.plan,
                role: 'member',
                createdAt: serverTimestamp()
            });
            setAddModalOpen(false);
        } catch (error) {
            console.error("Error adding member: ", error);
            alert("Error al agregar miembro");
        }
    };

    const handleViewMember = (memberId: string) => {
        console.log('Ver miembro:', memberId);
        // TODO: Abrir modal de detalles del miembro
        setActiveDropdown(null);
    };

    const handleEditMember = (memberId: string) => {
        console.log('Editar miembro:', memberId);
        // TODO: Abrir modal de edición del miembro
        setActiveDropdown(null);
    };

    const handleSendMessage = (memberId: string) => {
        console.log('Enviar mensaje a miembro:', memberId);
        // TODO: Abrir modal de envío de mensaje
        setActiveDropdown(null);
    };

    const handleSuspendMember = async (memberId: string) => {
        try {
            const member = members.find(m => m.id === memberId);
            const newStatus = member?.status === 'suspended' ? 'active' : 'suspended';
            await updateDoc(doc(db, 'users', memberId), {
                membershipStatus: newStatus
            });
            setActiveDropdown(null);
        } catch (error) {
            console.error("Error updating member status: ", error);
            alert("Error al actualizar estado");
        }
    };

    const handleDeleteMember = async (memberId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este miembro?')) {
            try {
                await deleteDoc(doc(db, 'users', memberId));
                setActiveDropdown(null);
            } catch (error) {
                console.error("Error deleting member: ", error);
                alert("Error al eliminar miembro");
            }
        }
    };

    const toggleDropdown = (memberId: string) => {
        setActiveDropdown(activeDropdown === memberId ? null : memberId);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown) {
                const target = event.target as HTMLElement;
                if (!target.closest('.dropdown-menu')) {
                    setActiveDropdown(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

    const filteredMembers = useMemo(() => {
        return members
            .filter(member => statusFilter === 'all' || member.status === statusFilter)
            .filter(member => planFilter === 'all' || member.plan === planFilter)
            .filter(member => {
                const search = searchTerm.toLowerCase();
                return (
                    member.name.toLowerCase().includes(search) ||
                    member.email.toLowerCase().includes(search) ||
                    member.phone.toLowerCase().includes(search)
                );
            });
    }, [searchTerm, statusFilter, planFilter, members]);

    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-white">Cargando miembros...</div>;
    }

    return (
        <>
            <div className="space-y-8">
                {/* Header Premium */}
                <div className="md:flex justify-between items-center bg-secondary p-8 rounded-xl border border-gray-800">
                    <div>
                        <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
                            <Icon name="Users" className="w-10 h-10 text-primary" />
                            <span className="gradient-text">Gestión de Miembros</span>
                        </h1>
                        <p className="text-lg text-gray-500">
                            Administra, filtra y contacta a todos los miembros de tu comunidad.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            <Icon name="UserPlus" className="w-4 h-4" />
                            Añadir Miembro
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Miembros" value={members.length.toString()} icon="Users" />
                    <StatsCard title="Miembros Activos" value={members.filter(m => m.status === 'active').length.toString()} icon="Zap" />
                    <StatsCard title="Nuevos este Mes" value="12" change="+3" icon="TrendingUp" />
                    <StatsCard title="Tasa de Retención" value="92%" change="+1.5%" icon="Heart" />
                </div>

                {/* Table and Filters */}
                <div className="bg-secondary p-6 rounded-xl border border-gray-800">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                        <div className="relative w-full md:w-auto">
                            <Icon name="Search" className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar miembro..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full md:w-64 bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-primary focus:border-primary"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                            >
                                <option value="all">Todo Estado</option>
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="suspended">Suspendido</option>
                            </select>
                            <select
                                value={planFilter}
                                onChange={e => setPlanFilter(e.target.value)}
                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-primary focus:border-primary"
                            >
                                <option value="all">Todo Plan</option>
                                <option value="basic">Básico</option>
                                <option value="premium">Premium</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-900">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Miembro</th>
                                    <th scope="col" className="px-6 py-3">Estado</th>
                                    <th scope="col" className="px-6 py-3">Plan</th>
                                    <th scope="col" className="px-6 py-3">Fecha de Ingreso</th>
                                    <th scope="col" className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedMembers.map(member => (
                                    <tr key={member.id} className="bg-secondary border-b border-gray-800 hover:bg-gray-900">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <div className="font-semibold text-white">{member.name}</div>
                                                    <div className="text-gray-500 text-xs">{member.email}</div>
                                                    <div className="text-gray-500 text-xs">{member.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusStyles[member.status]}`}>{member.status}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${planStyles[member.plan]}`}>{member.plan}</span>
                                        </td>
                                        <td className="px-6 py-4">{member.joinDate}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="relative dropdown-menu">
                                                <button
                                                    onClick={() => toggleDropdown(member.id)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
                                                >
                                                    <Icon name="MoreVertical" className="w-5 h-5" />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {activeDropdown === member.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleViewMember(member.id)}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
                                                            >
                                                                <Icon name="Eye" className="w-4 h-4" />
                                                                Ver Detalles
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditMember(member.id)}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
                                                            >
                                                                <Icon name="Edit" className="w-4 h-4" />
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendMessage(member.id)}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center gap-2"
                                                            >
                                                                <Icon name="Mail" className="w-4 h-4" />
                                                                Enviar Mensaje
                                                            </button>
                                                            {member.status !== 'suspended' ? (
                                                                <button
                                                                    onClick={() => handleSuspendMember(member.id)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 hover:text-yellow-300 flex items-center gap-2"
                                                                >
                                                                    <Icon name="AlertCircle" className="w-4 h-4" />
                                                                    Suspender
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleSuspendMember(member.id)}
                                                                    className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 hover:text-green-300 flex items-center gap-2"
                                                                >
                                                                    <Icon name="CheckCircle" className="w-4 h-4" />
                                                                    Reactivar
                                                                </button>
                                                            )}
                                                            <hr className="my-1 border-gray-700" />
                                                            <button
                                                                onClick={() => handleDeleteMember(member.id)}
                                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center gap-2"
                                                            >
                                                                <Icon name="Trash2" className="w-4 h-4" />
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center pt-4">
                        <span className="text-sm text-gray-500">
                            Página {currentPage} de {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <AddMemberModal
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAddMember={handleAddNewMember}
            />
        </>
    );
};

export default Members;
import React, { useState, useEffect, useCallback } from 'react';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, updateDoc, query } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { Users, Trash2, CheckCircle, Clock, PawPrint } from 'lucide-react';


// Variables globales proporcionadas por el entorno de Canvas (MANDATORIO USAR)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Colores temáticos
const colorPrimary = "bg-[#2E7D32]"; // Verde Oscuro
const colorAccent = "bg-[#FF7A47]"; // Naranja

// Estados de la solicitud
const ESTATUS = {
    PENDIENTE: 'Pendiente',
    CONTACTADO: 'Contactado',
    RECHAZADO: 'Rechazado',
};

// Componente principal del Panel de Administración
const AdminPanel = () => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [volunteers, setVolunteers] = useState([]);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('voluntarios'); // 'voluntarios' o 'animales'

    // 1. Inicialización de Firebase y Autenticación
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const firestoreDb = getFirestore(app);
            const authService = getAuth(app);
            setDb(firestoreDb);
            setAuth(authService);

            const unsubscribe = onAuthStateChanged(authService, async (user) => {
                if (!user) {
                    // Intento de inicio de sesión con token personalizado o anónimo
                    if (initialAuthToken) {
                        await signInWithCustomToken(authService, initialAuthToken);
                    } else {
                        await signInAnonymously(authService);
                    }
                }
                setCurrentUser(authService.currentUser);
                setIsAuthReady(true);
            });

            return () => unsubscribe();
        } catch (e) {
            console.error("Error initializing Firebase:", e);
            setError("Error al inicializar la base de datos.");
            setIsAuthReady(true);
        }
    }, []);

    // 2. Lógica para leer las solicitudes de voluntariado (Firestore Snapshot)
    useEffect(() => {
        if (!isAuthReady || !db || activeTab !== 'voluntarios') return;

        setLoading(true);
        setError('');

        const collectionPath = `artifacts/${appId}/public/data/volunteers`;
        const q = query(collection(db, collectionPath));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const volunteersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate().toLocaleString() || 'N/A'
            }));
            // Ordenar de más reciente a más antiguo
            volunteersData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setVolunteers(volunteersData);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching volunteers:", err);
            setError("No se pudieron cargar las solicitudes de voluntarios.");
            setLoading(false);
        });

        // Limpieza del listener
        return () => unsubscribe();
    }, [db, isAuthReady, activeTab]);

    // Función para actualizar el estado de una solicitud
    const handleUpdateStatus = useCallback(async (id, newStatus) => {
        if (!db) return;
        const collectionPath = `artifacts/${appId}/public/data/volunteers`;
        const volunteerRef = doc(db, collectionPath, id);
        
        try {
            await updateDoc(volunteerRef, {
                status: newStatus,
                updatedAt: new Date(),
            });
            // La actualización en el estado se maneja automáticamente por onSnapshot
        } catch (e) {
            console.error("Error updating status:", e);
            setError("Error al actualizar el estado de la solicitud.");
        }
    }, [db]);

    // Función para eliminar una solicitud
    const handleDeleteVolunteer = useCallback(async (id) => {
        if (!db) return;
        
        // Uso de modal de confirmación simulado (No usar window.confirm)
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta solicitud?")) {
            return;
        }

        const collectionPath = `artifacts/${appId}/public/data/volunteers`;
        const volunteerRef = doc(db, collectionPath, id);
        
        try {
            await deleteDoc(volunteerRef);
            // La eliminación se maneja automáticamente por onSnapshot
        } catch (e) {
            console.error("Error deleting document:", e);
            setError("Error al eliminar la solicitud.");
        }
    }, [db]);

    // Renderizado del Estatus de Solicitud
    const StatusBadge = ({ status }) => {
        let colorClass = '';
        let icon = null;
        switch (status) {
            case ESTATUS.CONTACTADO:
                colorClass = 'bg-green-100 text-green-800';
                icon = <CheckCircle className="w-4 h-4 mr-1" />;
                break;
            case ESTATUS.RECHAZADO:
                colorClass = 'bg-red-100 text-red-800';
                icon = <Trash2 className="w-4 h-4 mr-1" />;
                break;
            case ESTATUS.PENDIENTE:
            default:
                colorClass = 'bg-yellow-100 text-yellow-800';
                icon = <Clock className="w-4 h-4 mr-1" />;
        }
        return (
            <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${colorClass}`}>
                {icon}
                {status}
            </span>
        );
    };

    // Renderizado de las Tarjetas de Solicitudes
    const VolunteerList = () => {
        if (loading) {
            return <p className="text-center text-gray-500 py-12">Cargando solicitudes...</p>;
        }
        if (error) {
            return <p className="text-center text-red-600 py-12">Error: {error}</p>;
        }
        if (volunteers.length === 0) {
            return <p className="text-center text-gray-500 py-12">No hay solicitudes de voluntarios pendientes.</p>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {volunteers.map((v) => (
                    <div key={v.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-[#FF7A47]"/>
                                    {v.name}
                                </h3>
                                <StatusBadge status={v.status} />
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold">Email:</span> {v.email}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-semibold">WhatsApp:</span> {v.phone}
                            </p>
                            <p className="text-sm text-gray-600 mb-4">
                                <span className="font-semibold">Área de Ayuda:</span> {v.interest}
                            </p>
                            <p className="text-xs text-gray-500 mb-4 italic">
                                Recibido: {v.timestamp}
                            </p>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                            <button
                                onClick={() => handleUpdateStatus(v.id, ESTATUS.CONTACTADO)}
                                className="flex-1 min-w-[100px] text-sm py-2 px-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full transition"
                                disabled={v.status === ESTATUS.CONTACTADO}
                            >
                                Contactado
                            </button>
                            <button
                                onClick={() => handleUpdateStatus(v.id, ESTATUS.PENDIENTE)}
                                className="flex-1 min-w-[100px] text-sm py-2 px-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-full transition"
                                disabled={v.status === ESTATUS.PENDIENTE}
                            >
                                Poner Pendiente
                            </button>
                            <button
                                onClick={() => handleDeleteVolunteer(v.id)}
                                className="w-full text-sm py-2 px-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-full transition mt-2"
                            >
                                <Trash2 className="w-4 h-4 inline mr-1"/>
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    
    // Placeholder para la gestión de animales (futura implementación)
    const AnimalManagement = () => (
        <div className="text-center py-20 bg-white p-10 rounded-xl shadow-lg">
            <PawPrint className="w-12 h-12 mx-auto text-[#2E7D32] mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Gestión de Animales</h3>
            <p className="text-gray-500 mb-6">Esta sección se utilizará para agregar, editar y eliminar animales disponibles para adopción.</p>
            <button className={`${colorPrimary} text-white font-semibold py-3 px-6 rounded-full shadow-md hover:bg-green-700 transition`}>
                Añadir Nuevo Animal
            </button>
        </div>
    );

    // Renderizado principal
    return (
        <div className="min-h-screen bg-gray-100 p-8 sm:p-12">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Panel de Administración
                </h1>
                <p className="text-lg text-gray-500 mt-2">
                    Bienvenido, {currentUser ? currentUser.uid : 'Cargando Usuario'} <span className="text-sm">(ID de App: {appId})</span>
                </p>
            </header>

            {/* Navegación por Pestañas */}
            <div className="flex justify-center mb-8 space-x-4">
                <button
                    onClick={() => setActiveTab('voluntarios')}
                    className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition ${
                        activeTab === 'voluntarios' 
                            ? 'bg-white text-[#FF7A47] border-b-4 border-[#FF7A47] shadow-md' 
                            : 'text-gray-600 hover:text-[#FF7A47]'
                    }`}
                >
                    <Users className="w-5 h-5 inline mr-2"/> Solicitudes de Voluntariado
                </button>
                <button
                    onClick={() => setActiveTab('animales')}
                    className={`px-6 py-3 text-lg font-semibold rounded-t-lg transition ${
                        activeTab === 'animales' 
                            ? 'bg-white text-[#2E7D32] border-b-4 border-[#2E7D32] shadow-md' 
                            : 'text-gray-600 hover:text-[#2E7D32]'
                    }`}
                >
                    <PawPrint className="w-5 h-5 inline mr-2"/> Gestión de Animales
                </button>
            </div>

            <main className="max-w-7xl mx-auto">
                {activeTab === 'voluntarios' && (
                    <div className="bg-white p-6 sm:p-8 rounded-b-xl rounded-tr-xl shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
                            Voluntarios Recibidos ({volunteers.length})
                        </h2>
                        <VolunteerList />
                    </div>
                )}

                {activeTab === 'animales' && (
                    <div className="bg-white p-6 sm:p-8 rounded-b-xl rounded-tr-xl shadow-2xl">
                        <AnimalManagement />
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPanel;

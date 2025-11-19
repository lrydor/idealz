import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ element, allowedRoles }) {
  const { user, role, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#efebe9] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-[#5d4037] mb-4">Cargando...</div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-[#efebe9] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-[#5d4037] mb-4">
            Acceso Denegado
          </h1>
          <p className="text-lg text-[#6d4c41] mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-[#8d6e63] mb-6">
            Esta área está reservada para administradores.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#6d4c41] hover:bg-[#5d4037] text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  
  return element;
}

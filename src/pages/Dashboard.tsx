import React from 'react';
import Layout from '../components/Layout';
import { useAuthStore } from '../store/auth';

function Dashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <Layout>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Tableau de bord
        </h1>
        <div className="bg-gray-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            Bienvenue, {user?.name}!
          </h2>
          <p className="text-gray-600">
            {user?.role === 'admin' 
              ? "Gérez vos employés et leurs tâches depuis votre espace administrateur."
              : "Consultez et gérez vos tâches assignées."}
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
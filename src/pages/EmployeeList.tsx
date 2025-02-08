import Layout from '../components/Layout';
import { Users, Plus, Pencil, Trash2 } from 'lucide-react';
import EmployeeForm from '../components/EmployeeForm';
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import {useEffect, useState} from 'react';
import config from '../config';

interface Employee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

function EmployeeList() {
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Transformer les _id en id pour la cohérence
      const transformedEmployees = response.data.map((emp: any) => ({
        ...emp,
        id: emp._id,
      }));
      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (data: any) => {
    try {
      await axios.post(`${config.apiUrl}/api/employees`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setShowForm(false);
      await fetchEmployees();
    } catch (error) {
      console.error('Erreur lors de la création de l\'employé:', error);
      alert('Erreur lors de la création de l\'employé. Veuillez réessayer.');
    }
  };

  const handleUpdateEmployee = async (data: any) => {
    if (!selectedEmployee) return;

    try {
      await axios.put(`${config.apiUrl}/api/employees/${selectedEmployee.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setShowForm(false);
      setSelectedEmployee(null);
      await fetchEmployees();
    } catch (error) {
      console.error('Erreur lors de la modification de l\'employé:', error);
      alert('Erreur lors de la modification de l\'employé. Veuillez réessayer.');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await axios.delete(`${config.apiUrl}/api/employees/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchEmployees();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'employé:', error);
        alert('Erreur lors de la suppression de l\'employé. Veuillez réessayer.');
      }
    }
  };

  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  return (
      <Layout>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Gestion des Employés
              </h1>
            </div>
            <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un employé
            </button>
          </div>

          {loading ? (
              <div className="text-center py-4">Chargement...</div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {employees.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                          Aucun employé trouvé
                        </td>
                      </tr>
                  ) : (
                      employees.map((employee) => (
                          <tr key={employee.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {employee.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {employee.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(employee.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEditClick(employee)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                  <Pencil className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                      ))
                  )}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {showForm && (
            <EmployeeForm
                onClose={() => {
                  setShowForm(false);
                  setSelectedEmployee(null);
                }}
                onSubmit={selectedEmployee ? handleUpdateEmployee : handleCreateEmployee}
                employee={selectedEmployee || undefined}
            />
        )}
      </Layout>
  );
}

export default EmployeeList;
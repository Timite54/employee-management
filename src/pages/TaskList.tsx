import Layout from '../components/Layout';
import { CheckSquare, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import TaskForm from '../components/TaskForm';
import axios from 'axios';
import config from '../config';
import {useEffect, useState} from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface Employee {
  id: string;
  name: string;
}

function TaskList() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isAdmin = user?.role === 'admin';
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    if (isAdmin) {
      fetchEmployees();
    }
  }, [isAdmin]);

  const fetchTasks = async () => {
    try {
      const url = isAdmin
          ? `${config.apiUrl}/api/tasks`
          : `${config.apiUrl}/api/tasks/employee/${user?.id}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Transformer les _id en id pour la cohérence
      const transformedTasks = response.data.map((task: any) => ({
        ...task,
        id: task._id,
        assignedTo: {
          id: task.assignedTo._id,
          name: task.assignedTo.name,
        },
      }));
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Transformer les _id en id pour la cohérence
      const transformedEmployees = response.data.map((emp: any) => ({
        id: emp._id,
        name: emp.name,
      }));
      setEmployees(transformedEmployees);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
    }
  };

  const handleCreateTask = async (data: any) => {
    try {
      await axios.post('`${config.apiUrl}/api/tasks`', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setShowForm(false);
      await fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      alert('Erreur lors de la création de la tâche. Veuillez réessayer.');
    }
  };

  const handleUpdateTask = async (data: any) => {
    if (!selectedTask) return;

    try {
      await axios.put(`${config.apiUrl}/api/tasks/${selectedTask.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setShowForm(false);
      setSelectedTask(null);
      await fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la modification de la tâche:', error);
      alert('Erreur lors de la modification de la tâche. Veuillez réessayer.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await axios.delete(`${config.apiUrl}/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchTasks();
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
        alert('Erreur lors de la suppression de la tâche. Veuillez réessayer.');
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: Task['status']) => {
    try {
      await axios.patch(`${config.apiUrl}/api/tasks/${id}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
      );
      await fetchTasks();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    }
  };

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  return (
      <Layout>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <CheckSquare className="h-6 w-6 text-indigo-600 mr-2" />
              <h1 className="text-2xl font-semibold text-gray-900">
                {isAdmin ? 'Gestion des Tâches' : 'Mes Tâches'}
              </h1>
            </div>
            {isAdmin && (
                <button
                    onClick={() => {
                      setSelectedTask(null);
                      setShowForm(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Assigner une tâche
                </button>
            )}
          </div>

          {loading ? (
              <div className="text-center py-4">Chargement...</div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    {isAdmin && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigné à
                        </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.length === 0 ? (
                      <tr>
                        <td
                            colSpan={isAdmin ? 5 : 4}
                            className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          Aucune tâche trouvée
                        </td>
                      </tr>
                  ) : (
                      tasks.map((task) => (
                          <tr key={task.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {task.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {task.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <select
                                  value={task.status}
                                  onChange={(e) =>
                                      handleUpdateStatus(task.id, e.target.value as Task['status'])
                                  }
                                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                              >
                                <option value="pending">À faire</option>
                                <option value="in_progress">En cours</option>
                                <option value="completed">Terminé</option>
                              </select>
                            </td>
                            {isAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {task.assignedTo.name}
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                {isAdmin && (
                                    <>
                                      <button
                                          onClick={() => handleEditClick(task)}
                                          className="text-indigo-600 hover:text-indigo-900"
                                      >
                                        <Pencil className="h-5 w-5" />
                                      </button>
                                      <button
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="text-red-600 hover:text-red-900"
                                      >
                                        <Trash2 className="h-5 w-5" />
                                      </button>
                                    </>
                                )}
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
            <TaskForm
                onClose={() => {
                  setShowForm(false);
                  setSelectedTask(null);
                }}
                onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
                employees={employees}
                task={selectedTask || undefined}
            />
        )}
      </Layout>
  );
}

export default TaskList;
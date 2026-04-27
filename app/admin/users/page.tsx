'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../../lib/api';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadUsers();
  }, []);

  const loadUsers = () => {
    API.get('/users')
      .then((res) => setUsers(
        Array.isArray(res.data) ? res.data : []));
  };

  const changeRole = async (
    userId: number, 
    newRole: string
  ) => {
    try {
      await API.put(`/users/${userId}`, 
        { role: newRole });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('Supprimer cet utilisateur ?')) 
      return;
    try {
      await API.delete(`/users/${userId}`);
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-600 text-white 
        px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Admin — Utilisateurs
        </h1>
        <a href="/admin"
          className="text-white hover:underline">
          ← Retour Admin
        </a>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold 
          text-gray-800 mb-6">
          👥 Gestion des utilisateurs
        </h2>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 
                border-b">
                <th className="p-4 text-left 
                  text-gray-700">ID</th>
                <th className="p-4 text-left 
                  text-gray-700">Nom</th>
                <th className="p-4 text-left 
                  text-gray-700">Email</th>
                <th className="p-4 text-left 
                  text-gray-700">Rôle</th>
                <th className="p-4 text-left 
                  text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id}
                  className="border-b 
                    hover:bg-gray-50">
                  <td className="p-4 
                    text-gray-600">
                    {user.id}
                  </td>
                  <td className="p-4 
                    text-gray-800 font-semibold">
                    {user.prenom} {user.nom}
                  </td>
                  <td className="p-4 
                    text-gray-600">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(
                        user.id, e.target.value)}
                      className="border rounded 
                        p-1 text-gray-900 text-sm">
                      <option value="STUDENT">
                        STUDENT
                      </option>
                      <option value="INSTRUCTOR">
                        INSTRUCTOR
                      </option>
                      <option value="ADMIN">
                        ADMIN
                      </option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => 
                        deleteUser(user.id)}
                      className="bg-red-500 
                        text-white px-3 py-1 
                        rounded hover:bg-red-600 
                        text-sm">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
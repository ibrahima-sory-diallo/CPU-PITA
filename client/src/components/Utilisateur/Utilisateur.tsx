import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  pseudo: string;
  email: string;
  role: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    password: '',
    role: 'utilisateur',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [, setSuccess] = useState(false);

  // 🔄 Charger la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/listeUser`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setFormData({ pseudo: '', email: '', password: '', role: 'utilisateur' });
        setShowModal(false);
        fetchUsers();
      } else {
        setErrors(data.errors || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Gestion des utilisateurs</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800"
        >
          Ajouter un utilisateur
        </button>
      </div>

      <table className="w-full table-auto border border-gray-300 shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Pseudo</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center hover:bg-gray-50">
              <td className="border p-2">{user.pseudo}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal d'ajout */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Créer un utilisateur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Pseudo</label>
                <input
                  type="text"
                  name="pseudo"
                  value={formData.pseudo}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
                {errors.pseudo && <p className="text-red-500 text-sm">{errors.pseudo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium">Rôle</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="utilisateur">Utilisateur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-800"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

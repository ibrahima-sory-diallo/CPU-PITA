import React, { useState } from 'react';

export const SendEmailForm: React.FC = () => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    html: ''
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/email/send-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ Email envoyé avec succès !');
        setFormData({ to: '', subject: '', html: '' });
      } else {
        setMessage(`❌ Erreur : ${data.error || 'Échec de l’envoi.'}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur : ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Envoyer un Email</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Destinataire</label>
          <input
            type="email"
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="exemple@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sujet</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Objet de l’email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contenu HTML</label>
          <textarea
            name="html"
            value={formData.html}
            onChange={handleChange}
            required
            rows={6}
            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="<h1>Bienvenue !</h1>"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer l’email'}
        </button>
        {message && (
          <div className="text-center text-sm font-medium mt-4 text-gray-700">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

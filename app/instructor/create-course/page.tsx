'use client';
import { useState } from 'react';
import API from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const router = useRouter();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [niveau, setNiveau] = useState('DEBUTANT');
  const [categorie, setCategorie] = useState('');  // ✅ nouveau
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = async () => {
    try {
      await API.post('/courses', {
        titre,
        description,
        niveau,
        categorie,  // ✅ envoyé au backend
      });
      setSuccess('Cours créé avec succès !');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) {
      setError('Erreur lors de la création du cours');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Navbar */}
      <nav style={{
        background: '#0f1629', padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#3b82f6',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 'bold', color: 'white'
          }}>E</div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>eLearning</span>
        </div>
        <a href="/dashboard" style={{
          color: '#94a3b8', textDecoration: 'none', fontSize: '14px',
          fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px'
        }}>← Retour au dashboard</a>
      </nav>

      {/* Contenu */}
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
          Créer un nouveau cours
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>
          Remplissez les informations de votre cours
        </p>

        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '32px', border: '1px solid #f1f5f9',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', padding: '12px', borderRadius: '10px',
              fontSize: '14px', marginBottom: '20px'
            }}>⚠️ {error}</div>
          )}
          {success && (
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#15803d', padding: '12px', borderRadius: '10px',
              fontSize: '14px', marginBottom: '20px'
            }}>✅ {success}</div>
          )}

          {/* Titre */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Titre du cours
            </label>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="input"
              placeholder="Ex: Introduction au Java"
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              placeholder="Décrivez votre cours..."
              style={{ height: '120px', resize: 'vertical' }}
            />
          </div>

          {/* Niveau + Catégorie côte à côte */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Niveau
              </label>
              <select
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
                className="input"
              >
                <option value="DEBUTANT">🟢 Débutant</option>
                <option value="INTERMEDIAIRE">🔵 Intermédiaire</option>
                <option value="AVANCE">🟠 Avancé</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Catégorie
              </label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="input"
              >
                <option value="">-- Choisir --</option>
                <option value="INFORMATIQUE">💻 Informatique</option>
                <option value="COMMERCE">📈 Commerce</option>
                <option value="DROIT">⚖️ Droit</option>
                <option value="GENIE_CIVIL">🏗️ Génie Civil</option>
                <option value="ELECTROTECHNIQUE">⚡ Électrotechnique</option>
                <option value="BANQUE_ET_FINANCE">🏦 Banque & Finance</option>
                <option value="LANGUES">🌍 Langues</option>
                <option value="AUTRE">🌐 Autre</option>
              </select>
            </div>
          </div>

          {/* Bouton */}
          <button
            onClick={handleCreate}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              fontWeight: '700', fontSize: '15px', color: 'white', border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: '0 4px 15px rgba(37,99,235,0.35)',
            }}
          >
            Créer le cours →
          </button>
        </div>
      </div>
    </div>
  );
}
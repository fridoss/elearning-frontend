'use client';
import { useState } from 'react';
import API from '../../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { nom, prenom, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', res.data.email);
      router.push('/dashboard');
    } catch (err) {
      setError("Erreur lors de l'inscription");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Panneau gauche ── */}
      <div
        className="hidden md:flex md:w-1/2 flex-col justify-between relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f1629 0%, #1a2a50 60%, #0f1629 100%)',
          minHeight: '100vh',
          padding: '48px',
        }}
      >
        {/* Cercles décoratifs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'rgba(59,130,246,0.12)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          background: 'rgba(59,130,246,0.08)', pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '40px', height: '40px', background: '#3b82f6',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>E</span>
          </div>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>eLearning</span>
        </div>

        {/* Contenu central */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h2 style={{
            fontSize: '36px', fontWeight: '800', color: 'white',
            lineHeight: '1.2', marginBottom: '24px'
          }}>
            Rejoignez des milliers<br />
            <span style={{ color: '#60a5fa' }}>d'apprenants actifs</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', marginBottom: '40px' }}>
            Créez votre compte gratuit et accédez<br />
            à plus de 100 cours dès aujourd'hui.
          </p>

          {/* Avantages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🎓', text: 'Accès à 100+ cours de qualité' },
              { icon: '🏆', text: 'Certificats téléchargeables' },
              { icon: '📱', text: 'Apprenez depuis n\'importe quel appareil' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(59,130,246,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0
                }}>
                  {item.icon}
                </div>
                <span style={{ color: '#cbd5e1', fontSize: '14px' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ color: '#475569', fontSize: '12px', position: 'relative', zIndex: 10 }}>
          © 2026 eLearning Platform
        </p>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div
        className="w-full md:w-1/2"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          overflowY: 'auto',
          padding: '48px',
          background: 'white',
        }}
      >
        <div style={{ width: '100%', maxWidth: '360px' }}>

<a href="/" style={{
  display: 'flex', alignItems: 'center', gap: '6px',
  color: '#94a3b8', textDecoration: 'none',
  fontSize: '14px', marginBottom: '32px'
}}>
  ← Retour à l'accueil
</a>
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 md:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-slate-800">eLearning</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
            Créer un compte 🚀
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
            Rejoignez la plateforme gratuitement
          </p>

          {/* Erreur */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', padding: '12px', borderRadius: '12px',
              fontSize: '14px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Nom + Prénom côte à côte */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Nom
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="input"
                placeholder="Dupont"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Prénom
              </label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="input"
                placeholder="Jean"
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="votre@email.com"
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              className="input"
              placeholder="••••••••"
            />
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
              Minimum 8 caractères recommandés
            </p>
          </div>

          {/* Bouton */}
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '15px',
              color: 'white',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(37,99,235,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <svg style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Inscription en cours...
              </span>
            ) : "Créer mon compte gratuitement →"}
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
          </div>

          {/* Lien login */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
            Déjà un compte ?{' '}
            <Link href="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
              Se connecter
            </Link>
          </p>

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
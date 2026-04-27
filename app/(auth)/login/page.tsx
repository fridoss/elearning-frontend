'use client';
import { useState } from 'react';
import API from '../../../lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', res.data.email);
      router.push('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
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
    padding: '48px',        // ← style inline, pas de conflit CSS
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
      Bienvenue sur votre<br />
      <span style={{ color: '#60a5fa' }}>espace apprenant</span>
    </h2>
    <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', marginBottom: '40px' }}>
      Continuez votre parcours d'apprentissage et<br />
      développez de nouvelles compétences.
    </p>
    <div style={{ display: 'flex', gap: '40px' }}>
      <div>
        <p style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>100+</p>
        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Cours disponibles</p>
      </div>
      <div>
        <p style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>500+</p>
        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Apprenants actifs</p>
      </div>
      <div>
        <p style={{ fontSize: '24px', fontWeight: '800', color: 'white' }}>95%</p>
        <p style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Satisfaction</p>
      </div>
    </div>
  </div>

  {/* Footer */}
  <p style={{ color: '#475569', fontSize: '12px', position: 'relative', zIndex: 10 }}>
    © 2026 eLearning Platform
  </p>
</div>

      {/* ── Panneau droit ── */}
<div
  className="w-full md:w-1/2"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '48px',
    background: 'white',
  }}
>
  <div style={{ width: '100%', maxWidth: '360px' }}>
      
<a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', marginBottom: '32px', display: 'block' }}>
  ← Retour à l'accueil
</a>
          {/* Logo mobile uniquement */}
          <div className="flex items-center gap-2 mb-10 md:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg 
              flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-slate-800">eLearning</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Bon retour ! 👋
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Connectez-vous pour accéder à vos cours
          </p>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 
              text-red-600 p-3 rounded-xl text-sm mb-6 
              flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold 
              text-slate-700 mb-1.5">
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
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-semibold text-slate-700">
                Mot de passe
              </label>
              <span className="text-xs text-blue-600 
                hover:underline cursor-pointer font-medium">
                Mot de passe oublié ?
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {/* Bouton */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold 
              text-white text-sm transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? '#93c5fd'
                : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(37,99,235,0.35)'
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Connexion en cours...
              </span>
            ) : 'Se connecter →'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">ou</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Lien register */}
          <p className="text-center text-sm text-slate-500">
            Pas encore de compte ?{' '}
            <Link href="/register"
              className="text-blue-600 font-semibold hover:underline">
              S'inscrire gratuitement
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
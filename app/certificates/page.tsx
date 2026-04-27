'use client';
import { useEffect, useState } from 'react';
import API from '../../lib/api';
import { useRouter } from 'next/navigation';

export default function CertificatesPage() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    API.get('/certificates/user/1')
      .then((res) => {
        setCertificates(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const downloadCertificate = (userId: number, courseId: number) => {
    window.open(`http://localhost:8080/api/certificates/download/${userId}/${courseId}`, '_blank');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
        <p style={{ color: '#94a3b8' }}>Chargement...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Navbar */}
      <nav style={{ background: '#0f1629', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>E</div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>eLearning</span>
        </div>
        <a href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>← Retour au dashboard</a>
      </nav>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f1629 0%, #1a2a50 100%)', padding: '48px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🏆</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
            Mes Certificats
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>
            {certificates.length === 0
              ? 'Complétez des cours pour obtenir vos certificats'
              : `${certificates.length} certificat(s) obtenu(s)`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>

        {certificates.length === 0 ? (
          /* ── État vide ── */
          <div style={{ background: 'white', borderRadius: '20px', padding: '64px 32px', textAlign: 'center', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎓</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              Pas encore de certificats
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '28px' }}>
              Terminez un cours pour décrocher votre premier certificat !
            </p>
            <a href="/dashboard" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: '12px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', fontWeight: '700', textDecoration: 'none', boxShadow: '0 4px 15px rgba(37,99,235,0.35)' }}>
              Voir les cours →
            </a>
          </div>
        ) : (
          /* ── Grille certificats ── */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {certificates.map((cert: any) => (
              <div key={cert.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
              >
                {/* Bandeau doré */}
                <div style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '28px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                  {/* Cercles déco */}
                  <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ position: 'absolute', bottom: '-30px', left: '-10px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                  <div style={{ fontSize: '40px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>🏆</div>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>
                    Certificat de réussite
                  </p>
                </div>

                {/* Contenu */}
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', lineHeight: '1.3' }}>
                    {cert.course?.titre}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>📅</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      Obtenu le {new Date(cert.issuedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => downloadCertificate(1, cert.course?.id)}
                      style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
                    >
                      📥 Télécharger PDF
                    </button>
                    <button style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #f1f5f9', background: 'white', color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                      🔗 Partager
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
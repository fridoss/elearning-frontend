'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    setEmail(localStorage.getItem('email') || '');
    setRole(localStorage.getItem('role') || '');
    API.get('/courses')
  .then((res) => {
    setCourses(res.data);
  })
  .catch(() => router.push('/login'));

  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const getInitials = (em: string) =>
    em ? em.charAt(0).toUpperCase() : 'U';

  const roleColor: Record<string, string> = {
    ADMIN: '#ef4444',
    INSTRUCTOR: '#8b5cf6',
    STUDENT: '#10b981',
  };

  const niveauColor: Record<string, { bg: string; text: string }> = {
    DEBUTANT:      { bg: '#dcfce7', text: '#15803d' },
    INTERMEDIAIRE: { bg: '#dbeafe', text: '#1d4ed8' },
    AVANCE:        { bg: '#fef3c7', text: '#d97706' },
  };

const categories = [
    { id: null,                label: 'Tous',            icon: '🌐' },
    { id: 'INFORMATIQUE',      label: 'Informatique',    icon: '💻' },
    { id: 'COMMERCE',          label: 'Commerce',        icon: '📈' },
    { id: 'DROIT',             label: 'Droit',           icon: '⚖️' },
    { id: 'GENIE_CIVIL',       label: 'Génie Civil',     icon: '🏗️' },
    { id: 'ELECTROTECHNIQUE',  label: 'Électrotechnique',icon: '⚡' },
    { id: 'BANQUE_ET_FINANCE', label: 'Banque & Finance',icon: '🏦' },
    { id: 'LANGUES',           label: 'Langues',         icon: '🌍' },
  ];
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const filteredCourses = selectedCat
    ? courses.filter((c: any) => c.categorie === selectedCat)
    : courses;
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Navbar ── */}
      <nav style={{
        background: '#0f1629',
        padding: '0 32px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#3b82f6',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '16px'
          }}>E</div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>eLearning</span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {role === 'ADMIN' && (
            <a href="/admin" style={{
              background: '#ef4444', color: 'white',
              padding: '6px 14px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '600', textDecoration: 'none',
              transition: 'opacity 0.2s'
            }}>⚙️ Admin</a>
          )}
          {(role === 'INSTRUCTOR' || role === 'ADMIN') && (
            <a href="/instructor/create-course" style={{
              background: '#3b82f6', color: 'white',
              padding: '6px 14px', borderRadius: '8px',
              fontSize: '13px', fontWeight: '600', textDecoration: 'none'
            }}>+ Créer un cours</a>
          )}

          {/* Badge role */}
          <span style={{
            background: roleColor[role] || '#64748b',
            color: 'white', padding: '3px 10px',
            borderRadius: '20px', fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.5px'
          }}>{role}</span>

          {/* Avatar */}
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white',
            fontWeight: '700', fontSize: '15px'
          }}>{getInitials(email)}</div>

          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.1)',
            color: 'white', border: '1px solid rgba(255,255,255,0.15)',
            padding: '6px 14px', borderRadius: '8px',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer'
          }}>Déconnexion</button>
        </div>
      </nav>

      {/* ── Contenu ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
            Bonjour {email.split('@')[0]} 👋
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>
            Bienvenue sur votre tableau de bord
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Cours disponibles', value: courses.length, icon: '📚', color: '#3b82f6', bg: '#eff6ff' },
            { label: 'Mes inscriptions',  value: 0,              icon: '✅', color: '#10b981', bg: '#f0fdf4' },
            { label: 'Certificats',       value: 0,              icon: '🏆', color: '#f59e0b', bg: '#fffbeb' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '16px',
              padding: '24px', display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: stat.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '24px', flexShrink: 0
              }}>{stat.icon}</div>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '800', color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Section titre */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>
              Cours disponibles
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '2px' }}>
              {courses.length} cours au total
            </p>
          </div>
        </div>
        {/* ✅ AJOUTEZ ICI — Filtres catégories */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {categories.map((cat) => (
            <button
              key={String(cat.id)}
              onClick={() => setSelectedCat(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: selectedCat === cat.id ? '#3b82f6' : '#e2e8f0',
                background: selectedCat === cat.id ? '#eff6ff' : 'white',
                color: selectedCat === cat.id ? '#2563eb' : '#64748b',
                fontWeight: selectedCat === cat.id ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Cours */}
        {courses.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '60px', textAlign: 'center',
            border: '1px solid #f1f5f9',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '500' }}>
              Aucun cours disponible pour le moment
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filteredCourses.map((course: any) => {
              const niveau = niveauColor[course.niveau] || { bg: '#f1f5f9', text: '#475569' };
              return (
                <div key={course.id} style={{
                  background: 'white', borderRadius: '16px',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Card header coloré */}
                  <div style={{
                    height: '6px',
                    background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                  }} />

                  <div style={{ padding: '20px' }}>
                    <a href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                      <h4 style={{
                        fontWeight: '700', color: '#0f172a',
                        fontSize: '15px', marginBottom: '8px', lineHeight: '1.4'
                      }}>
                        {course.titre}
                      </h4>
                      <p style={{
                        color: '#64748b', fontSize: '13px',
                        lineHeight: '1.6', marginBottom: '16px',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                      }}>
                        {course.description}
                      </p>
                    </a>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        background: niveau.bg, color: niveau.text,
                        padding: '4px 10px', borderRadius: '20px',
                        fontSize: '11px', fontWeight: '700'
                      }}>
                        {course.niveau}
                      </span>
                      <a href={`/courses/${course.id}`} style={{
                        color: '#3b82f6', fontSize: '12px',
                        fontWeight: '600', textDecoration: 'none'
                      }}>
                        Voir le cours →
                      </a>
                    </div>

                    {(role === 'INSTRUCTOR' || role === 'ADMIN') && (
                      <div style={{
                        marginTop: '14px', paddingTop: '14px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex', gap: '12px'
                      }}>
                        <a href={`/instructor/manage-course/${course.id}`} style={{
                          color: '#6366f1', fontSize: '12px',
                          fontWeight: '600', textDecoration: 'none'
                        }}>✏️ Gérer</a>
                        <a href={`/instructor/create-quiz/${course.id}`} style={{
                          color: '#10b981', fontSize: '12px',
                          fontWeight: '600', textDecoration: 'none'
                        }}>+ Quiz</a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
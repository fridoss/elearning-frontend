'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../lib/api';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, certificates: 0 });

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') { router.push('/dashboard'); return; }
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, courses, enrollments, certificates] = await Promise.all([
        API.get('/users'), API.get('/courses'),
        API.get('/enrollments/user/1'), API.get('/certificates/user/1')
      ]);
      setStats({ users: users.data.length, courses: courses.data.length, enrollments: enrollments.data.length, certificates: certificates.data.length });
    } catch (err) { console.error(err); }
  };

  const statCards = [
    { label: 'Utilisateurs', value: stats.users, icon: '👤', color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Cours', value: stats.courses, icon: '📚', color: '#10b981', bg: '#f0fdf4' },
    { label: 'Inscriptions', value: stats.enrollments, icon: '📝', color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Certificats', value: stats.certificates, icon: '🏆', color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navbar */}
      <nav style={{ background: '#0f1629', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#ef4444', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>⚙️</div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>Panel Admin</span>
        </div>
        <a href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>← Retour au dashboard</a>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>Tableau de bord Admin</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Vue d'ensemble de la plateforme</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {statCards.map((stat, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{stat.icon}</div>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '800', color: stat.color, lineHeight: 1 }}>{stat.value}</p>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {[
            { href: '/admin/users', icon: '👥', title: 'Gérer les utilisateurs', desc: 'Voir, modifier et supprimer les utilisateurs', color: '#3b82f6', bg: '#eff6ff' },
            { href: '/admin/courses', icon: '📚', title: 'Gérer les cours', desc: 'Voir, modifier et supprimer les cours', color: '#10b981', bg: '#f0fdf4' },
          ].map((item, i) => (
            <a key={i} href={item.href} style={{ background: 'white', borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{item.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>{item.desc}</p>
              </div>
              <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '20px' }}>→</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
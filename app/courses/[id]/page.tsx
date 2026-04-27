 'use client';
import { useEffect, useState, use } from 'react';
import API from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [enrolled, setEnrolled] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    API.get(`/courses/${id}`).then((res) => { setCourse(res.data); setLoading(false); }).catch(() => setLoading(false));
    API.get(`/sections/course/${id}`).then((res) => setSections(Array.isArray(res.data) ? res.data : [])).catch(() => setSections([]));
    API.get(`/quizzes/course/${id}`)
  .then((res) => setQuizzes(Array.isArray(res.data) ? res.data : []))
  .catch(() => setQuizzes([]));
  }, [id]);

  const handleEnroll = async () => {
    try {
      await API.post('/enrollments', { user: { id: 1 }, course: { id: Number(id) } });
      setEnrolled(true);
      setSuccess('Inscription réussie ! 🎉');
    } catch { setError("Erreur lors de l'inscription"); }
  };

  const niveauColor: Record<string, { bg: string; text: string }> = {
    DEBUTANT: { bg: '#dcfce7', text: '#15803d' },
    INTERMEDIAIRE: { bg: '#dbeafe', text: '#1d4ed8' },
    AVANCE: { bg: '#fef3c7', text: '#d97706' },
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
        <p style={{ color: '#94a3b8' }}>Chargement...</p>
      </div>
    </div>
  );

  if (!course) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#ef4444' }}>Cours introuvable</p>
    </div>
  );

  const niveau = niveauColor[course.niveau] || { bg: '#f1f5f9', text: '#475569' };

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

      {/* Hero du cours */}
      <div style={{ background: 'linear-gradient(135deg, #0f1629 0%, #1a2a50 100%)', padding: '48px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px' }}>
          <div style={{ flex: 1 }}>
            <span style={{ background: niveau.bg, color: niveau.text, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'inline-block', marginBottom: '16px' }}>
              {course.niveau}
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'white', lineHeight: '1.2', marginBottom: '12px' }}>
              {course.titre}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', marginBottom: '20px' }}>
              {course.description}
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                <span>📂</span> {sections.length} section(s)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                <span>📖</span> {sections.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0)} leçon(s)
              </div>
            </div>
          </div>

          {/* Card inscription */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '260px', flexShrink: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '16px' }}>🎓</div>
            {success && <div style={{ background: '#f0fdf4', color: '#15803d', padding: '10px', borderRadius: '10px', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{success}</div>}
            {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '10px', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}
            {!enrolled ? (
              <button onClick={handleEnroll} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.35)', marginBottom: '10px' }}>
                S'inscrire gratuitement →
              </button>
            ) : (
              <div style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#f0fdf4', color: '#15803d', fontWeight: '700', fontSize: '15px', textAlign: 'center', marginBottom: '10px' }}>
                ✅ Inscrit
              </div>
            )}
            <a href="/certificates" style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#fffbeb', color: '#d97706', fontWeight: '600', fontSize: '14px', textAlign: 'center', textDecoration: 'none' }}>
              🏆 Mes certificats
            </a>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 32px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>
          📋 Contenu du cours
        </h2>
        {sections.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ color: '#94a3b8' }}>Aucune section pour le moment</p>
          </div>
        ) : (
          sections.map((section: any, idx: number) => (
            <div key={section.id} style={{ background: 'white', borderRadius: '16px', marginBottom: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', background: '#f8fafc', borderBottom: section.lessons?.length ? '1px solid #f1f5f9' : 'none' }}>
                <span style={{ width: '28px', height: '28px', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{idx + 1}</span>
                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{section.titre}</span>
                <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '12px' }}>{section.lessons?.length || 0} leçon(s)</span>
              </div>
              {section.lessons?.map((lesson: any) => (
                <a key={lesson.id} href={`/lesson/${lesson.id}?courseId=${id}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px 14px 60px', borderBottom: '1px solid #f8fafc', textDecoration: 'none', color: '#475569', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span>{lesson.type === 'VIDEO' ? '🎬' : lesson.type === 'PDF' ? '📄' : '📝'}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', flex: 1 }}>{lesson.titre}</span>
                  <span style={{ background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600' }}>{lesson.type}</span>
                </a>
              ))}
            </div>
          ))
        )}

          {quizzes.length > 0 && (
  <div style={{ marginTop: '32px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>
      📝 Quiz du cours
    </h2>
    {quizzes.map((quiz: any) => (
      <div key={quiz.id} style={{
        background: 'white', borderRadius: '16px', padding: '24px',
        marginBottom: '12px', border: '1px solid #f1f5f9',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: '#eff6ff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '24px'
          }}>📝</div>
          <div>
            <h4 style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px', marginBottom: '4px' }}>
              {quiz.titre}
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>
              {quiz.questions?.length || 0} question(s)
            </p>
          </div>
        </div>
        <a href={`/quiz/${quiz.id}`} style={{
          padding: '10px 20px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: 'white', fontWeight: '600', fontSize: '14px',
          textDecoration: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
        }}>
          Commencer →
        </a>
      </div>
    ))}
  </div>
)}

      </div>
     
    </div>
  );
}
'use client';
import { useEffect, useState, use } from 'react';
import API from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
const courseId = searchParams.get('courseId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    API.get(`/lessons/${id}`).then((res) => { setLesson(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const markCompleted = async () => {
    try {
      await API.post('/progress', { user: { id: 1 }, lesson: { id: Number(id) }, completed: true, watchTime: 0 });
      setCompleted(true);
    } catch (err) { console.error(err); }
  };

  const getVideoId = (url: string) => {
    if (!url) return '';
    const match = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : url;
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div><p style={{ color: '#94a3b8' }}>Chargement...</p></div>
    </div>
  );

  if (!lesson) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#ef4444' }}>Leçon introuvable</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0f1629' }}>
      {/* Navbar */}
      <nav style={{ background: '#0a0f1e', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>E</div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>eLearning</span>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{lesson.titre}</span>
        </div>
          <a href={courseId ? `/courses/${courseId}` : '/dashboard'} 
   style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
  ← Retour au cours
</a>
        
      </nav>

      {/* Vidéo pleine largeur */}
      {lesson.type === 'VIDEO' && (
        <div style={{ background: 'black', width: '100%', aspectRatio: '16/9', maxHeight: '520px' }}>
          <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getVideoId(lesson.contenu)}`} title={lesson.titre} allowFullScreen style={{ display: 'block' }} />
        </div>
      )}

      {/* Contenu */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Titre + type */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
            {lesson.type === 'VIDEO' ? '🎬 Vidéo' : lesson.type === 'PDF' ? '📄 PDF' : '📝 Texte'}
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'white', marginBottom: '24px' }}>{lesson.titre}</h1>

        {/* Texte */}
       {/* Texte */}
{lesson.type === 'TEXTE' && (
  <div style={{
    background: 'white', borderRadius: '16px',
    padding: '28px', marginBottom: '24px',
    border: '1px solid #f1f5f9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
  }}>
    {/* Bouton télécharger en haut */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
      <button
        onClick={() => {
          const blob = new Blob([lesson.contenu], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${lesson.titre}.txt`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        style={{
          padding: '8px 18px', borderRadius: '10px', border: 'none',
          background: '#10b981', color: 'white',
          fontWeight: '600', fontSize: '13px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}
      >
        📥 Télécharger le cours
      </button>
    </div>

    {/* Contenu formaté */}
    {lesson.contenu.split('\n').map((line: string, idx: number) => {
      if (line.startsWith('### ')) return (
        <h3 key={idx} style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginTop: '24px', marginBottom: '12px', borderBottom: '2px solid #eff6ff', paddingBottom: '8px' }}>
          {line.replace('### ', '')}
        </h3>
      );
      if (line.startsWith('## ')) return (
        <h4 key={idx} style={{ fontSize: '15px', fontWeight: '700', color: '#2563eb', marginTop: '20px', marginBottom: '8px' }}>
          {line.replace('## ', '')}
        </h4>
      );
      if (line.startsWith('```') || line.startsWith('    ')) return (
        <code key={idx} style={{ display: 'block', background: '#1e293b', color: '#7dd3fc', padding: '4px 12px', fontFamily: 'monospace', fontSize: '13px', borderRadius: '4px', margin: '2px 0' }}>
          {line.replace(/```/g, '')}
        </code>
      );
      if (line.startsWith('- ') || line.startsWith('• ')) return (
        <p key={idx} style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '4px' }}>
          {'• ' + line.replace('- ', '').replace('• ', '')}
        </p>
      );
      if (line.trim() === '') return <br key={idx} />;
      return (
        <p key={idx} style={{ color: '#475569', fontSize: '14px', lineHeight: '1.8', marginBottom: '8px' }}>
          {line}
        </p>
      );
    })}
  </div>
)}

        {/* PDF */}
        {/* PDF */}
        {lesson.type === 'PDF' && (() => {
  // Extraire l'ID automatiquement depuis n'importe quel lien Google Drive
  const extractGoogleId = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };
  
  const googleId = extractGoogleId(lesson.contenu);
  const previewUrl = googleId 
    ? `https://drive.google.com/file/d/${googleId}/preview`
    : lesson.contenu;
  const downloadUrl = googleId
    ? `https://drive.google.com/uc?export=download&id=${googleId}`
    : lesson.contenu;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)', borderRadius: '16px',
      padding: '40px', marginBottom: '24px', textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
        Document PDF disponible
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={previewUrl} target="_blank" style={{
          display: 'inline-block', padding: '12px 28px',
          borderRadius: '10px', background: '#3b82f6',
          color: 'white', fontWeight: '600', textDecoration: 'none'
        }}>
          👁️ Ouvrir le PDF →
        </a>
        <a href={downloadUrl} style={{
          display: 'inline-block', padding: '12px 28px',
          borderRadius: '10px', background: '#10b981',
          color: 'white', fontWeight: '600', textDecoration: 'none'
        }}>
          📥 Télécharger le PDF
        </a>
      </div>
    </div>
  );
})()} 

        {/* Bouton complété */}
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>Tu as terminé cette leçon ?</p>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Marque-la comme complétée pour suivre ta progression</p>
          </div>
          {!completed ? (
            <button onClick={markCompleted} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.3)', whiteSpace: 'nowrap' }}>
              ✓ Marquer complétée
            </button>
          ) : (
            <div style={{ padding: '12px 24px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: '600', fontSize: '14px' }}>
              ✅ Complétée !
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
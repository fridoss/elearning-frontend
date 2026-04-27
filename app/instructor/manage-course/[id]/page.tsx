'use client';

import { useEffect, useState, use } from 'react';
import API from '../../../../lib/api';
import { useRouter } from 'next/navigation';

export default function ManageCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [sectionTitre, setSectionTitre] = useState('');
  const [lessonTitre, setLessonTitre] = useState('');
  const [lessonType, setLessonType] = useState('VIDEO');
  const [lessonContenu, setLessonContenu] = useState('');
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'section' | 'lesson'>('section');
  const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    API.get(`/courses/${id}`).then((res) => setCourse(res.data));
    loadSections();
  }, [id]);

  const loadSections = async () => {
    try {
      const res = await API.get(`/sections/course/${id}`);
      setSections(Array.isArray(res.data) ? res.data : []);
    } catch { setSections([]); }
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const addSection = async () => {
    if (!sectionTitre) return;
    try {
      await API.post('/sections', {
        titre: sectionTitre,
        ordre: sections.length + 1,
        course: { id: Number(id) },
      });
      setSectionTitre('');
      showSuccess('✅ Section ajoutée avec succès !');
      await loadSections();
    } catch (err) { console.error(err); }
  };

  const addLesson = async () => {
    
    
    if (!lessonTitre || !selectedSection) {
       
        return;
    }
    if (!lessonTitre || !selectedSection) return;
    await API.post('/lessons', {
      titre: lessonTitre,
      type: lessonType,
      contenu: lessonContenu || '' ,
      ordre: 1,
      section: { id: selectedSection },
    });
    setLessonTitre('');
    setLessonContenu('');
    showSuccess('✅ Leçon ajoutée avec succès !');
    loadSections();
  };
  const deleteLesson = async (lessonId: number) => {
  if (!confirm('Supprimer cette leçon ?')) return;
  try {
    await API.delete(`/lessons/${lessonId}`);
    showSuccess('✅ Leçon supprimée !');
    await loadSections();
  } catch (err) {
    console.error(err);
  }
};

  const typeIcon: Record<string, string> = {
    VIDEO: '🎬', PDF: '📄', TEXTE: '📝'
  };

  const handleFileUpload = async (file: File) => {
  setUploading(true);
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const res = await fetch('http://localhost:8080/api/upload/pdf', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    const data = await res.json();
    setLessonContenu(data.url); // URL automatiquement remplie
    setUploading(false);
  } catch (err) {
    console.error('Erreur upload:', err);
    setUploading(false);
  }
};

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Navbar */}
      <nav style={{
        background: '#0f1629', padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#3b82f6', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', color: 'white', fontSize: '16px'
          }}>E</div>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '18px' }}>eLearning</span>
        </div>
        <a href="/dashboard" style={{
          color: '#94a3b8', textDecoration: 'none', fontSize: '14px', fontWeight: '500'
        }}>← Retour au dashboard</a>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>
            Gestion du cours
          </p>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
            {course?.titre || '...'}
          </h2>
        </div>

        {/* Succès */}
        {success && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d',
            padding: '12px 16px', borderRadius: '12px', fontSize: '14px',
            marginBottom: '24px', fontWeight: '500'
          }}>{success}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* ── Colonne gauche : formulaires ── */}
          <div>
            {/* Tabs */}
            <div style={{
              display: 'flex', background: 'white', borderRadius: '12px',
              padding: '4px', gap: '4px', marginBottom: '20px',
              border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              {(['section', 'lesson'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px',
                  background: activeTab === tab ? '#3b82f6' : 'transparent',
                  color: activeTab === tab ? 'white' : '#64748b',
                  transition: 'all 0.2s'
                }}>
                  {tab === 'section' ? '📂 Section' : '📖 Leçon'}
                </button>
              ))}
            </div>

            {/* Formulaire Section */}
            {activeTab === 'section' && (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '24px',
                border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                  Nouvelle section
                </h3>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Titre de la section
                  </label>
                  <input
                    type="text"
                    value={sectionTitre}
                    onChange={(e) => setSectionTitre(e.target.value)}
                    className="input"
                    placeholder="Ex: Introduction, Variables..."
                    onKeyDown={(e) => e.key === 'Enter' && addSection()}
                  />
                </div>
                <button onClick={addSection} style={{
                  width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                }}>
                  + Ajouter la section
                </button>
              </div>
            )}

            {/* Formulaire Leçon */}
            {activeTab === 'lesson' && (
              <div style={{
                background: 'white', borderRadius: '16px', padding: '24px',
                border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
                  Nouvelle leçon
                </h3>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Section
                  </label>
                  <select
                    onChange={(e) => setSelectedSection(Number(e.target.value))}
                    className="input"
                  >
                    <option value="">-- Choisir une section --</option>
                    {sections.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.titre}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Titre de la leçon
                  </label>
                  <input
                    type="text"
                    value={lessonTitre}
                    onChange={(e) => setLessonTitre(e.target.value)}
                    className="input"
                    placeholder="Ex: Les variables en Java"
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      { value: 'VIDEO', label: '🎬 Vidéo' },
                      { value: 'PDF',   label: '📄 PDF' },
                      { value: 'TEXTE', label: '📝 Texte' },
                    ].map((t) => (
                      <button key={t.value} onClick={() => setLessonType(t.value)} style={{
                        padding: '10px 8px', borderRadius: '10px', border: '1px solid',
                        borderColor: lessonType === t.value ? '#3b82f6' : '#e2e8f0',
                        background: lessonType === t.value ? '#eff6ff' : 'white',
                        color: lessonType === t.value ? '#2563eb' : '#64748b',
                        fontWeight: '600', fontSize: '12px', cursor: 'pointer'
                      }}>{t.label}</button>
                    ))}
                  </div>
                </div>

                
               { /* ✅ Nouveau bloc avec upload PDF*/}
<div style={{ marginBottom: '20px' }}>
  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
    {lessonType === 'VIDEO' ? 'URL YouTube' : lessonType === 'PDF' ? 'PDF' : 'Contenu texte'}
  </label>

  {/* Upload PDF */}
  {lessonType === 'PDF' && (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          if (file && file.type === 'application/pdf') handleFileUpload(file);
        }}
        style={{
          border: '2px dashed #3b82f6', borderRadius: '12px', padding: '24px',
          textAlign: 'center', background: '#eff6ff', marginBottom: '12px', cursor: 'pointer'
        }}
        onClick={() => document.getElementById('pdf-input')?.click()}
      >
        <input
          id="pdf-input" type="file" accept=".pdf"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
        {uploading ? (
          <div>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>⏳</div>
            <p style={{ color: '#2563eb', fontWeight: '600', fontSize: '14px' }}>Upload en cours...</p>
          </div>
        ) : lessonContenu && lessonContenu.startsWith('http') ? (
          <div>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
            <p style={{ color: '#15803d', fontWeight: '600', fontSize: '14px' }}>PDF uploadé avec succès !</p>
            <p style={{ color: '#64748b', fontSize: '12px', marginTop: '4px' }}>Cliquez pour changer le fichier</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📄</div>
            <p style={{ color: '#2563eb', fontWeight: '600', fontSize: '14px' }}>Cliquez ou glissez votre PDF ici</p>
            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Fichiers PDF uniquement — Max 50 MB</p>
          </div>
        )}
      </div>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>
        — ou entrez une URL directement —
      </p>
      <input
        type="text" value={lessonContenu || ''}
        onChange={(e) => setLessonContenu(e.target.value)}
        className="input"
        placeholder="https://exemple.com/document.pdf"
      />
    </div>
  )}

  {/* Vidéo */}
  {lessonType === 'VIDEO' && (
    <textarea
      value={lessonContenu}
      onChange={(e) => setLessonContenu(e.target.value)}
      className="input"
      placeholder="https://youtube.com/..."
      style={{ height: '90px', resize: 'vertical' }}
    />
  )}

  {/* Texte */}
  {lessonType === 'TEXTE' && (
    <textarea
      value={lessonContenu}
      onChange={(e) => setLessonContenu(e.target.value)}
      className="input"
      placeholder="Contenu de la leçon..."
      style={{ height: '120px', resize: 'vertical' }}
    />
  )}
</div>

                <button onClick={addLesson} style={{
                  width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
                }}>
                  + Ajouter la leçon
                </button>
              </div>
            )}
          </div>

          {/* ── Colonne droite : contenu du cours ── */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
              📋 Contenu du cours
            </h3>

            {sections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Aucune section pour le moment</p>
              </div>
            ) : (
              sections.map((section: any, idx: number) => (
                <div key={section.id} style={{ marginBottom: '16px' }}>
                  {/* Section header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', background: '#f8fafc',
                    borderRadius: '10px', marginBottom: '8px',
                    border: '1px solid #f1f5f9'
                  }}>
                    <span style={{
                      width: '24px', height: '24px', background: '#3b82f6',
                      borderRadius: '6px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: '700'
                    }}>{idx + 1}</span>
                    <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                      {section.titre}
                    </span>
                    <span style={{
                      marginLeft: 'auto', fontSize: '11px', color: '#94a3b8'
                    }}>
                      {section.lessons?.length || 0} leçon(s)
                    </span>
                  </div>

                  {/* Leçons */}
                  {section.lessons?.map((lesson: any) => (
                    <div key={lesson.id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 14px 8px 36px',
                      borderLeft: '2px solid #e2e8f0',
                      marginLeft: '12px', marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '14px' }}>{typeIcon[lesson.type]}</span>
                      <a href={`/lesson/${lesson.id}`} style={{
                        color: '#475569', fontSize: '13px', textDecoration: 'none',
                        fontWeight: '500', flex: 1
                      }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
                      >
                        {lesson.titre}
                      </a>
                      <span style={{
                        background: '#f1f5f9', color: '#64748b',
                        padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '600'
                      }}>{lesson.type}</span>

                      {/* ✅ Bouton supprimer */}
    <button
      onClick={() => deleteLesson(lesson.id)}
      style={{
        background: '#fef2f2', border: '1px solid #fecaca',
        color: '#ef4444', borderRadius: '6px',
        padding: '2px 8px', fontSize: '11px',
        fontWeight: '600', cursor: 'pointer'
      }}
    >
      🗑️
    </button>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
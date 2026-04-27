'use client';
import { useState, use } from 'react';
import API from '../../../../lib/api';
import { useRouter } from 'next/navigation';

export default function CreateQuizPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();
  const [quizTitre, setQuizTitre] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionContenu, setQuestionContenu] = useState('');
  const [answers, setAnswers] = useState([
    { contenu: '', isCorrect: false }, { contenu: '', isCorrect: false },
    { contenu: '', isCorrect: false }, { contenu: '', isCorrect: false },
  ]);
  const [success, setSuccess] = useState('');

  const addQuestion = () => {
    if (!questionContenu) return;
    setQuestions([...questions, { contenu: questionContenu, answers: [...answers] }]);
    setQuestionContenu('');
    setAnswers([{ contenu: '', isCorrect: false }, { contenu: '', isCorrect: false }, { contenu: '', isCorrect: false }, { contenu: '', isCorrect: false }]);
  };

  const handleAnswerChange = (index: number, field: string, value: any) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    try {
      const quiz = await API.post('/quizzes', { titre: quizTitre, course: { id: Number(courseId) } });
      for (const q of questions) {
        const question = await API.post(`/quizzes/${quiz.data.id}/questions`, { contenu: q.contenu });
        for (const a of q.answers) {
          if (a.contenu) await API.post(`/quizzes/questions/${question.data.id}/answers`, { contenu: a.contenu, isCorrect: a.isCorrect });
        }
      }
      setSuccess('Quiz créé avec succès !');
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err) { console.error(err); }
  };

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

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>📋 Créer un Quiz</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Ajoutez des questions et des réponses</p>
        </div>

        {success && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', marginBottom: '24px' }}>✅ {success}</div>}

        {/* Titre quiz */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Titre du Quiz</label>
          <input type="text" value={quizTitre} onChange={(e) => setQuizTitre(e.target.value)} className="input" placeholder="Ex: Quiz sur les bases de Java" />
        </div>

        {/* Ajouter question */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>➕ Nouvelle question</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Question</label>
            <input type="text" value={questionContenu} onChange={(e) => setQuestionContenu(e.target.value)} className="input" placeholder="Tapez votre question..." />
          </div>

          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Réponses</label>
          {answers.map((answer, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                background: answer.isCorrect ? '#f0fdf4' : '#f8fafc',
                border: `2px solid ${answer.isCorrect ? '#10b981' : '#e2e8f0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '700', color: '#64748b'
              }}>{String.fromCharCode(65 + index)}</div>
              <input type="text" value={answer.contenu} onChange={(e) => handleAnswerChange(index, 'contenu', e.target.value)} className="input" placeholder={`Réponse ${index + 1}`} style={{ flex: 1 }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input type="checkbox" checked={answer.isCorrect} onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#10b981' }} />
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>Correcte</span>
              </label>
            </div>
          ))}

          <button onClick={addQuestion} style={{ marginTop: '16px', padding: '12px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
            + Ajouter la question
          </button>
        </div>

        {/* Liste questions */}
        {questions.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>
              📝 Questions ajoutées ({questions.length})
            </h3>
            {questions.map((q, index) => (
              <div key={index} style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '12px', border: '1px solid #f1f5f9' }}>
                <p style={{ fontWeight: '700', color: '#0f172a', marginBottom: '10px', fontSize: '14px' }}>
                  {index + 1}. {q.contenu}
                </p>
                {q.answers.map((a: any, i: number) => a.contenu && (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '8px', marginBottom: '4px', background: a.isCorrect ? '#f0fdf4' : 'white', border: `1px solid ${a.isCorrect ? '#bbf7d0' : '#f1f5f9'}` }}>
                    <span style={{ color: a.isCorrect ? '#10b981' : '#94a3b8', fontWeight: '700', fontSize: '12px' }}>{a.isCorrect ? '✓' : '○'}</span>
                    <span style={{ fontSize: '13px', color: a.isCorrect ? '#15803d' : '#64748b', fontWeight: a.isCorrect ? '600' : '400' }}>{a.contenu}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Bouton créer */}
        <button onClick={handleSubmit} disabled={!quizTitre || questions.length === 0} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: !quizTitre || questions.length === 0 ? '#e2e8f0' : 'linear-gradient(135deg, #10b981, #059669)', color: !quizTitre || questions.length === 0 ? '#94a3b8' : 'white', fontWeight: '700', fontSize: '16px', cursor: !quizTitre || questions.length === 0 ? 'not-allowed' : 'pointer', boxShadow: !quizTitre || questions.length === 0 ? 'none' : '0 4px 15px rgba(16,185,129,0.35)' }}>
          Créer le Quiz →
        </button>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState, use } from 'react';
import API from '../../../lib/api';
import { useRouter } from 'next/navigation';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [courseId, setCourseId] = useState<number | null>(null);

  useEffect(() => {
    API.get(`/quizzes/${id}`)
      .then((res) => { setQuiz(res.data); setLoading(false);setCourseId(res.data.course?.id); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAnswer = (questionId: number, answerId: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q: any) => {
      const selected = q.answers.find((a: any) => a.id === answers[q.id]);
      if (selected?.isCorrect) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const total = quiz?.questions?.length || 0;
  const answered = Object.keys(answers).length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1629' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
        <p style={{ color: '#94a3b8' }}>Chargement...</p>
      </div>
    </div>
  );

  if (!quiz) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1629' }}>
      <p style={{ color: '#ef4444' }}>Quiz introuvable</p>
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
        {/* Progress bar */}
        {!submitted && (
          <div style={{ flex: 1, maxWidth: '300px', margin: '0 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>Progression</span>
              <span style={{ color: '#94a3b8', fontSize: '12px' }}>{answered}/{total}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
              <div style={{ height: '100%', width: `${total > 0 ? (answered / total) * 100 : 0}%`, background: '#3b82f6', borderRadius: '3px', transition: 'width 0.3s' }} />
            </div>
          </div>
        )}
        
          <a href="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}>
  ← Retour au dashboard
</a>

      </nav>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📝</div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>{quiz.titre}</h1>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>{total} question(s)</p>
            </div>
          </div>
        </div>

        {/* Résultat final */}
        {submitted && (
          <div style={{
            background: percent >= 50 ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: `1px solid ${percent >= 50 ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '20px', padding: '40px', textAlign: 'center', marginBottom: '32px'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>
              {percent >= 80 ? '🏆' : percent >= 50 ? '🎉' : '😔'}
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: percent >= 50 ? '#15803d' : '#dc2626', marginBottom: '8px' }}>
              {score}/{total}
            </h2>
            <p style={{ fontSize: '18px', fontWeight: '600', color: percent >= 50 ? '#15803d' : '#dc2626', marginBottom: '8px' }}>
              {percent >= 80 ? 'Excellent !' : percent >= 50 ? 'Bien joué !' : 'Essaie encore !'}
            </p>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Score : {percent}% — {score} bonne(s) réponse(s) sur {total}
            </p>
            {/* Score bar */}
            <div style={{ height: '12px', background: 'rgba(0,0,0,0.08)', borderRadius: '6px', maxWidth: '300px', margin: '0 auto 24px' }}>
              <div style={{ height: '100%', width: `${percent}%`, background: percent >= 50 ? '#10b981' : '#ef4444', borderRadius: '6px', transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => { setSubmitted(false); setAnswers({}); setScore(0); }} style={{ padding: '12px 24px', borderRadius: '10px', border: 'none', background: '#3b82f6', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                🔄 Recommencer
              </button>
              
              <a href={`/courses/${courseId}`} style={{ padding: '12px 24px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: '600', textDecoration: 'none', display: 'inline-block' }}>
  ← Retour au cours
</a>
            </div>
          </div>
        )}

        {/* Questions */}
        {quiz.questions?.map((q: any, index: number) => {
          const selectedId = answers[q.id];
          const isAnswered = selectedId !== undefined;

          return (
            <div key={q.id} style={{
              background: 'white', borderRadius: '16px', padding: '28px',
              marginBottom: '16px', border: '1px solid #f1f5f9',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
            }}>
              {/* Question header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
                <span style={{
                  width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                  background: isAnswered ? '#eff6ff' : '#f8fafc',
                  border: `2px solid ${isAnswered ? '#3b82f6' : '#e2e8f0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '800', fontSize: '13px',
                  color: isAnswered ? '#2563eb' : '#94a3b8'
                }}>{index + 1}</span>
                <p style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px', lineHeight: '1.5', flex: 1 }}>
                  {q.contenu}
                </p>
              </div>

              {/* Réponses */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.answers?.map((answer: any, aIdx: number) => {
                  const isSelected = selectedId === answer.id;
                  const isCorrect = answer.isCorrect;

                  let bg = 'white';
                  let borderColor = '#e2e8f0';
                  let textColor = '#475569';
                  let icon = String.fromCharCode(65 + aIdx);

                  if (submitted) {
                    if (isCorrect) { bg = '#f0fdf4'; borderColor = '#10b981'; textColor = '#15803d'; }
                    else if (isSelected && !isCorrect) { bg = '#fef2f2'; borderColor = '#ef4444'; textColor = '#dc2626'; }
                  } else if (isSelected) {
                    bg = '#eff6ff'; borderColor = '#3b82f6'; textColor = '#2563eb';
                  }

                  return (
                    <div key={answer.id}
                      onClick={() => handleAnswer(q.id, answer.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        padding: '14px 16px', borderRadius: '12px',
                        border: `2px solid ${borderColor}`, background: bg,
                        cursor: submitted ? 'default' : 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (!submitted && !isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#94a3b8'; }}
                      onMouseLeave={e => { if (!submitted && !isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; }}
                    >
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                        background: submitted && isCorrect ? '#10b981' : isSelected && !submitted ? '#3b82f6' : '#f1f5f9',
                        color: (submitted && isCorrect) || (isSelected && !submitted) ? 'white' : '#64748b',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '12px'
                      }}>
                        {submitted && isCorrect ? '✓' : submitted && isSelected && !isCorrect ? '✗' : icon}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: isSelected ? '600' : '400', color: textColor, flex: 1 }}>
                        {answer.contenu}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Bouton soumettre */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={answered < total}
            style={{
              width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
              background: answered < total ? '#e2e8f0' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: answered < total ? '#94a3b8' : 'white',
              fontWeight: '700', fontSize: '16px', cursor: answered < total ? 'not-allowed' : 'pointer',
              boxShadow: answered < total ? 'none' : '0 4px 15px rgba(37,99,235,0.35)',
              transition: 'all 0.2s'
            }}
          >
            {answered < total ? `Répondez à toutes les questions (${answered}/${total})` : 'Soumettre le quiz →'}
          </button>
        )}
      </div>
    </div>
  );
}
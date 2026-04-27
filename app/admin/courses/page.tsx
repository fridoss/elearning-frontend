'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../../../lib/api';

export default function AdminCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadCourses();
  }, []);

  const loadCourses = () => {
    API.get('/courses')
      .then((res) => setCourses(
        Array.isArray(res.data) ? res.data : []));
  };

  const deleteCourse = async (courseId: number) => {
    if (!confirm('Supprimer ce cours ?')) return;
    try {
      await API.delete(`/courses/${courseId}`);
      loadCourses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-red-600 text-white 
        px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Admin — Cours
        </h1>
        <a href="/admin"
          className="text-white hover:underline">
          ← Retour Admin
        </a>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold 
          text-gray-800 mb-6">
          📚 Gestion des cours
        </h2>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-left 
                  text-gray-700">ID</th>
                <th className="p-4 text-left 
                  text-gray-700">Titre</th>
                <th className="p-4 text-left 
                  text-gray-700">Niveau</th>
                <th className="p-4 text-left 
                  text-gray-700">Instructeur</th>
                <th className="p-4 text-left 
                  text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course: any) => (
                <tr key={course.id}
                  className="border-b 
                    hover:bg-gray-50">
                  <td className="p-4 
                    text-gray-600">
                    {course.id}
                  </td>
                  <td className="p-4 
                    text-gray-800 font-semibold">
                    {course.titre}
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 
                      text-blue-600 px-2 py-1 
                      rounded text-xs">
                      {course.niveau}
                    </span>
                  </td>
                  <td className="p-4 
                    text-gray-600">
                    {course.instructor
                      ? course.instructor.prenom + 
                        ' ' + course.instructor.nom
                      : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <a href={`/courses/${course.id}`}
                        className="bg-blue-500 
                          text-white px-3 py-1 
                          rounded hover:bg-blue-600 
                          text-sm">
                        Voir
                      </a>
                      <button
                        onClick={() => 
                          deleteCourse(course.id)}
                        className="bg-red-500 
                          text-white px-3 py-1 
                          rounded hover:bg-red-600 
                          text-sm">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
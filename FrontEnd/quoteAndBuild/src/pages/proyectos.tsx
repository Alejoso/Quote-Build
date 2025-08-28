// src/pages/ProjectsPage.tsx

// ...existing code...
import { Link } from 'react-router-dom';
import TrashIcon from '../assets/TrashIcon.png';
import { useState, useEffect } from 'react';

type ProjectListItem = { project_id: number; name: string; location: string; total: string | null };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/project/')
      .then(res => res.json())
      .then((data: any[]) => setProjects(data));
  }, []);

  return (
    <div className="min-h-screen bg-[#dedede] p-8">
      <div className="text-[44px] font-bold text-black font-sans text-center" style={{ fontFamily: 'Latif, sans-serif' }}>
        Projects
      </div>
      <div className="flex justify-center items-start mt-4">
        <div className="bg-negroClaro p-6 rounded-xl w-full max-w-[600px] space-y-2">
          {projects.map((p) => (
            <div key={p.project_id} className="flex items-center bg-white rounded-lg shadow-md p-4 mb-2 hover:bg-gray-100 transition-all">
              <Link to={`/project/${p.project_id}`} className="flex-1 cursor-pointer">
                <span className="text-lg font-semibold text-black">{p.name}</span>
                <span className="ml-2 text-gray-600">• {p.location}</span>
              </Link>
              <button className="ml-4 p-2 hover:bg-red-100 rounded-full" title="Eliminar proyecto">
                <img src={TrashIcon} alt="Eliminar" className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

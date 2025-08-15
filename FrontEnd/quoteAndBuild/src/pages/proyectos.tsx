// src/pages/ProjectsPage.tsx
import Titulo from '../components/Titulo';
import ProjectElement from '../components/ProjectElement';
import { Link } from 'react-router-dom';
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
      <Titulo textValue="Projects" />
      <div className="flex justify-center items-start mt-4">
        <div className="bg-negroClaro p-6 rounded-xl w-full max-w-[600px] space-y-2">
          {projects.map((p) => (
            <Link key={p.project_id} to={`/project/${p.project_id}`}>
              <ProjectElement textValue={`${p.name} • ${p.location}`} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

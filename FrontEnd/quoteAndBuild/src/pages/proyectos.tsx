import Titulo from '../components/Titulo';
import ProjectElement from '../components/ProjectElement';
import { useState, useEffect } from 'react';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<string[]>([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/projects/')
            .then(res => res.json())
            .then(data => {
                // Asumiendo que cada proyecto tiene un campo 'name'
                setProjects(data.map((project: any) => project.name));
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#dedede] p-8">
            <Titulo textValue="Projects" />
            <div className="flex justify-center items-start mt-4">
                <div className="bg-negroClaro p-6 rounded-xl w-full max-w-[600px]">
                    {projects.map((name, idx) => (
                        <ProjectElement key={idx} textValue={name} />
                    ))}
                </div>
            </div>
        </div>
    );
}

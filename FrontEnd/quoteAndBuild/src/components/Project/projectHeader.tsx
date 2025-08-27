import Titulo from '../shared/Titulo';



interface ProjectHeaderProps {
  projectName: string;
}

function ProjectHeader({ projectName }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
      <Titulo textValue={projectName} />
      <div className="text-[32px] font-bold text-black font-[Latif]">
        Clases
      </div>
    </div>
  );
}

export default ProjectHeader;

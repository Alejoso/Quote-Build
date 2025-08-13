import { useEffect, useState } from "react";
import { getProyectosMock } from "../../services/projectService";
import ProjectElement from "../elementTable/elementTable";
import DynamicBox from "../dynamicBox/dynamicBox";

type Proyecto = {
  ProjectId: number;
  Name: string;
};

function ProjectList() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  useEffect(() => {
    getProyectosMock().then(setProyectos);
  }, []);

  return (
    <DynamicBox itemsCount={proyectos.length} itemHeight={60}>
      {proyectos.map((proyecto) => (
        <ProjectElement
          key={proyecto.ProjectId}
          textValue={proyecto.Name}
        />
      ))}
    </DynamicBox>
  );
}

export default ProjectList;


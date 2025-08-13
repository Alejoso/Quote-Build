import { useEffect, useState } from "react";
import { getProyectosMock } from "../../services/projectService";
import ProjectElement from "../elementTable/elementTable";
import DynamicBox from "../dynamicBox/dynamicBox";

function ProjectList() {
  const [proyectos, setProyectos] = useState<string[]>([]);

  useEffect(() => {
    getProyectosMock().then(setProyectos);
  }, []);

  return (
    <DynamicBox itemsCount={proyectos.length} itemHeight={60}>
      {proyectos.map((nombre, index) => (
        <ProjectElement key={index} textValue={nombre} />
      ))}
    </DynamicBox>
  );
}

export default ProjectList;


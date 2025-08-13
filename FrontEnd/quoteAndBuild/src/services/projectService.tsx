// services/projectService.ts

type Proyecto = {
  ProjectId: number;
  Name: string;
};

export async function getProyectosMock(): Promise<Proyecto[]> {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    { ProjectId: 1, Name: "Construcción Edificio Central" },
    { ProjectId: 2, Name: "Reforma Oficina Norte" },
    { ProjectId: 3, Name: "Ampliación Planta Industrial" }
  ];
}

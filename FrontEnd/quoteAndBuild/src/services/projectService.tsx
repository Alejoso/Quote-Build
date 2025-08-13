export async function getProyectosMock(): Promise<string[]> {
  // Simular retraso de red
  await new Promise((res) => setTimeout(res, 200));

  const data = [
    { nombre: "Construcción de Puente" },
    { nombre: "Edificio Residencial" },
    { nombre: "Remodelación de Oficina" },
    { nombre: "Parque Industrial" },
    { nombre: "Escuela Primaria" }, 
    {nombre: "Casa75"}
    
  ];

  return data.map((item) => item.nombre);
}

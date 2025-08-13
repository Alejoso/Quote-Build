import styles from './ProjectsTable.module.css';

const ProjectsTable = () => {
  // Datos de ejemplo (puedes reemplazar con tu API)
  const projects = Array(4).fill({ name: 'Project' });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Projects</h1>
      
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.header}>Project</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index} className={styles.row}>
              <td className={styles.cell}>{project.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
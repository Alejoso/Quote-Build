import styles from './elementTable.module.css';

interface ProjectElementProps {
  textValue: string;
}

function ProjectElement({ textValue }: ProjectElementProps) {
  return (
    <div className={styles.ProjectElement}>
      <span className={styles.ProjectItem}>{textValue}</span>
      <button className={styles.trashButton}>
        <img src="trashImage.jpeg" alt="Eliminar" className={styles.trashImage} />
      </button>
    </div>
  );
}

export default ProjectElement;

import styles from './tittle.module.css'; 
interface ProjectElementProps {
    textValue: string;  // Tipo number definido
}

function Titulo({ textValue }: ProjectElementProps) {
    return (
        <div className={styles.title}> 
            {textValue}
        </div>
    );
}
export default Titulo; 
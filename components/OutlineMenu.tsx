import styles from '../styles/OutlineMenu.module.css'

interface Props {
    color?: string;
    data: string;
}

const OutlineMenu: React.FC<Props> = (props) => {
    return (
        <div className={styles.container} style={{ backgroundColor: props.color }}>
            fdffdfsda
        </div>
    )
};

export default OutlineMenu;
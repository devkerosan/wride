import { MdBookmarks } from 'react-icons/md'
import { css } from '@emotion/react'

interface Props {
    color?: string;
}

const TabMenu: React.FC<Props> = (props) => {
    return (
        <div css={styles.container(props.color)}>
            <div css={styles.gooeys}>
                <div css={styles.select}><MdBookmarks /></div>
                <div css={styles.select}><MdBookmarks /></div>
                <div css={styles.select}><MdBookmarks /></div>
                <div css={styles.select}><MdBookmarks /></div>
                <div css={styles.content}>
                    aaa
                </div>
            </div>
            <svg>
                <defs>
                    <filter id="filter">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="filter" />
                        <feComposite in="SourceGraphic" in2="filter" operator="atop" />
                    </filter>
                </defs>
            </svg>
        </div>
    )
};

const styles = {
    container: (color: string | undefined) => css({
        flexDirection: 'column',
        gap: '8px',
        borderRadius: '12px',
        minHeight: '120px',
        margin: '8px',
        padding: '8px',
        backgroundColor: color || 'gray',
    }),
    content: css({
        width: '100%',
        height: 'auto',
        gridColumnStart: '1',
        gridColumnEnd: '5',
        borderRadius: '12px',
        backgroundColor: 'white',
        border: 'none'

    }),
    select: css({
        height: '48px',
        width: '48px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '50%',
        padding: '8px',
        justifyContent: 'center',
        justifyItems: 'center',
        color: 'gray',
        fontSize: '24px'
    }),
    gooeys: css({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        justifyItems: 'center',
        rowGap: '8px',
    })

}

export default TabMenu;
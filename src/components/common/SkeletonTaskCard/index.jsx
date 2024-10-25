import Styles from './SkeletonTaskCard.module.css'; // Define custom styles

export default function SkeletonTaskCard() {
    return (
        <div className={Styles.skeleton_task_card}>
            <div className={Styles.skeleton_header}>
                <span className={Styles.skeleton_priority}></span>
                <span className={Styles.skeleton_options}></span>
            </div>
            <div className={Styles.skeleton_body}>
                <span className={Styles.heading}></span>
                <section className={Styles.body}>
                    <span className={Styles.content}></span>
                    <span className={Styles.content}></span>
                </section>
            </div>
            <div className={Styles.skeleton_footer}>
                <div className={Styles.footer_left}>
                    <div className={Styles.footer_item}></div>
                </div>
                <div className={Styles.footer_right}>
                    <div className={Styles.footer_item}></div>
                    <div className={Styles.footer_item}></div>
                    <div className={Styles.footer_item}></div>
                </div>
            </div>
        </div>
    );
}

import { useEffect } from 'react';
import Brand from '../../assets/images/logo.png'
import Styles from './ShowTask.module.css'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getTaskDetails } from '../../slices/taskSlice';
import Checkbox from '../common/Checkbox';
export default function ShowTask() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { task, error } = useSelector((state) => state.tasks);
    useEffect(() => {
        dispatch(getTaskDetails(id));
    }, [id, dispatch])

    if (error) {
        return <p className={Styles.error_message}>{error || error?.response || error?.response?.data?.error || "Internal Server Error"}</p>
    }
    return (
        <div className={Styles.show_page}>
            <Link className={Styles.brand} to={"/"}>
                <img src={Brand} alt="Brand Logo" />
            </Link>
            <div className={Styles.task_details}>
                <section className={Styles.task_header}>
                    <aside className={Styles.priority_section}>
                        <span className={Styles.priority_indicator} style={{ backgroundColor: task?.priority === "HIGH-PRIORITY" ? '#eb109e' : task?.priority === "MODERATE-PRIORITY" ? '#17A2B8' : '#30bf41' }}></span>
                        <span className={Styles.priority}>{task?.priority.replace(/-/g, ' ').toUpperCase()}</span>
                    </aside>
                </section>
                <p className={Styles.task_title}>{task?.title}</p>
                <section className={Styles.checklists}>
                    <div className={Styles.checklist_dropdown}>
                        <p className={Styles.metrics}>
                            Checklist ({task?.checkLists.filter(item => item.isDone).length}/{task?.checkLists.length})
                        </p>

                    </div>
                    <ul className={Styles.checklists_container}>
                        {
                            task?.checkLists.length > 0 &&
                            task?.checkLists?.map((item, id) => (
                                <li key={id} className={Styles.checklist}>
                                    <div className={Styles.check_item}>
                                        <Checkbox
                                            labelId={id}
                                            isChecked={item?.isDone}
                                        />
                                        <label htmlFor={id}>{item?.tag || ""}</label>
                                    </div>
                                </li>
                            ))

                        }
                    </ul>
                </section>
                {
                    task?.dueDate &&
                    <section className={Styles.task_variables}>
                        <span className={Styles.date_label}>Due Date</span>
                        <span className={Styles.due_date}>
                            {new Date(task?.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(/(\d+)/, (match) => {
                                const suffix = ['th', 'st', 'nd', 'rd'][(match % 10 > 3 || (match % 100 - match % 10 === 10)) ? 0 : match % 10];
                                return match + suffix;
                            })}
                        </span>
                    </section>}
            </div>
        </div >
    )
}

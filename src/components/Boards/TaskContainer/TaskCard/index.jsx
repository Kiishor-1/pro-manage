import { useState, useEffect } from 'react';
import Styles from './TaskCard.module.css';
import { BsThreeDots } from "react-icons/bs";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSelector } from 'react-redux';
import DeleteTask from '../../../Modals/DeleteTask';
import Modal from '../../../Modals';

export default function TaskCard({ task ,setEditTask, collapseAll}) {
    const { user } = useSelector((state) => state.auth);
    const [openChecklist, setOpenChecklist] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [deleteTask, setDeleteTask] = useState(false);

    const handleChecklistDropdown = () => {
        setOpenChecklist(!openChecklist);
    };

    const handleOptionsToggle = () => {
        setShowOptions(!showOptions);
    };

    const allCategories = [
        'Backlog',
        'ToDo',
        'InProgress',
        'Done'
    ];

    useEffect(() => {
        setOpenChecklist(!collapseAll);
    }, [collapseAll]);

    return (
        <div className={Styles.task}>
            <section className={Styles.task_header}>
                <aside className={Styles.priority_section}>
                    <span className={Styles.priority_indicator} style={{ backgroundColor: task?.priority === "HIGH-PRIORITY" ? '#eb109e' : task.priority === "MODERATE-PRIORITY" ? '#17A2B8' : '#30bf41' }}></span>
                    <span className={Styles.priority}>{task?.priority.replace(/-/g, ' ').toUpperCase()}</span>
                    <img src={`https://ui-avatars.com/api/?name=${user?.name || "User"}`} className={Styles.task_assignee} alt="User Avatar" />
                </aside>
                <aside className={Styles.options}>
                    <div className={Styles.option_button} onClick={handleOptionsToggle}>
                        <BsThreeDots />
                    </div>
                    {showOptions && (
                        <div className={Styles.option_container}>
                            <span onClick={()=>setEditTask(true)} className={Styles.option}>Edit</span>
                            <span className={Styles.option}>Share</span>
                            <span onClick={()=>setDeleteTask(true)} className={`${Styles.option} ${Styles.option_delete}`}>Delete</span>
                        </div>
                    )}
                </aside>
            </section>
            <p className={Styles.task_title}>{task?.title}</p>
            <section className={Styles.checklists}>
                <div className={Styles.checklist_dropdown}>
                    <p className={Styles.metrics}>Checklist ({task?.checkLists.length}/{task?.checkLists.length})</p> {/* Adjusted to show checklists length */}
                    <span className={Styles.collapse} onClick={handleChecklistDropdown}>
                        {openChecklist ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                </div>
                {
                    openChecklist && (
                        <ul className={Styles.checklists_container}>
                            {
                                task?.checkLists.length > 0 &&
                                task?.checkLists?.map((item, id) => (
                                    <li key={id} className={Styles.checklist}>
                                        <div className={Styles.check_item}>
                                            <input type="checkbox" id={id} disabled /> {/* Checklist is view-only */}
                                            <label htmlFor={id}>{item}</label>
                                        </div>
                                    </li>
                                ))

                            }
                        </ul>
                    )
                }
            </section>
            <section className={Styles.task_variables}>
                <span className={Styles.due_date}>
                    {new Date(task?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(/(\d+)/, (match) => {
                        const suffix = ['th', 'st', 'nd', 'rd'][(match % 10 > 3 || (match % 100 - match % 10 === 10)) ? 0 : match % 10];
                        return match + suffix;
                    })}
                </span>

                <aside className={Styles.categories}>
                    {
                        allCategories.map((category, id) => {
                            if (category !== task?.category) {
                                return <span key={id}>{category}</span>
                            }
                        })
                    }
                </aside>
            </section>

            {
                deleteTask &&
                <Modal show={deleteTask} onClose={()=>setDeleteTask(false)}>
                    <DeleteTask task={task} setDeleteTask={setDeleteTask}/>
                </Modal>
            }

        </div>
    );
}

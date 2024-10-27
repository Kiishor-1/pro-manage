import { useState, useEffect } from 'react';
import Styles from './TaskCard.module.css';
import ThreeDots from '../../../../assets/images/ThreeDots.svg'
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskCategory } from '../../../../slices/taskSlice';
import DeleteTask from '../../../Modals/DeleteTask';
import Modal from '../../../Modals';
import EditTask from '../../../Modals/EditTask';
import toast from 'react-hot-toast';
import Checkbox from '../../../common/Checkbox';
import separateCamelCase from '../../../../helpers/camelCase';
import { v4 as uuidv4 } from 'uuid';

export default function TaskCard({ task, collapseAll, onCategoryUpdate }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [openChecklist, setOpenChecklist] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [deleteTask, setDeleteTask] = useState(false);
    const [editTask, setEditTask] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState({});
    const [copied, setCopied] = useState(false);
    const { categoryUpdateLoading } = useSelector((state)=>state.tasks);

    const handleChecklistDropdown = () => {
        setOpenChecklist(!openChecklist);
    };

    const handleOptionsToggle = () => {
        setShowOptions(!showOptions);
    };

    const handleCategoryUpdate = async (newCategory) => {
        setLoadingCategories((prev) => ({ ...prev, [newCategory]: true }));

        await dispatch(updateTaskCategory({ taskId: task._id, newCategory }))
            .then(() => {
                setLoadingCategories((prev) => ({ ...prev, [newCategory]: false }));
                onCategoryUpdate();
            })
            .catch(() => {
                setLoadingCategories((prev) => ({ ...prev, [newCategory]: false }));
            });
    };

    const handleShareClick = () => {
        const shareableLink = `${window.location.origin}/tasks/${task._id}`;
        navigator.clipboard.writeText(shareableLink)
            .then(() => {
                setCopied(true);
                toast('Link Coppied', {
                    position: 'top-right',
                    style: {
                        border: '1px solid #48C1B5',
                        padding: '16px 40px',
                        color: 'black',
                        background: '#F6FFF9',
                        fontFamily: 'Poppins',
                    },
                    iconTheme: {
                        primary: '#713200',
                        secondary: '#FFFAEE',
                    },
                });
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((error) => {
                console.error('Failed to copy the link:', error);
            });
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


    const getDueDateClass = () => {
        if (!task?.dueDate) {
            return Styles.due_date_placeholder;
        }

        if (task.category === 'Done') {
            return Styles.done_task;
        }

        const dueDateObj = new Date(task.dueDate);
        const currentDate = new Date();

        if (dueDateObj < currentDate) {
            return ['Backlog', 'InProgress', 'ToDo'].includes(task.category)
                ? Styles.due_date
                : Styles.done_task;
        }

        return Styles.due_date;
    };

    // useEffect(() => {
    //     console.log("editTask:", editTask);  
    // }, [editTask]);


    return (
        <div className={Styles.task}>
            <section className={Styles.task_header}>
                <aside className={Styles.priority_section}>
                    <span className={Styles.priority_indicator} style={{ backgroundColor: task?.priority === "HIGH-PRIORITY" ? '#FF2473' : task.priority === "MODERATE-PRIORITY" ? '#18B0FF' : '#63C05B' }}></span>
                    <span className={Styles.priority}>{task?.priority.replace(/-/g, ' ').toUpperCase()}</span>
                    {
                        task?.assignee &&
                        <img
                            src={`https://ui-avatars.com/api/?background=FFEBEB&color=000000&name=${task?.assignee?.name || "User"}`}
                            alt="User Avatar"
                            className={Styles.task_assignee}
                        />
                    }
                </aside>
                <aside className={Styles.options}>
                    <div className={Styles.option_button} onClick={handleOptionsToggle}>
                        <img src={ThreeDots} alt="menu" />
                    </div>
                    {showOptions && (
                        <div className={Styles.option_container}>
                            <span onClick={() => {
                                setEditTask(true);
                                setShowOptions(false);
                            }} className={Styles.option}>Edit</span>
                            <span onClick={() => {
                                handleShareClick();
                                setShowOptions(false);
                            }} className={`${Styles.option} ${Styles.share}`}>Share</span>
                            <span onClick={() => {
                                setDeleteTask(true);
                                setShowOptions(false);
                            }} className={`${Styles.option} ${Styles.option_delete}`}>Delete</span>
                        </div>

                    )}
                </aside>
            </section>
            <p className={Styles.task_title}>{task?.title}</p>
            <section className={Styles.checklists}>
                <div className={Styles.checklist_dropdown}>
                    <p className={Styles.metrics}>
                        Checklist ({task?.checkLists.filter(item => item.isDone).length}/{task?.checkLists.length})
                    </p>
                    <span className={Styles.collapse} onClick={handleChecklistDropdown}>
                        {openChecklist ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                </div>
                {
                    openChecklist && (
                        <ul className={Styles.checklists_container}>
                            {task?.checkLists.length > 0 &&
                                task?.checkLists.map((item, index) => (
                                    <li key={index} className={Styles.checklist}>
                                        <div className={Styles.check_item}>
                                            <Checkbox
                                                labelId={uuidv4()}
                                                isChecked={item?.isDone}
                                            />
                                            <label htmlFor={`checklist-${index}`} className={Styles.item_label}>
                                                {item?.tag || ""}
                                            </label>
                                        </div>
                                    </li>
                                ))}
                        </ul>

                    )
                }
            </section>
            <section className={Styles.task_variables}>
                <span className={getDueDateClass()}
                >
                    {task?.dueDate
                        ? new Date(task?.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(/(\d+)/, (match) => {
                            const suffix = ['th', 'st', 'nd', 'rd'][(match % 10 > 3 || (match % 100 - match % 10 === 10)) ? 0 : match % 10];
                            return match + suffix;
                        })
                        : null
                    }
                </span>

                <aside className={Styles.categories}>
                    {
                        allCategories.map((category, id) => {
                            if (category !== task?.category) {
                                return (
                                    <span key={id} className={Styles.category_item}>
                                        {loadingCategories[category] ? (
                                            <div className={Styles.loadingSpinner}></div>
                                        ) : (
                                            <button
                                                className={Styles.category_button}
                                                onClick={() => handleCategoryUpdate(category)}
                                            >
                                                {category === 'InProgress' ? 'Progress' : category === 'ToDo' ? 'To-Do' : separateCamelCase(category) || "category"}
                                            </button>
                                        )}
                                    </span>
                                )
                            }
                        })
                    }
                </aside>
            </section>

            {
                deleteTask &&
                <Modal show={deleteTask} onClose={() => setDeleteTask(false)}>
                    <DeleteTask task={task} setDeleteTask={setDeleteTask} />
                </Modal>
            }

            {
                editTask &&
                <Modal show={true}>
                    <EditTask task={task} setEditTask={setEditTask} />
                </Modal>
            }

        </div>
    );
}

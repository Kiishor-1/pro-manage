import TaskCard from '../TaskCard';
import Styles from './TaskCategory.module.css';
import { VscCollapseAll } from "react-icons/vsc";
import { HiMiniPlus } from "react-icons/hi2";
import { useState, useEffect, useRef } from 'react';
import Modal from '../../../Modals';
import AddTask from '../../../Modals/AddTask';
import EditTask from '../../../Modals/EditTask';

export default function TaskCategory({ title, tasks }) {
    const [addTask, setAddTask] = useState(false);
    const [editTask, setEditTask] = useState(false);
    const taskCategoryRef = useRef(null);
    const [hasScroll, setHasScroll] = useState(false);
    const [collapseAll, setCollapseAll] = useState(true);

    const handleCollapseAll = () => {
        setCollapseAll((prev) => !prev);
    };

    useEffect(() => {
        const taskCategoryElement = taskCategoryRef.current;
        if (taskCategoryElement) {
            setHasScroll(taskCategoryElement.scrollHeight > taskCategoryElement.clientHeight);
        }
    }, [tasks]);

    return (
        <div className={Styles.wrapper}>
            <section
                className={Styles.task_category}
                ref={taskCategoryRef}
            >
                <div className={`${Styles.category_header} ${hasScroll ? Styles.balance_padding : ''}`}>
                    <div className={Styles.category_name}>{title || "TaskTitle"}</div>
                    <div className={Styles.collapse_all}>
                        {title == 'ToDo' && <HiMiniPlus onClick={() => setAddTask(true)} />}
                        <VscCollapseAll onClick={handleCollapseAll} />
                    </div>
                </div>
                <div className={`${Styles.all_tasks} ${hasScroll ? Styles.balance_padding : ''}`}>
                    {
                        tasks.length > 0 ? (
                            tasks.map((task, id) => (
                                <TaskCard
                                    id={id}
                                    key={task._id}
                                    task={task}
                                    setEditTask={setEditTask}
                                    collapseAll={collapseAll}
                                />
                            ))
                        ) : (
                            <p className={Styles.no_task}>No tasks created yet</p>
                        )
                    }
                </div>
            </section>
            {
                addTask &&
                <Modal show={addTask} onClose={() => setAddTask(false)}>
                    <AddTask setAddTask={setAddTask} />
                </Modal>
            }
            {
                editTask &&
                <Modal show={editTask} onClose={() => setEditTask(false)}>
                    <EditTask setEditTask={setEditTask} />
                </Modal>
            }
        </div>
    );
}

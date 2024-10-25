import { useSelector, useDispatch } from 'react-redux';
import { fetchUserTasks } from '../../../slices/taskSlice';
import TaskCategory from './TaskCategory';
import { useEffect } from 'react';
import Styles from './TaskContainer.module.css';

export default function TaskContainer() {
    const dispatch = useDispatch();
    const { tasks, loading } = useSelector((state) => state.tasks);

    const categorizedTasks = {
        Backlog: [],
        ToDo: [],
        InProgress: [],
        Done: []
    };

    useEffect(() => {
        dispatch(fetchUserTasks());
    }, [dispatch]);

    tasks?.forEach((task) => {
        if (categorizedTasks.hasOwnProperty(task.category)) {
            categorizedTasks[task.category].push(task);
        }
    });

    const handleCategoryUpdate = () => {
        dispatch(fetchUserTasks()); 
    };

    return (
        <div className={Styles.task_container}>
            {
                Object.entries(categorizedTasks).map(([category, categoryTasks]) => (
                    <TaskCategory
                        key={category}
                        title={category}
                        tasks={categoryTasks}
                        onCategoryUpdate={handleCategoryUpdate} 
                        loading={loading}
                    />
                ))
            }
        </div>
    );
}

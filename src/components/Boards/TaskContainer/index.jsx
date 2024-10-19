import { useEffect, useState } from 'react';
import TaskCategory from './TaskCategory';
import Styles from './TaskContainer.module.css';
import { useDispatch } from 'react-redux';
import { fetchUserTasks } from '../../../slices/taskSlice';

export default function TaskContainer() {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState({
    Backlog: [],
    ToDo: [],
    InProgress: [],
    Done: [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      const userTasks = await dispatch(fetchUserTasks()).unwrap();
      categorizeTasks(userTasks);
    };

    fetchTasks();
  }, [dispatch]);

  const categorizeTasks = (userTasks) => {
    const categorizedTasks = {
      Backlog: [],
      ToDo: [],
      InProgress: [],
      Done: [],
    };

    userTasks.forEach((task) => {
      if (task.category) {
        categorizedTasks[task.category].push(task);
      }
    });

    setTasks(categorizedTasks);
  };

  return (
    <div className={Styles.task_container}>
      <TaskCategory title="Backlog" tasks={tasks.Backlog} />
      <TaskCategory title="ToDo" tasks={tasks.ToDo} />
      <TaskCategory title="InProgress" tasks={tasks.InProgress} />
      <TaskCategory title="Done" tasks={tasks.Done} />
    </div>
  );
}

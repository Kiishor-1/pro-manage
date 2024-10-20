import { useDispatch } from 'react-redux'
import Styles from './DeleteTask.module.css'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { deleteTask } from '../../../slices/taskSlice';

export default function DeleteTask({ setDeleteTask, task }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(deleteTask(task._id));
        navigate('/');
    };

    return (
        <section className={Styles.delete_task}>
            <p className={Styles.confirm}>Are you sure you want to Delete?</p>
            <div className={Styles.destroy_task}>
                <button onClick={handleLogout} className={Styles.submit}>Yes, Delete</button>
                <button onClick={() => setDeleteTask(false)} className={Styles.cancel}>Cancel</button>
            </div>
        </section>
    )
}

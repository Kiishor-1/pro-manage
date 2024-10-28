import { useEffect, useState } from 'react';
import Styles from './EditTask.module.css';
import DatePicker from '../../common/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import Trash from '../../../assets/images/Delete.svg';
import axios from 'axios';
import { USER_ENDPOINTS } from '../../../services/api';
import { useForm } from 'react-hook-form';
import Dropdown from '../../common/Dropdown';
import Checkbox from '../../common/Checkbox';
import Badge from '../../common/Badge';
import { updateTask } from '../../../slices/taskSlice';
import { v4 as uuidv4 } from 'uuid';

const { GET_ALL_USERS } = USER_ENDPOINTS;

export default function EditTask({ setEditTask, task }) {
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors }, setValue, setError, clearErrors } = useForm();

    const [checkLists, setCheckLists] = useState([]);
    const [users, setUsers] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (task) {
            setValue('title', task?.title || "");
            setValue('priority', task?.priority || "");
            setSelectedDate(task?.dueDate ? new Date(task.dueDate) : null);
            setValue('assignee', task?.assignee?.email || "");
            setCheckLists(task?.checkLists || []);
        }
    }, [task, setValue]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await axios.get(GET_ALL_USERS);
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchAllUsers();
    }, []);

    const allUsers = users.filter((currUser) => currUser._id !== user._id);

    const handleTaskAddition = () => {
        const newChecklistItem = { tag: "", isDone: false };
        setCheckLists((prev) => [...prev, newChecklistItem]);
        clearErrors("checkLists");
    };

    const handleChecklistNameChange = (index, newTag) => {
        const updatedChecklists = [...checkLists];
        updatedChecklists[index] = { ...updatedChecklists[index], tag: newTag };
        setCheckLists(updatedChecklists);
    };

    const handleTaskToggle = (index) => {
        const updatedTasks = [...checkLists];
        updatedTasks[index] = { ...updatedTasks[index], isDone: !updatedTasks[index].isDone };
        setCheckLists(updatedTasks);
    };

    const handleTaskDeletion = (index) => {
        const updatedTasks = checkLists.filter((_, i) => i !== index);
        setCheckLists(updatedTasks);
        if (updatedTasks.length === 0) {
            setError("checkLists", {
                type: "manual",
                message: "At least one checklist item is required",
            });
        }
    };

    const handleDateChange = (selectedDate) => {
        setSelectedDate(selectedDate);
    };

    const handleAssignUser = (email) => {
        setValue('assignee', email);
    };

    const onSubmit = async (data) => {
        if (checkLists.length === 0) {
            setError("checkLists", {
                type: "manual",
                message: "At least one checklist item is required",
            });
            return;
        }

        const formData = {
            ...data,
            date: selectedDate,
            checkLists,
        };

        try {
            const res = await dispatch(updateTask({ taskId: task._id, updateData: formData }));
            if (res.type === 'tasks/updateTask/fulfilled') {
                setEditTask(false);
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={Styles.edit_task}>
            <section className={Styles.title}>
                <label className={Styles.title_label}>Title<Badge /></label>
                <input
                    className={Styles.title_input}
                    type="text"
                    name='title'
                    placeholder='Enter Task Title'
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className={Styles.error}>{errors.title.message}</p>}
            </section>

            <section className={Styles.priority}>
                <span className={Styles.priority_heading}>Select Priority<Badge /></span>
                <div className={Styles.select_priority}>
                    <div className={Styles.all_priorities}>
                        <div className={Styles.priority_item}>
                            <input
                                type="radio"
                                name="priority"
                                id="high"
                                value="HIGH-PRIORITY"
                                {...register('priority', { required: "Priority is required" })}
                            />
                            <label htmlFor="high">
                                <span className={Styles.variant_high} ></span>
                                HIGH PRIORITY
                            </label>
                        </div>
                        <div className={Styles.priority_item}>
                            <input
                                type="radio"
                                name="priority"
                                id="moderate"
                                value="MODERATE-PRIORITY"
                                {...register('priority')}
                            />
                            <label htmlFor="moderate">
                                <span className={Styles.variant_moderate} ></span>
                                MODERATE PRIORITY
                            </label>
                        </div>
                        <div className={Styles.priority_item}>
                            <input
                                type="radio"
                                name="priority"
                                id="low"
                                value="LOW-PRIORITY"
                                {...register('priority')}
                            />
                            <label htmlFor="low">
                                <span className={Styles.variant_low} ></span>
                                LOW PRIORITY
                            </label>
                        </div>
                    </div>
                    {errors.priority && <span className={Styles.priority_error}>{errors.priority.message}</span>}
                </div>
            </section>

            <section className={Styles.assignee}>
                <label htmlFor="assignee" className={Styles.assignee_label}>Assign To</label>
                <Dropdown
                    title={"Add a assignee"}
                    onSelect={(email)=>handleAssignUser(email)}
                    heightStyle={{ height: "fit-content" }}
                    options={allUsers.map((user) => ({ email: user.email, name: user?.name }))}
                />
            </section>

            <section className={Styles.checklists}>
                <p>
                    Checklist ({checkLists.filter(item => item.isDone).length}/{checkLists.length})<Badge />
                </p>
                <ul className={Styles.checklist_container}>
                    {checkLists.map((task, index) => (
                        <li key={index} className={Styles.checklist_item}>
                            <Checkbox
                                labelId={uuidv4()}
                                isChecked={task?.isDone}
                                onChange={() => handleTaskToggle(index)}
                            />
                            <input
                                type="text"
                                className={Styles.checklist_input}
                                placeholder="Add a task"
                                value={task.tag}
                                onChange={(e) => handleChecklistNameChange(index, e.target.value)}
                            />
                            <span>
                                <img src={Trash} alt="delete" onClick={() => handleTaskDeletion(index)} />
                            </span>
                        </li>
                    ))}
                </ul>
                {errors.checkLists && <p className={Styles.error}>{errors.checkLists.message}</p>}
                <button className={Styles.add_checklist_btn} type="button" onClick={handleTaskAddition}>
                    + Add New
                </button>
            </section>

            <section className={Styles.task_variables}>
                <div className={Styles.due_date}>
                    <DatePicker
                        selected={selectedDate}
                        onDateChange={handleDateChange}
                        minDate={new Date()}
                    />
                </div>
                <div className={Styles.form_buttons}>
                    <button className={Styles.cancel} onClick={() => setEditTask(false)} type="button">Cancel</button>
                    <button className={Styles.submit} type="submit">Save</button>
                </div>
            </section>
        </form>
    );
}

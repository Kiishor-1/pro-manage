import { useEffect, useState } from 'react';
import Styles from './EditTask.module.css';
import { HiMiniPlus } from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import { getTaskDetails, updateTask } from '../../../slices/taskSlice';
import { FaTrash } from 'react-icons/fa6';
import axios from 'axios';
import { USER_ENDPOINTS } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import Checkbox from '../../common/Checkbox';
import { useForm } from 'react-hook-form';
import Dropdown from '../../common/Dropdown';

const { GET_ALL_USERS } = USER_ENDPOINTS;

export default function EditTask({ setEditTask, taskId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm(); 

    const [checkLists, setCheckLists] = useState([]); 
    const [users, setUsers] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const { task } = useSelector((state) => state.tasks);
    const [selectedDate, setSelectedDate] = useState(null); 


    useEffect(() => {
        if (taskId) {
            dispatch(getTaskDetails(taskId));
        }
    }, [taskId, dispatch]);


    useEffect(() => {
        if (task && taskId) {
            setValue('title', task?.title || "");
            setValue('priority', task?.priority || "");
            setSelectedDate(task?.createdAt ? new Date(task.createdAt) : null);
            setValue('assignee', task?.assignee?.email || "");
            setCheckLists(task?.checkLists || []); 
        }
    }, [task, taskId, setValue]);

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
    };

    const handleDateChange = (selectedDate) => {
        setSelectedDate(selectedDate);
    };

    const handleAssignUser = (email) => {
        setValue('assignee', email);
    };


    const onSubmit = async (data) => {
        console.log(data);
        const formData = {
            ...data,
            date: selectedDate,
            checkLists, 
        };

        // console.log(formData)

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
                <label className={Styles.title_label}>Title</label>
                <input
                    className={Styles.title_input}
                    type="text"
                    name='title'
                    placeholder='Enter Task Title'
                    {...register("title", { required: true })} 
                />
                {errors.title && <p className={Styles.error}>Title is required</p>}
            </section>

 
            <section className={Styles.priority}>
                <span className={Styles.priority_heading}>Select Priority</span>
                <div className={Styles.priority_item}>
                    <input
                        type="radio"
                        name="priority"
                        id="high"
                        value="HIGH-PRIORITY"
                        {...register("priority", { required: true })} 
                    />
                    <label htmlFor="high">HIGH PRIORITY</label>
                </div>
                <div className={Styles.priority_item}>
                    <input
                        type="radio"
                        name="priority"
                        id="moderate"
                        value="MODERATE-PRIORITY"
                        {...register("priority", { required: true })}
                    />
                    <label htmlFor="moderate">MODERATE PRIORITY</label>
                </div>
                <div className={Styles.priority_item}>
                    <input
                        type="radio"
                        name="priority"
                        id="low"
                        value="LOW-PRIORITY"
                        {...register("priority", { required: true })}
                    />
                    <label htmlFor="low">LOW PRIORITY</label>
                </div>
                {errors.priority && <p className={Styles.error}>Priority is required</p>}
            </section>


            <Dropdown
                title={task?.assignee?.email || "Select a user"}
                options={allUsers.map((user) => ({ email: user.email, name: user?.name }))}
                onSelect={(email) => handleAssignUser(email)}
                heightStyle={{height:"fit-content"}}
            />


            <section className={Styles.checklists}>
                <p>
                    Checklist ({checkLists.filter(item => item.isDone).length}/{checkLists.length})
                </p>

                <ul className={Styles.checklist_container}>
                    {checkLists.map((task, index) => (
                        <li key={index} className={Styles.checklist_item}>
                            <Checkbox
                                labelId={index}
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
                                <FaTrash
                                    className={Styles.delete_icon}
                                    onClick={() => handleTaskDeletion(index)}
                                />
                            </span>
                        </li>
                    ))}
                </ul>

                <button className={Styles.add_checklist_btn} type="button" onClick={handleTaskAddition}>
                    + Add New
                </button>
            </section>

            <section className={Styles.task_variables}>
                <div className={Styles.due_date}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        placeholderText="Select Due Date"
                        dateFormat="yyyy/MM/dd"
                        className={Styles.date_picker_input}
                        popperPlacement="bottom-start"
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



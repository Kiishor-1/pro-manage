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

const { GET_ALL_USERS } = USER_ENDPOINTS;

export default function EditTask({ setEditTask, taskId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialData = {
        title: "",
        priority: "",
        checkLists: [],
        date: null,
        assignee: "",
    };

    const [formData, setFormdata] = useState(initialData);
    const [users, setUsers] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const { task } = useSelector((state) => state.tasks);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        if (taskId) {
            dispatch(getTaskDetails(taskId));
        }
    }, [taskId, dispatch]);

    useEffect(() => {
        if (task && taskId) {
            setFormdata({
                title: task?.title || "",
                priority: task?.priority || "",
                checkLists: task?.checkLists || [],
                date: task?.createdAt ? new Date(task.createdAt) : null,
                assignee: task?.assignee?.email || "",
            });
        }
    }, [task, taskId]);


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

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTaskAddition = () => {
        const newChecklistItem = { tag: "", isDone: false };
        const updatedChecklists = [...formData.checkLists, newChecklistItem];
        setFormdata((prev) => ({
            ...prev,
            checkLists: updatedChecklists,
        }));
    };

    const handleChecklistNameChange = (index, newTag) => {
        const updatedChecklists = [...formData.checkLists];
        updatedChecklists[index] = { ...updatedChecklists[index], tag: newTag };
        setFormdata((prev) => ({
            ...prev,
            checkLists: updatedChecklists,
        }));
    };

    const handleTaskToggle = (index) => {
        const updatedTasks = [...formData.checkLists];
        updatedTasks[index] = { ...updatedTasks[index], isDone: !updatedTasks[index].isDone }; 
        setFormdata((prev) => ({
            ...prev,
            checkLists: updatedTasks,
        }));
    };

    const handleTaskDeletion = (index) => {
        const updatedTasks = formData.checkLists.filter((_, i) => i !== index);
        setFormdata((prev) => ({
            ...prev,
            checkLists: updatedTasks,
        }));
    };

    const handleDateChange = (selectedDate) => {
        setFormdata((prev) => ({
            ...prev,
            date: selectedDate,
        }));
    };

    const handleAssignUser = (email) => {
        setFormdata((prev) => ({
            ...prev,
            assignee: email,
        }));
        setShowDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.priority) {
            console.error("Title and Priority are required fields.");
            return;
        }

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
        <form onSubmit={handleSubmit} className={Styles.edit_task}>
            {/* Title Section */}
            <section className={Styles.title}>
                <label className={Styles.title_label}>Title</label>
                <input
                    className={Styles.title_input}
                    type="text"
                    name='title'
                    placeholder='Enter Task Title'
                    value={formData.title}
                    onChange={handleChange}
                />
            </section>


            <section className={Styles.priority}>
                <span className={Styles.priority_heading}>Select Priority</span>
                <div className={Styles.priority_item}>
                    <input
                        type="radio"
                        name="priority"
                        id="high"
                        value="HIGH-PRIORITY"
                        checked={formData.priority === "HIGH-PRIORITY"}
                        onChange={handleChange}
                    />
                    <label htmlFor="high">HIGH PRIORITY</label>
                </div>
                <div className={Styles.priority_item}>
                    <input
                        type="radio"
                        name="priority"
                        id="moderate"
                        value="MODERATE-PRIORITY"
                        checked={formData.priority === "MODERATE-PRIORITY"}
                        onChange={handleChange}
                    />
                    <label htmlFor="moderate">MODERATE PRIORITY</label>
                </div>
                <div className={Styles.priority_item}>
                    <input
                        type="radio"
                        name="priority"
                        id="low"
                        value="LOW-PRIORITY"
                        checked={formData.priority === "LOW-PRIORITY"}
                        onChange={handleChange}
                    />
                    <label htmlFor="low">LOW PRIORITY</label>
                </div>
            </section>


            <section className={Styles.assignee}>
                <span className={Styles.assignee_heading}>Assign to</span>
                <div className={Styles.dropdown}>
                    <aside type="button" onClick={handleDropdownToggle} className={Styles.dropdown_button}>
                        {formData?.assignee || "Select Assignee"}
                    </aside>
                    {showDropdown && (
                        <div className={Styles.dropdown_menu} style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            {
                                allUsers.map((user, index) => (
                                    <div key={index} className={Styles.dropdown_item}>
                                        <div className={Styles.user_dp}>
                                            <img src={`https://ui-avatars.com/api/?background=FFEBEB&color=000000&name=${user?.name || "User"}`} alt="" />
                                            <span>{user.email}</span>
                                        </div>
                                        <button type="button" onClick={() => handleAssignUser(user.email)}>Assign</button>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            <section className={Styles.checklists}>
                <p>
                    Checklist ({formData.checkLists.filter(item => item.isDone).length}/{formData.checkLists.length})
                </p>

                <ul className={Styles.checklist_container}>
                    {formData.checkLists.map((task, index) => (
                        <li key={index} className={Styles.checklist_item}>
                            {/* <input
                                type="checkbox"
                                checked={task.isDone}
                                onChange={() => handleTaskToggle(index)} // Toggle isDone immutably
                            /> */}
                            <Checkbox
                                labelId={index}
                                isChecked={task?.isDone}
                                onChange={()=>handleTaskToggle(index)}
                            />
                            <input
                                type="text"
                                className={Styles.checklist_input}
                                placeholder="Add a task"
                                value={task.tag}
                                onChange={(e) => handleChecklistNameChange(index, e.target.value)} // Change tag immutably
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
                        selected={formData.date}
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


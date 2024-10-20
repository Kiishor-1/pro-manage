import { useEffect, useState } from 'react';
import Styles from './EditTask.module.css';
import { HiMiniPlus } from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../../../slices/taskSlice';
import { FaTrash } from 'react-icons/fa6';
import axios from 'axios';
import { USER_ENDPOINTS } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const { GET_ALL_USERS } = USER_ENDPOINTS;

export default function EditTask({ setEditTask, task }) {
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
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [showNewTaskInput, setShowNewTaskInput] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [users, setUsers] = useState([]);
    const {user} = useSelector((state)=>state.auth);

    useEffect(() => {
        if (task) {
            setFormdata({
                title: task?.title || "",
                priority: task?.priority || "",
                checkLists: task?.checkLists || [],
                date: task?.createdAt ? new Date(task.createdAt) : null,
                assignee: task?.assignee.email || "", // Set initial assignee
            });
            setTasks(task?.checkLists || []);
        }
    }, [task]);

    // console.log('formdata',formData)
    
    useEffect(() => {
        const fetchAllusers = async () => {
            try {
                const response = await axios.get(GET_ALL_USERS);
                console.log(response.data.users);
                setUsers(response.data.users); // Set users after fetching
            } catch (error) {
                console.error("Error fetching users:", error); // Handle error
            }
        };
        fetchAllusers(); // Call the async function
    }, []);

    const allUsers = users.filter((currUser)=>currUser._id !== user._id);
    

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTaskAddition = () => {
        if (newTask.trim()) {
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            setFormdata((prev) => ({
                ...prev,
                checkLists: updatedTasks,
            }));
            setNewTask("");
            setShowNewTaskInput(false);
        }
    };

    const handleTaskDeletion = (taskToDelete) => {
        const updatedTasks = tasks.filter(task => task !== taskToDelete);
        setTasks(updatedTasks);
        setFormdata((prev) => ({
            ...prev,
            checkLists: updatedTasks,
        }));
    };

    const handleDateChange = (selectedDate) => {
        setFormdata((prev) => ({
            ...prev,
            date: selectedDate
        }));
    };

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    };

    const handleAssignUser = (email) => {
        setFormdata((prev) => ({
            ...prev,
            assignee: email,
        }));
        setShowDropdown(false); // Close dropdown after selecting
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('date', formData.date);
        console.log('new date', new Date());
        console.log('formdata' ,formData);
        await dispatch(updateTask({taskId:task._id, updateData:formData})).then(res => {
            console.log(res);
            setEditTask(false);
        }).catch(error => {
            console.log(error);
        });
    };

    // const handleSubmit = () => {
    //     const updateData = {
    //         title: "Bug Fix", // or whatever your title is
    //         priority: "HIGH-PRIORITY",
    //         checkLists: ["Initiate Bug Fix", "Create Debug Plan", "Keep Optimizing"],
    //         date: new Date(), // Ensure this is in the correct format
    //         assignee: "rachel@gmail.com"
    //     };
    
    //     dispatch(updateTask({ taskId: '67140d595d3798f8fb92af2f', updateData }));
    // };
    

    return (
        <form onSubmit={handleSubmit} className={Styles.edit_task}>
            <section className={Styles.title}>
                <label className={Styles.title_label} htmlFor="">Title</label>
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
                        checked={formData.priority === "HIGH-PRIORITY"}  // Pre-select if priority is HIGH-PRIORITY
                        onChange={handleChange}
                    />
                    <label htmlFor="high">
                        HIGH PRIORITY
                    </label>
                </div>
                <div className={Styles.priority_item}>
                    <input
                        type="radio"
                        name="priority"
                        id="moderate"
                        value="MODERATE-PRIORITY"
                        checked={formData.priority === "MODERATE-PRIORITY"}  // Pre-select if priority is MODERATE-PRIORITY
                        onChange={handleChange}
                    />
                    <label htmlFor="moderate">
                        MODERATE PRIORITY
                    </label>
                </div>
                <div className={Styles.priority_item}>
                    <input
                        type="radio"
                        name="priority"
                        id="low"
                        value="LOW-PRIORITY"
                        checked={formData.priority === "LOW-PRIORITY"}  // Pre-select if priority is LOW-PRIORITY
                        onChange={handleChange}
                    />
                    <label htmlFor="low">
                        LOW PRIORITY
                    </label>
                </div>
            </section>


            {/* Assignee Dropdown Section */}
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
                <p>Checklist ({tasks.length}/{tasks.length})</p>
                <ul className={Styles.checklist_container}>
                    {tasks.map((task, index) => (
                        <li key={index}>
                            {task}
                            <span>
                                <FaTrash
                                    className={Styles.delete_icon}
                                    onClick={() => handleTaskDeletion(task)} // Add delete icon functionality
                                />
                            </span>
                        </li>
                    ))}
                </ul>

                <button type="button" onClick={() => setShowNewTaskInput(true)}>
                    <HiMiniPlus />
                    Add new
                </button>

                {showNewTaskInput && (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter new task"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <button type="button" onClick={handleTaskAddition}>
                            Add Task
                        </button>
                    </div>
                )}
            </section>



            <section className={Styles.task_variables}>
                <div className={Styles.due_date}>
                    <DatePicker
                        selected={formData.date}
                        onChange={handleDateChange}
                        placeholderText="Select Due Date"
                        dateFormat="yyyy/MM/dd"
                        className={Styles.date_picker_input}
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

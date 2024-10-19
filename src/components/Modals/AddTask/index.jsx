import { useState } from 'react';
import Styles from './AddTask.module.css';
import { HiMiniPlus } from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from 'react-redux';
import { createTask } from '../../../slices/taskSlice';
import { FaTrash } from 'react-icons/fa6';

export default function AddTask({ setAddTask }) {
    const dispatch = useDispatch();
    const initialData = {
        title: "",
        priority: "",
        checkLists: [],
        date: null,
    };

    const [formData, setFormdata] = useState(initialData);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState(""); 
    const [showNewTaskInput, setShowNewTaskInput] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('formdate',formData)
        await dispatch(createTask(formData)).then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        })
    };

    return (
        <form onSubmit={handleSubmit} className={Styles.add_task}>
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
                        onChange={handleChange}
                    />
                    <label htmlFor="low">
                        LOW PRIORITY
                    </label>
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
                                onClick={() => handleTaskDeletion(task)}
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
                    <button className={Styles.cancel} onClick={() => setAddTask(false)} type="button">Cancel</button>
                    <button className={Styles.submit} type="submit">Save</button>
                </div>
            </section>
        </form>
    );
}

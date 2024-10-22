import { useState } from 'react';
import Styles from './AddTask.module.css';
import { HiMiniPlus } from "react-icons/hi2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from 'react-redux';
import { createTask } from '../../../slices/taskSlice';
import { FaTrash } from 'react-icons/fa6';
import Checkbox from '../../common/Checkbox';

export default function AddTask({ setAddTask }) {
    const dispatch = useDispatch();
    const initialData = {
        title: "",
        priority: "",
        checkLists: [],
        date: null,
    };

    const [formData, setFormdata] = useState(initialData);

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
        updatedChecklists[index].tag = newTag;
        setFormdata((prev) => ({
            ...prev,
            checkLists: updatedChecklists,
        }));
    };


    const handleTaskToggle = (index) => {
        const updatedTasks = [...formData.checkLists];
        updatedTasks[index].isDone = !updatedTasks[index].isDone;
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
            date: selectedDate
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('formdata', formData);
        await dispatch(createTask(formData)).then(res => {
            if (res.type === 'tasks/createTask/fulfilled') {
                setAddTask(false);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <form onSubmit={handleSubmit} className={Styles.add_task}>
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
                        onChange={handleChange}
                    />
                    <label htmlFor="low">LOW PRIORITY</label>
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
                                    onChange={() => handleTaskToggle(index)}
                                /> */}
                                <Checkbox
                                    isChecked={task?.isDone}
                                    labelId={index}
                                    onChange={()=>handleTaskToggle(index)}
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
                        selected={formData.date}
                        onChange={handleDateChange}
                        placeholderText="Select Due Date"
                        dateFormat="yyyy/MM/dd"
                        className={Styles.date_picker_input}
                        popperPlacement="bottom-start"
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


import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Styles from './AddTask.module.css';
import DatePicker from '../../common/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../../../slices/taskSlice';
import Trash from '../../../assets/images/Delete.svg';
import Checkbox from '../../common/Checkbox';
import Dropdown from '../../common/Dropdown';
import axios from 'axios';
import { USER_ENDPOINTS } from '../../../services/api';
import Badge from '../../common/Badge';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const { GET_ALL_USERS } = USER_ENDPOINTS;

export default function AddTask({ setAddTask , onCategoryUpdate}) {
    const dispatch = useDispatch();
    const [checkLists, setCheckLists] = useState([]);
    const [dueDate, setDueDate] = useState(null);
    const [assignee, setAssignee] = useState("");
    const [users, setUsers] = useState([]);
    const { register, handleSubmit, formState: { errors }, setValue, watch, trigger } = useForm({
        defaultValues: {
            title: "",
            priority: "",
            checkLists: [],
            date: null,
            assignee: "",
        },
    });

    const { user } = useSelector((state) => state.auth);

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
        setCheckLists((prev) => [...prev, { tag: "", isDone: false }]);
    };

    const handleChecklistNameChange = (index, newTag) => {
        const updatedChecklists = [...checkLists];
        updatedChecklists[index].tag = newTag;
        setCheckLists(updatedChecklists);
    };

    const handleTaskToggle = (index) => {
        const updatedTasks = [...checkLists];
        updatedTasks[index].isDone = !updatedTasks[index].isDone;
        setCheckLists(updatedTasks);
    };

    const handleTaskDeletion = (index) => {
        const updatedTasks = checkLists.filter((_, i) => i !== index);
        setCheckLists(updatedTasks);
    };

    const handleDateChange = (selectedDate) => {
        setDueDate(selectedDate);
    };

    const handleAssigneeChange = (selectedEmail) => {
        setAssignee(selectedEmail);
    };

    useEffect(() => {
        setValue('checkLists', checkLists);
        register('checkLists', {
            required: "Checklist is required",
            validate: value => value.length >= 1 || "At least one checklist item is required",
        });
        // trigger('checkLists'); // Trigger validation for checkLists field
    }, [checkLists, setValue, trigger, register]);


    const onSubmit = async (data) => {
        if (checkLists.length < 1) {
            toast.error("Please add at least one checklist item.");
            return;
        }

        const taskData = {
            ...data,
            checkLists,
            date: dueDate,
            assignee,
        };

        await dispatch(createTask(taskData)).then((res) => {
            if (res.type === 'tasks/createTask/fulfilled') {
                onCategoryUpdate();
                setAddTask(false);
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={Styles.add_task}>
            <section className={Styles.title}>
                <label className={Styles.title_label}>Title<Badge /></label>
                <input
                    className={Styles.title_input}
                    type="text"
                    name="title"
                    placeholder="Enter Task Title"
                    {...register('title', { required: "Task title is required" })}
                />
                {errors.title && <span className={Styles.error}>{errors.title.message}</span>}
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
                    onSelect={handleAssigneeChange}
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
                                isChecked={task?.isDone}
                                labelId={uuidv4()}
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
                {/* {errors.checkLists && <span className={Styles.error}>{errors.checkLists.message}</span>} */}
                {errors.checkLists && <span className={Styles.error}>At least one checklist item is required</span>}
                <button className={Styles.add_checklist_btn} type="button" onClick={handleTaskAddition}>
                    + Add New
                </button>
            </section>

            <section className={Styles.task_variables}>
                <div className={Styles.due_date}>
                    <DatePicker
                        selected={dueDate}
                        onDateChange={handleDateChange}
                        minDate={new Date()}
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

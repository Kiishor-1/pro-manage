import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { TASK_ENDPOINTS } from '../services/api';
import { USER_ENDPOINTS } from '../services/api';

const {
    CREATE_TASK,
    GET_ALL_TASKS,
    GET_TASK_DETAILS,
    UPDATE_TASK,
    DELETE_TASK
    , UPDATE_CATEGORY
} = TASK_ENDPOINTS;

const { ADD_PEOPLE } = USER_ENDPOINTS;


// Create Task thunk
export const createTask = createAsyncThunk('tasks/createTask', async (taskData, { rejectWithValue, getState }) => {
    const toastId = toast.loading("Creating Task...");
    const { token } = getState().auth; // Get token from auth state
    console.log('taskdata', taskData)
    try {
        const response = await axios.post(CREATE_TASK, taskData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data.success) {
            toast.dismiss(toastId);
            toast.error(response?.data?.message || 'Failed to create task');
            return rejectWithValue(response.data.message || 'Task creation failed');
        }
        toast.dismiss(toastId);
        toast.success('Task created successfully!');
        return response.data.task;
    } catch (error) {
        toast.dismiss(toastId);
        toast.error(error.response?.data?.message || 'Error creating task');
        return rejectWithValue(error.response?.data?.message || 'Task creation error');
    }
});

// Get all tasks thunk
export const fetchUserTasks = createAsyncThunk('tasks/fetchUserTasks', async (_, { rejectWithValue, getState }) => {
    const toastId = toast.loading("Fetching Tasks...");
    const { token } = getState().auth;
    try {
        const response = await axios.get(GET_ALL_TASKS, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data.tasks)

        if (!response.data.success) {
            toast.dismiss(toastId);
            toast.error('Failed to fetch tasks');
            return rejectWithValue('Failed to fetch tasks');
        }

        toast.dismiss(toastId);
        toast.success('Tasks fetched successfully');
        return response.data.tasks;
    } catch (error) {
        console.log(error);
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || 'Error fetching tasks');
        return rejectWithValue(error?.response?.data?.message || 'Error fetching tasks');
    }
});

// Get Task Details thunk
export const getTaskDetails = createAsyncThunk('tasks/getTaskDetails', async (taskId, { rejectWithValue, getState }) => {
    const toastId = toast.loading("Fetching Task Details...");
    const { token } = getState().auth;
    try {
        const response = await axios.get(GET_TASK_DETAILS(taskId), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.data.success) {
            toast.dismiss(toastId);
            toast.error('Failed to fetch task details');
            return rejectWithValue('Failed to fetch task details');
        }

        toast.dismiss(toastId);
        toast.success('Task details fetched successfully');
        return response.data.task;
    } catch (error) {
        console.log(error)
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || 'Error fetching task details');
        return rejectWithValue(error?.response?.data?.message || 'Error fetching task details');
    }
});


// Update Task thunk
export const updateTask = createAsyncThunk('tasks/updateTask', async ({ taskId, updateData }, { rejectWithValue, getState }) => {
    const toastId = toast.loading("Updating Task...");
    const { token } = getState().auth;

    console.log("id", taskId);
    console.log("Update Data:", updateData); // Add this line to verify updateData)

    try {
        const response = await axios.put(UPDATE_TASK(taskId), updateData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.data.success) {
            toast.dismiss(toastId);
            toast.error('Failed to update task');
            return rejectWithValue('Failed to update task');
        }

        toast.dismiss(toastId);
        toast.success('Task updated successfully');
        return response.data.task;
    } catch (error) {
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || 'Error updating task');
        return rejectWithValue(error?.response?.data?.message || 'Error updating task');
    }
});


// Delete Task thunk
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (taskId, { rejectWithValue, getState }) => {
    const toastId = toast.loading("Deleting Task...");
    const { token } = getState().auth;
    try {
        const response = await axios.delete(DELETE_TASK(taskId), {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Delete response', response.data);

        if (!response.data.success) {
            toast.dismiss(toastId);
            toast.error('Failed to delete task');
            return rejectWithValue('Failed to delete task');
        }

        toast.dismiss(toastId);
        toast.success('Task deleted successfully');
        return taskId;
    } catch (error) {
        console.log(error);
        toast.dismiss(toastId);
        toast.error(error?.response?.data?.message || 'Error deleting task');
        return rejectWithValue(error?.response?.data?.message || 'Error deleting task');
    }
});


export const addPeople = createAsyncThunk(
    'tasks/addPeople',
    async (selectedUser, { rejectWithValue, getState }) => {
        const { token } = getState().auth;
        const toastId = toast.loading('Adding people to workspace');
        try {
            const response = await axios.post(ADD_PEOPLE, { email: selectedUser }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.dismiss(toastId)
            return response.data;
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(error.response?.data?.message)
            return rejectWithValue(error.response?.data?.message || 'Failed to add people to tasks');
        }
    }
);

export const updateTaskCategory = createAsyncThunk(
    'tasks/updateTaskCategory',
    async ({ taskId, newCategory }, { rejectWithValue, getState }) => {
        const { token } = getState().auth;
        try {
            const response = await axios.patch(UPDATE_CATEGORY(taskId), { category: newCategory }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Assuming the API response contains the updated task
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update task category');
        }
    }
);

export const fetchFilteredTasks = createAsyncThunk(
    'tasks/fetchFilteredTasks',
    async (filter, { rejectWithValue,getState }) => {
        const {token} = getState().auth;
        try {
            const response = await axios.get(`${GET_ALL_TASKS}?filter=${filter}`, {

                headers: {
                    Authorization: `Bearer ${token}`,
                },

            }); 
            console.log('response',response.data);
            return response.data.tasks;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
        }
    }
);

// Task slice
const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        task: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Create Task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch Tasks
            .addCase(fetchUserTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchUserTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Task Details
            .addCase(getTaskDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTaskDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.task = action.payload;
            })
            .addCase(getTaskDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = state.tasks.filter(task => task._id !== action.payload);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addPeople.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addPeople.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'succeeded';
                // Handle any necessary state updates related to the task here
            })
            .addCase(addPeople.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload;
            }).addCase(updateTaskCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTaskCategory.fulfilled, (state, action) => {
                state.loading = false;
                const updatedTask = action.payload;
                const taskIndex = state.tasks.findIndex((task) => task._id === updatedTask._id);
                if (taskIndex !== -1) {
                    state.tasks[taskIndex] = updatedTask;
                }
            })
            .addCase(updateTaskCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchFilteredTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFilteredTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchFilteredTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default taskSlice.reducer;
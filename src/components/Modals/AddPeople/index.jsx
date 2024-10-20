import { useState, useEffect } from 'react';
import Styles from './AddPeopleModal.module.css';
import Dropdown from '../../common/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { USER_ENDPOINTS } from '../../../services/api';
import axios from 'axios';
import { addPeople } from '../../../slices/taskSlice';


const {GET_ALL_USERS} = USER_ENDPOINTS;

export default function AddPeopleModal({ setAddPeopleModal }) {
    const [success, setSuccess] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); 

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchAllusers = async () => {
            try {
                const response = await axios.get(GET_ALL_USERS);
                console.log(response.data.users);
                setUsers(response.data.users); 
            } catch (error) {
                console.error("Error fetching users:", error); 
            }
        };
        fetchAllusers(); 
    }, []);

    const allUsers = users.filter((currUser)=>currUser._id !== user._id);
    console.log(allUsers);

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedUser) {
            dispatch(addPeople(selectedUser)).then(res=>{
                if(res.type === 'tasks/addPeople/fulfilled'){
                    setSuccess(true);
                }
                
            }).catch(err=>{
                console.log(err);
            })
        }
    };

    return (
        <form onSubmit={handleSubmit} className={Styles.wrapper}>
            {success ? (
                <section className={Styles.success_view}>
                    <p className={Styles.user_added}>{selectedUser || 'User'} added to board</p>
                    <button
                        onClick={() => setAddPeopleModal(false)}
                        className={Styles.submit}
                    >
                        Okay! Got it
                    </button>
                </section>
            ) : (
                <>
                    <label className={Styles.form_label} htmlFor="addPeople">
                        Add people to the board
                    </label>
                    <Dropdown
                        title="Select a user"
                        options={allUsers.map((user) => user.email)}
                        onSelect={handleSelectUser}
                    />
                    <div className={Styles.form_buttons}>
                        <button
                            type="button"
                            className={Styles.cancel}
                            onClick={() => setAddPeopleModal(false)}
                        >
                            Cancel
                        </button>
                        <button className={Styles.submit}>Add User</button>
                    </div>
                </>
            )}
        </form>
    );
}

import Styles from './FilterPage.module.css';
import { LuUsers2 } from "react-icons/lu";
import Modal from '../../Modals';
import AddPeopleModal from '../../Modals/AddPeople';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchFilteredTasks } from '../../../slices/taskSlice';

export default function FilterPage() {
    const [addPeopleModal, setAddPeopleModal] = useState(false);
    const [filter, setFilter] = useState(localStorage.getItem('taskFilter') || 'today'); // Load from local storage
    const dispatch = useDispatch();

    // Fetch tasks whenever the filter changes
    useEffect(() => {
        dispatch(fetchFilteredTasks(filter)); // Dispatch the thunk
        localStorage.setItem('taskFilter', filter); // Save to local storage
    }, [filter, dispatch]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value); // Update filter
    };

    return (
        <div className={Styles.filter_page}>
            <div className={Styles.page_name}>
                Board
                <LuUsers2 className={Styles.add_people} onClick={() => {
                    setAddPeopleModal(true);
                }} />
            </div>

            <div className={Styles.filter_container}>
                <select
                    name="filter"
                    className={Styles.filter}
                    value={filter}
                    onChange={handleFilterChange} // Update filter when user changes selection
                >
                    <option value="today">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                </select>
            </div>


            {addPeopleModal && (
                <Modal show={addPeopleModal} onClose={() => setAddPeopleModal(false)}>
                    <AddPeopleModal setAddPeopleModal={setAddPeopleModal} />
                </Modal>
            )}
        </div>
    );
}

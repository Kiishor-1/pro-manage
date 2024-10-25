import Styles from './FilterPage.module.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilteredTasks } from '../../../slices/taskSlice';
import { FaChevronDown } from "react-icons/fa";
import Modal from '../../Modals';
import AddPeopleModal from '../../Modals/AddPeople';
import AddPeopleIcon from '../../../assets/images/add.svg'

export default function FilterPage() {
    const [addPeopleModal, setAddPeopleModal] = useState(false);
    const [filter, setFilter] = useState(localStorage.getItem('taskFilter') || 'week');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { tasks, loading } = useSelector((state) => state.tasks);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchFilteredTasks(filter));
        localStorage.setItem('taskFilter', filter);
    }, [filter, dispatch]);


    const handleFilterChange = (value) => {
        setFilter(value);
        setIsDropdownOpen(false);
    };

    return (
        <div className={Styles.filter_page}>
            <div className={Styles.page_name}>
                Board
                <section
                    className={Styles.add_people_section}
                    onClick={() => setAddPeopleModal(true)}
                >
                    <img src={AddPeopleIcon} alt="add people" />
                    <span className={Styles.add_people_btn}>Add People</span>
                </section>
            </div>

            <div className={Styles.dropdown_container}>
                <div
                    className={Styles.dropdown_toggle}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'This Month'}
                    <FaChevronDown className={Styles.chevron_icon} />
                </div>

                {isDropdownOpen && (
                    <div className={Styles.dropdown_menu}>
                        <div
                            className={Styles.dropdown_item}
                            onClick={() => handleFilterChange('today')}
                        >
                            Today
                        </div>
                        <div
                            className={Styles.dropdown_item}
                            onClick={() => handleFilterChange('week')}
                        >
                            This Week
                        </div>
                        <div
                            className={Styles.dropdown_item}
                            onClick={() => handleFilterChange('month')}
                        >
                            This Month
                        </div>
                    </div>
                )}
            </div>

            {addPeopleModal && (
                <Modal show={addPeopleModal} onClose={() => setAddPeopleModal(false)}>
                    <AddPeopleModal setAddPeopleModal={setAddPeopleModal} />
                </Modal>
            )}
        </div>
    );
}

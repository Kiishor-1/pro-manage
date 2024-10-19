import Styles from './FilterPage.module.css';
import { LuUsers2 } from "react-icons/lu";
import Modal from '../../Modals';
import AddPeopleModal from '../../Modals/AddPeople';
import { useState } from 'react';
export default function FilterPage() {
    const [addPeopleModal, setAddPeopleModal] = useState(false);
    return (
        <div className={Styles.filter_page}>
            <div className={Styles.page_name}>
                Board
                <LuUsers2 className={Styles.add_people} onClick={() => {
                    setAddPeopleModal(true);
                }} />

            </div>
            <div className={Styles.filter_container}>
                <select name="filter" className={Styles.filter} defaultValue="today">
                    <option value="today">Today</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                </select>

            </div>

            {
                addPeopleModal &&
                <Modal show={addPeopleModal} onClose={() => setAddPeopleModal(false)}>
                    <AddPeopleModal setAddPeopleModal={setAddPeopleModal} />
                </Modal>
            }

        </div>
    )
}




import { NavLink } from 'react-router-dom';
import { FiLayout, FiSettings } from "react-icons/fi";
import { PiCodesandboxLogoLight } from "react-icons/pi";
import { GoDatabase } from "react-icons/go";
import Styles from '../../pages/Dashboard/Dashboard.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { HiOutlineLogout } from 'react-icons/hi';
import Modal from '../Modals';
import Logout from '../Modals/Logout';

const Sidebar = () => {
    const [logout, setLogout] = useState(false);

    return (
        <div className={Styles.sidebar}>
            <Link className={Styles.dashHome} to={"/"}>
                <PiCodesandboxLogoLight />
                Pro Manage
            </Link>

            <div className={Styles.navigation}>
                <div className={Styles.nav_links}>
                    <NavLink
                        className={({ isActive }) => isActive ? `${Styles.nav_item} ${Styles.active}` : Styles.nav_item}
                        to={"/dashboard"}
                        end
                    >
                        <FiLayout />
                        Boards
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => isActive ? `${Styles.nav_item} ${Styles.active}` : Styles.nav_item}
                        to={"/dashboard/analytics"}
                    >
                        <GoDatabase />
                        Analytics
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => isActive ? `${Styles.nav_item} ${Styles.active}` : Styles.nav_item}
                        to={"/dashboard/settings"}
                    >
                        <FiSettings />
                        Settings
                    </NavLink>
                </div>

                <div className={Styles.logout_container}>
                    <HiOutlineLogout />
                    <button onClick={() => setLogout(true)} className={Styles.logout}>Log out</button>
                </div>
            </div>

            {
                logout && (
                    <Modal show={logout} onClose={() => setLogout(false)}>
                        <Logout setLogout={setLogout} />
                    </Modal>
                )
            }

        </div>
    );
};


export default Sidebar;
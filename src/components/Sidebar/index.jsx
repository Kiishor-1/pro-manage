import { NavLink } from 'react-router-dom';
import { FiLayout, FiSettings } from "react-icons/fi";
import { GoDatabase } from "react-icons/go";
import Styles from '../../pages/Dashboard/Dashboard.module.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../Modals';
import Logout from '../Modals/Logout';
import Logo from '../../assets/images/Brand.svg'
import LogoutIcon from '../../assets/images/Logout.svg'

const Sidebar = () => {
    const [logout, setLogout] = useState(false);

    return (
        <div className={Styles.sidebar}>
            <Link className={Styles.dashHome} to={"/"}>
                <img src={Logo} alt="" />
                Pro Manage
            </Link>

            <div className={Styles.navigation}>
                <div className={Styles.nav_links}>
                    <NavLink
                        className={({ isActive }) => isActive ? `${Styles.nav_item} ${Styles.active}` : Styles.nav_item}
                        to={"/dashboard"}
                        end
                    >
                        <FiLayout fontSize={"1.35rem"} />
                        Boards
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => isActive ? `${Styles.nav_item} ${Styles.active}` : Styles.nav_item}
                        to={"/dashboard/analytics"}
                    >
                        <GoDatabase fontSize={"1.35rem"}  />
                        Analytics
                    </NavLink>

                    <NavLink
                        className={({ isActive }) => isActive ? `${Styles.nav_item} ${Styles.active}` : Styles.nav_item}
                        to={"/dashboard/settings"}
                    >
                        <FiSettings fontSize={"1.35rem"}  />
                        Settings
                    </NavLink>
                </div>

                <div className={Styles.logout_container}>
                    <img src={LogoutIcon} alt="logout" />
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
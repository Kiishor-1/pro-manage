import { NavLink, useNavigate } from 'react-router-dom';
import { FiLayout, FiSettings } from "react-icons/fi";
import { PiCodesandboxLogoLight } from "react-icons/pi";
import { GoDatabase } from "react-icons/go";
import { HiOutlineLogout } from "react-icons/hi";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';
import Styles from '../../pages/Dashboard/Dashboard.module.css';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        toast.success('User logged out successfully');
        navigate('/');
    };

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
                    <button onClick={handleLogout} className={Styles.logout}>Log out</button>
                </div>
            </div>
        </div>
    );
};


export default Sidebar;
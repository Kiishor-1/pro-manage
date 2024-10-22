import { useDispatch } from 'react-redux'
import Styles from './Logout.module.css'
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../slices/authSlice';
import toast from 'react-hot-toast';

export default function Logout({ setLogout }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        const result = dispatch(logout());
        if (result) {
          toast.success('User logged out successfully');
          setLogout(false);
          navigate('/');
        } else {
          toast.error('Logout failed');
        }
      };

    return (
        <section className={Styles.logout}>
            <p className={Styles.confirm}>Are you sure you want to Logout?</p>
            <div className={Styles.destroy_session}>
                <button onClick={handleLogout} className={Styles.submit}>Yes, Logout</button>
                <button onClick={() => setLogout(false)} className={Styles.cancel}>Cancel</button>
            </div>
        </section>
    )
}

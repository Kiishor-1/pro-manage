import { useDispatch, useSelector } from 'react-redux';
import Styles from './Logout.module.css';
import { useNavigate } from 'react-router-dom';
import { logoutUser, setIsLoading } from '../../../slices/authSlice';

export default function Logout({ setLogout }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLoading);

  const handleLogout = async () => {
    dispatch(setIsLoading(true));

    const result = await dispatch(logoutUser());
    dispatch(setIsLoading(false));

    if (result.payload) {
      setLogout(false);
      navigate('/');
    }
  };

  return (
    <section className={Styles.logout}>
      <p className={Styles.confirm}>Are you sure you want to Logout?</p>
      <div className={Styles.destroy_session}>
        <button onClick={handleLogout} className={Styles.submit} disabled={isLoading}>
          {isLoading ? 'Logging Out...' : 'Yes, Logout'}
        </button>
        <button onClick={() => setLogout(false)} className={Styles.cancel}>Cancel</button>
      </div>
    </section>
  );
}
import { Outlet, useNavigate } from 'react-router-dom';
import Styles from './Dashboard.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { logout } from '../../slices/authSlice';
import { isTokenExpired } from '../../slices/authSlice';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user || isTokenExpired(token)) {
      navigate('/');
      dispatch(logout());
    }
  }, [token, user, navigate, dispatch]);


  return (
    <div className={Styles.dashboard}>
      <div>
        <Sidebar />
      </div>
      <div className={Styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

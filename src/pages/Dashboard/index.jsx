import { Outlet, useNavigate } from 'react-router-dom';
import Styles from './Dashboard.module.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token || !user) {
      navigate('/');
    }
  }, [token, user, navigate]);

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

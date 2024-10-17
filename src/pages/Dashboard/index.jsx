import { Outlet ,Link} from 'react-router-dom'
import Styles from './Dashboard.module.css';

export default function Dashboard() {
  return (
    <div className={Styles.dashboard}>
      <div>
        <Sidebar />
      </div>
      <div className={Styles.content}>
        <Outlet />
      </div>
    </div>
  )
}


const Sidebar = () => {
  return (
    <div className={Styles.sidebar}>
      <Link className={Styles.dashHome} to={"/dashboard"}>Sidebar</Link>
    </div>
  )
}
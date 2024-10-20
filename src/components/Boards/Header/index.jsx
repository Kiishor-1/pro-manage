import { useSelector } from 'react-redux';
import Styles from './Header.module.css';
import { formatDate } from '../../../helpers/formatDate';

export default function Header() {
    const { user } = useSelector((state) => state.auth);
    const currentDate = new Date();
    return (
        <div className={Styles.header}>
            <div className={Styles.greet}>
                Welcome! {user?.name.split(" ")[0] || 'User'}
            </div>
            <div className={Styles.current_date}>
                {formatDate(currentDate)}
            </div>
        </div>
    )
}

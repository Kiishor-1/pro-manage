import { useSelector } from 'react-redux';
import Styles from './Header.module.css';
import { formatDate } from '../../../helpers/formatDate';
import toast from 'react-hot-toast';

export default function Header() {
    const { user } = useSelector((state) => state.auth);
    const currentDate = new Date();
    const handleToast = () => {
        toast('Link Coppied', {
            position: 'top-right',
            style: {
                border: '1px solid #48C1B5',
                padding: '13px 16px',
                color: 'black',
                background: '#F6FFF9',
                fontFamily: 'Poppins',
            },
            iconTheme: {
                primary: '#713200',
                secondary: '#FFFAEE',
            },
        });
    }
    return (
        <div className={Styles.header}>
            <div className={Styles.greet} onClick={handleToast}>
                Welcome! {user?.name.split(" ")[0] || 'User'}
            </div>
            <div className={Styles.current_date}>
                {formatDate(currentDate)}
            </div>
        </div>
    )
}

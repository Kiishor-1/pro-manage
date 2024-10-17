import Styles from './NotFound.module.css'; // Optional: create a CSS module for styles
import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <div className={Styles.notFound}>
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link className={Styles.home_button} to="/">Go back to Home</Link>
    </div>
  );
};

export default NotFound;


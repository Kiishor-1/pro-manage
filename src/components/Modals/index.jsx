import Styles from './Modal.module.css'
const Modal = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className={Styles.modal}>
            <div className={Styles.modal_body}>
                {/* <button onClick={onClose} className={Styles.modal_dismiss}>&times;</button> */}
                {
                    children
                }
            </div>
        </div>
    );
};

export default Modal;
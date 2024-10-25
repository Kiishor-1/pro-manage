import Styles from './Checkbox.module.css';
import CheckMark from '../../../assets/images/check.svg'

export default function Checkbox({ isChecked, labelId, onChange }) {
    return (
        <div className={Styles.custom_label}>
            <input
                className={Styles.checkbox}
                checked={isChecked || false}
                type="checkbox"
                id={labelId}
                onChange={onChange}
                readOnly={!onChange}
            />
            <label htmlFor={labelId} className={Styles.checkbox_label}>
                <img src={CheckMark} alt="check mark" />
            </label>
        </div>
    );
}


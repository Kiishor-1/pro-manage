import { useEffect, useRef, useState } from 'react';
import Styles from './DatePicker.module.css';

export default function DatePicker({ onDateChange, selected }) {
    const dateRef = useRef(null);
    const [label, setLabel] = useState("Select Date");

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (selected) {
            const date = new Date(selected);
            const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            setLabel(formattedDate);
        }
    }, [selected]);

    const handleOpenPicker = () => {
        if (dateRef.current) {
            setTimeout(() => dateRef.current.showPicker(), 100);
        }
    };

    const handleChange = (e) => {
        const dateValue = e.target.value;
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
            const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            setLabel(formattedDate);
            onDateChange && onDateChange(dateValue);
        } else {
            setLabel("Select Date");
            onDateChange && onDateChange(null);
        }
    };

    return (
        <div className={Styles.date_picker}>
            <button
                type='button'
                onClick={handleOpenPicker}
                className={Styles.select_date_button}
            >
                {label}
            </button>
            <input
                type="date"
                ref={dateRef}
                onChange={handleChange}
                className={Styles.hidden_date_input}
                min={getTodayDate()}
            />
        </div>
    );
}

import React, { useState } from 'react';

const DatePicker = () => {
    const [selectedDate, setSelectedDate] = useState('');

    const handleChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <div style={{ margin: '20px' }}>
            {/* <label 
                htmlFor="date-picker" 
                style={{ cursor: 'pointer', display: 'block', marginBottom: '8px' }}
            >
                Select a date
            </label> */}
            <input
                type="date"
                id="date-picker"
                value={selectedDate}
                placeholder='Choose Date'
                onChange={handleChange}
                style={{
                    appearance: 'none', 
                    padding: '8px 12px',
                    backgroundColor: 'white',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    userSelect:'none'
                }}
            />
            {selectedDate ? (
                <div style={{ marginTop: '8px' }}>
                    {new Date(selectedDate).toLocaleDateString()}
                </div>):('Choose Date')
            }
        </div>
    );
};

export default DatePicker;

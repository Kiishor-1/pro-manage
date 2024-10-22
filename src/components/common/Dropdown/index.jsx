import React, { useState } from 'react';
import styles from './Dropdown.module.css';

const Dropdown = ({ title, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(title);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  // console.log(options)

  return (

    <div className={styles.dropdown}>
      <button className={styles.dropdownButton} onClick={toggleDropdown}>
        {selectedOption}
        <span className={isOpen ? styles.arrowUp : styles.arrowDown}></span>
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {
            options.length > 0 ? (
              options.map((option, index) => (
                <div
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => handleSelect(option.email)}
                >
                  <section className={styles.user}>
                    <img src={`https://ui-avatars.com/api/?background=FFEBEB&color=000000&name=${option?.name || "User"}`} alt="" />
                    <span>{option?.email}</span>
                  </section>
                </div>
              ))
            ):(
              <p className={styles.no_user_case}>No User Found</p>
            )
          }
        </div>
      )}
    </div>
  );
};

export default Dropdown;

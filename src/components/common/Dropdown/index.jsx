import { useEffect, useState } from 'react';
import styles from './Dropdown.module.css';

const Dropdown = ({ title, options, onSelect, btnText, heightStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(title);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    if (title) {
      setSelectedOption(title);
    }
  }, [title])

  return (

    <div className={styles.dropdown} style={heightStyle}>
      <button type='button' className={styles.dropdownButton} onClick={toggleDropdown}>
        <span className={selectedOption === title ? styles.option_color1:styles.option_color2}>{selectedOption}</span>
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
                >
                  <section className={styles.user}>
                    <div className={styles.user_dp}>
                      <img src={`https://ui-avatars.com/api/?background=FFEBEB&color=000000&name=${option?.name || "User"}`} alt="" />
                      <span>{option?.email}</span>
                    </div>
                    <button onClick={() => handleSelect(option.email)} className={styles.assign_user_button} type='button'>{btnText ? btnText : "Assign"}</button>
                  </section>
                </div>
              ))
            ) : (
              <p className={styles.no_user_case}>No User Found</p>
            )
          }
        </div>
      )}
    </div>
  );
};

export default Dropdown;

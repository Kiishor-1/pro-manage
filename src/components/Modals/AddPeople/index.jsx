import { useState } from 'react';
import Styles from './AddPeopleModal.module.css';

export default function AddPeopleModal({ setAddPeopleModal }) {
    const [sucess, setSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccess(true);
    }
    return (
        <form onSubmit={handleSubmit} className={Styles.wrapper}>
            {
                sucess ? (
                    <section className={Styles.success_view}>
                        <p className={Styles.user_added}>{email || 'User'} added to board</p>
                        <button onClick={()=>setAddPeopleModal(false)} className={Styles.submit}>Okay! Got it</button>
                    </section>
                ) : (
                    <>
                        <label className={Styles.form_label} htmlFor="addPeople">Add people to the board </label>
                        <input
                            className={Styles.form_input}
                            type="email"
                            name='email'
                            value={email}
                            onChange={handleEmail}
                            id='addPeople'
                            placeholder='Enter the email'
                        />
                        <div className={Styles.form_buttons}>
                            <button type='button' className={Styles.cancel} onClick={() => setAddPeopleModal(false)}>Cancel</button>
                            <button className={Styles.submit}>Add Email</button>
                        </div>
                    </>
                )
            }
        </form>
    )
}

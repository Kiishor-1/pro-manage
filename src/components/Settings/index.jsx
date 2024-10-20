import { HiOutlineEnvelope, HiOutlineUser } from 'react-icons/hi2';
import Styles from './Settings.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { SlLock } from 'react-icons/sl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../slices/authSlice';


export default function Settings() {
  const dispatch = useDispatch();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const initialValue = {
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  };
  const [formData, setFormData] = useState(initialValue);


  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      oldPassword: "",
      newPassword: "",
    });
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => {
      const { value, name } = e.target;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleOldPasswordView = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleNewPasswordView = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUser(formData));
  };

  return (
    <div className={Styles.settings_page}>
      <p className={Styles.page_name}>Settings</p>
      <form onSubmit={handleSubmit} className={Styles.update_user_data}>
        <div className={Styles.inputs}>
          <div>
            <input type="text" name='name' placeholder='Name' value={formData.name} onChange={handleChange} />
            <span className={Styles.icon1}>
              <HiOutlineUser />
            </span>
          </div>
          <div>
            <input type="email" name='email' placeholder='Enter Email' value={formData.email} onChange={handleChange} />
            <span className={Styles.icon1}>
              <HiOutlineEnvelope />
            </span>
          </div>
          <div>
            <input type={`${showOldPassword ? "text" : "password"}`} name='oldPassword' placeholder='Enter Old Password' value={formData.oldPassword} onChange={handleChange} />
            <span className={Styles.icon1}>
              <SlLock />
            </span>
            <span className={Styles.icon2} onClick={handleOldPasswordView}>
              {showOldPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          <div>
            <input type={`${showNewPassword ? "text" : "password"}`} name='newPassword' placeholder='Enter New Password' value={formData.newPassword} onChange={handleChange} />
            <span className={Styles.icon1}>
              <SlLock />
            </span>
            <span className={Styles.icon2} onClick={handleNewPasswordView}>
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>
        <button className={Styles.update}>Update</button>
      </form>
    </div>
  );
}

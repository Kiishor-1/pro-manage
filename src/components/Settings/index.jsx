import { HiOutlineEnvelope, HiOutlineUser } from 'react-icons/hi2';
import Styles from './Settings.module.css';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { SlLock } from 'react-icons/sl';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'; // Import react-hook-form
import { toast } from 'react-hot-toast'; // For notifications

export default function Settings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      oldPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    setValue('name', user?.name || "");
    setValue('email', user?.email || "");
  }, [user, setValue]);


  const handleOldPasswordView = () => setShowOldPassword(!showOldPassword);
  const handleNewPasswordView = () => setShowNewPassword(!showNewPassword);


  const validatePasswordFields = (value, watchAllFields) => {
    const oldPassword = watchAllFields.oldPassword;
    const newPassword = watchAllFields.newPassword;

    if ((oldPassword && !newPassword) || (!oldPassword && newPassword)) {
      return "Both old and new passwords must be provided.";
    }

    return true; 
  };

  const onSubmit = (formData) => {
    if (!formData.name && !formData.email && !formData.oldPassword && !formData.newPassword) {
      toast.error("Please update at least one field.");
      return;
    }
    
    dispatch(updateUser(formData));
  };

  return (
    <div className={Styles.settings_page}>
      <p className={Styles.page_name}>Settings</p>
      <form onSubmit={handleSubmit(onSubmit)} className={Styles.update_user_data}>
        <div className={Styles.inputs}>
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register('name')}
              className={errors.name ? Styles.input_error : ''}
            />
            <span className={Styles.icon1}>
              <HiOutlineUser />
            </span>
            {errors.name && <p className={Styles.error_message}>{errors.name.message}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Enter Email"
              {...register('email')}
              className={errors.email ? Styles.input_error : ''}
            />
            <span className={Styles.icon1}>
              <HiOutlineEnvelope />
            </span>
            {errors.email && <p className={Styles.error_message}>{errors.email.message}</p>}
          </div>

          <div>
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter Old Password"
              {...register('oldPassword', {
                validate: (value) => validatePasswordFields(value, watch())
              })}
              className={errors.oldPassword ? Styles.input_error : ''}
            />
            <span className={Styles.icon1}>
              <SlLock />
            </span>
            <span className={Styles.icon2} onClick={handleOldPasswordView}>
              {showOldPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            {errors.oldPassword && <p className={Styles.error_message} style={{fontSize:"1rem",color:"red",margin:"0"}}>{errors.oldPassword.message}</p>}
          </div>

          <div>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter New Password"
              {...register('newPassword', {
                validate: (value) => validatePasswordFields(value, watch())
              })}
              className={errors.newPassword ? Styles.input_error : ''}
            />
            <span className={Styles.icon1}>
              <SlLock />
            </span>
            <span className={Styles.icon2} onClick={handleNewPasswordView}>
              {showNewPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            {errors.newPassword && <p className={Styles.error_message} style={{fontSize:"1rem",color:"red",margin:"0"}}>{errors.newPassword.message}</p>}
          </div>
        </div>

        <button type="submit" className={Styles.update}>
          Update
        </button>
      </form>
    </div>
  );
}

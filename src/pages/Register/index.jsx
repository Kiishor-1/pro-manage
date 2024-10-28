import { Link, useNavigate } from 'react-router-dom';
import Styles from './Register.module.css';
import AuthImage from '../../assets/images/authImage.png';
import Mail from '../../assets/images/email.svg';
import Eye from '../../assets/images/show.svg';
import EyeOff from '../../assets/images/hide.svg';
import User from '../../assets/images/Profile.svg';
import Lock from '../../assets/images/lock.svg';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../slices/authSlice';
import { isStrongPassword } from '../../helpers/isStrongPassword';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      navigate('/dashboard');
    }
  }, [user, token, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const initialValue = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formData, setFormData] = useState(initialValue);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordView = () => setShowPassword(!showPassword);
  const handleConfirmPasswordView = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
  
    if (formData.password && !isStrongPassword(formData.password)) {
      newErrors.password = "Password does not meet the strength requirements";
    }
  
    setErrors(newErrors);

    const errorMessages = Object.values(newErrors);
    if (errorMessages.length > 0) {
      toast.error(errorMessages[0]);
    }
  
    if (Object.keys(newErrors).length === 0) {
      dispatch(registerUser(formData))
        .then((result) => {
          if (result.type === 'auth/registerUser/fulfilled') {
            setFormData(initialValue);
            navigate('/');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  

  return (
    <div className={Styles.register}>
      <div className={Styles.authBannerSection}>
        <div className={Styles.auth_image_container}>
          <div className={Styles.circle}></div>
          <div className={Styles.banner_container}>
            <img className={Styles.banner} src={AuthImage} alt="auth Image" />
          </div>
        </div>
        <h2>Welcome aboard my friend</h2>
        <p>Just a couple of clicks and we start</p>
      </div>
      <div className={Styles.auth_form_container}>
        <form onSubmit={handleSubmit} className={Styles.register__form}>
          <p className={Styles.heading}>Register</p>
          <div className={Styles.inputs}>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
              <span className={Styles.icon1}>
                <img src={User} alt="user" />
              </span>
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <span className={`${Styles.icon1} ${Styles.icon1_email}`}>
                <img className={Styles.email_icon} src={Mail} alt="email" />
              </span>
            </div>
            <div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <span className={Styles.icon1}>
                <img src={Lock} alt="lock" />
              </span>
              <span className={Styles.icon2}>
                {showPassword ? (
                  <img src={EyeOff} onClick={handlePasswordView} alt="hide" />
                ) : (
                  <img src={Eye} onClick={handlePasswordView} alt="show" />
                )}
              </span>
            </div>
            <div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <span className={Styles.icon1}>
                <img src={Lock} alt="lock" />
              </span>
              <span className={Styles.icon2}>
                {showConfirmPassword ? (
                  <img src={EyeOff} onClick={handleConfirmPasswordView} alt="hide" />
                ) : (
                  <img src={Eye} onClick={handleConfirmPasswordView} alt="show" />
                )}
              </span>
            </div>
          </div>
          <div className={Styles.button_groups}>
            <button className={Styles.auth_register}>Register</button>
            <Link className={Styles.account_check} to={"/"}>
              Have an account?
            </Link>
            <Link to={"/"} className={Styles.auth_login}>
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

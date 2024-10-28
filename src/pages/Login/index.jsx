import { Link, useNavigate } from 'react-router-dom';
import Styles from './Login.module.css';
import AuthImage from '../../assets/images/authImage.png';
import Mail from '../../assets/images/email.svg';
import Eye from '../../assets/images/show.svg';
import EyeOff from '../../assets/images/hide.svg';
import Lock from '../../assets/images/lock.svg';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../slices/authSlice';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      navigate('/dashboard');
    }
  }, [user, token, navigate]);

  const initialValue = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialValue);

  const handleChange = (e) => {
    setFormData((prev) => {
      const { value, name } = e.target;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handlePasswordView = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    // Show a toast for each specific error
    Object.values(newErrors).forEach(error => toast.error(error));

    if (Object.keys(newErrors).length === 0) {
      dispatch(login(formData))
        .then((result) => {
          if (result.type === 'auth/login/fulfilled') {
            setFormData(initialValue);
            navigate('/dashboard');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className={Styles.login}>
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
        <form onSubmit={handleSubmit} className={Styles.login__form}>
          <p className={Styles.heading}>Login</p>
          <div className={Styles.inputs}>
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
                <img src={Lock} alt="lock icons" />
              </span>
              <span className={Styles.icon2}>
                {showPassword ? (
                  <img onClick={handlePasswordView} src={EyeOff} alt="hide" />
                ) : (
                  <img onClick={handlePasswordView} src={Eye} alt="show" />
                )}
              </span>
            </div>
          </div>
          <div className={Styles.button_groups}>
            <button className={Styles.auth_login}>Log in</button>
            <Link className={Styles.account_check} to={"/"}>Have no account yet?</Link>
            <Link to={"/register"} className={Styles.auth_register}>Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

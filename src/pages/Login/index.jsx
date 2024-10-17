import { Link, useNavigate } from 'react-router-dom';
import Styles from './Login.module.css';
import AuthImage from '../../assets/images/authImage.png'
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { SlLock } from 'react-icons/sl';
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
  }
  const [formData, setFormData] = useState(initialValue);

  const handleChange = (e) => {
    setFormData((prev) => {
      const { value, name } = e.target;
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handlePasswordView = () => {
    setShowPassword(!showPassword);
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Provide all the required data');
      return;
    }
    console.log("formData is: ", formData);

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
        <p>just a couple of clicks and we start</p>
      </div>
      <div className={Styles.auth_form_container}>
        <form onSubmit={handleSubmit} className={Styles.login__form}>
          <p className={Styles.heading}>Login</p>
          <div className={Styles.inputs}>
            <div>
              <input type="email" name='email' value={formData.email} onChange={handleChange} />
              <span className={Styles.icon1}>
                <HiOutlineEnvelope />
              </span>
            </div>
            <div>
              <input type={`${showPassword ? "text" : "password"}`} name='password' value={formData.password} onChange={handleChange} />
              <span className={Styles.icon1}>
                <SlLock />
              </span>
              <span className={Styles.icon2}>
                {showPassword ? <FiEyeOff onClick={handlePasswordView} /> : <FiEye onClick={handlePasswordView} />}
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
  )
}
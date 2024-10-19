import { Link, useNavigate } from 'react-router-dom';
import Styles from './Register.module.css';
import AuthImage from '../../assets/images/authImage.png'
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi";
import { SlLock } from 'react-icons/sl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../slices/authSlice';


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
  const handleConfirmPasswordView = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Provide all the required fields');
      return;
    }

    console.log("formData is: ", formData);

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
        <p>just a couple of clicks and we start</p>
      </div>
      <div className={Styles.auth_form_container}>
        <form onSubmit={handleSubmit} className={Styles.register__form}>
          <p className={Styles.heading}>Register</p>
          <div className={Styles.inputs}>
            <div className="">
              <input type="text" name='name' value={formData.name} onChange={handleChange} />
              <span className={Styles.icon1}>
                <HiOutlineUser />
              </span>
            </div>
            <div className="">
              <input type="email" name='email' value={formData.email} onChange={handleChange} />
              <span className={Styles.icon1}>
                <HiOutlineEnvelope />
              </span>
            </div>
            <div className="">
              <input type={`${showPassword ? "text" : "password"}`} name='password' value={formData.password} onChange={handleChange} />
              <span className={Styles.icon1}>
                <SlLock />
              </span>
              <span className={Styles.icon2}>
                {showPassword ? <FiEyeOff onClick={handlePasswordView} /> : <FiEye onClick={handlePasswordView} />}
              </span>
            </div>
            <div className="">
              <input type={`${showConfirmPassword ? "text" : "password"}`} name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} />
              <span className={Styles.icon1}>
                <SlLock />
              </span>
              <span className={Styles.icon2}>
                {showConfirmPassword ? <FiEyeOff onClick={handleConfirmPasswordView} /> : <FiEye onClick={handleConfirmPasswordView} />}
              </span>
            </div>
          </div>
          <div className={Styles.button_groups}>
            <button className={Styles.auth_register}>Register</button>
            <Link className={Styles.account_check} to={"/"}>Have an account?</Link>
            <Link to={"/"} className={Styles.auth_login}>Log in</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

import { Link, useNavigate } from 'react-router-dom';
import Styles from './Register.module.css';
import AuthImage from '../../assets/images/authImage.png'
import Mail from '../../assets/images/email.svg';
import Eye from '../../assets/images/show.svg'
import EyeOff from '../../assets/images/hide.svg'
import User from '../../assets/images/Profile.svg'
import Lock from '../../assets/images/lock.svg'
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
              <input type="text" name='name' placeholder='Name' value={formData.name} onChange={handleChange} />
              <span className={Styles.icon1}>
                <img src={User} alt="user" />
              </span>
            </div>
            <div className="">
              <input type="email" name='email' placeholder='Email' value={formData.email} onChange={handleChange} />
              <span className={`${Styles.icon1} ${Styles.icon1_email}`}>
                <img className={Styles.email_icon} src={Mail} alt="email" />
              </span>
            </div>
            <div className="">
              <input type={`${showPassword ? "text" : "password"}`} name='password' placeholder='Password' value={formData.password} onChange={handleChange} />
              <span className={Styles.icon1}>
                <img src={Lock} alt="lock" />
              </span>
              <span className={Styles.icon2}>
                {showPassword ?
                  <img src={EyeOff} onClick={handlePasswordView} />
                  :
                  <img src={Eye} onClick={handlePasswordView} />
                }
              </span>
            </div>
            <div className="">
              <input type={`${showConfirmPassword ? "text" : "password"}`} name='confirmPassword' placeholder='Confirm Password' value={formData.confirmPassword} onChange={handleChange} />
              <span className={Styles.icon1}>
                <img src={Lock} alt="lock" />
              </span>
              <span className={Styles.icon2}>
                {showConfirmPassword ?
                  <img src={EyeOff} onClick={handleConfirmPasswordView} /> 
                  :
                  <img src={Eye} onClick={handleConfirmPasswordView} />
                }
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

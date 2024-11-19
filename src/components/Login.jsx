import React, { useState, useContext,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import {IsLoggedContext} from '../context/IsLoggedContext';
import Spinner from './Spinner';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(IsLoggedContext);
    const [showSpinner, setShowSpinner] = useState(false);
    const [companies, setCompanies] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    const last_connection = currentDate;

    useEffect(() => {
        async function fetchCompaniesData() {
            const response = await fetch(`${apiUrl}/api/companies`)
            const companiesAll = await response.json();
            setCompanies(companiesAll.data)
        }
        fetchCompaniesData();
    }, []);

    const company = companies.find(company => company.name)

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleInputEmail = (e) => {
        const texto = e.target.value;
        setEmail(cleanString(texto))
    }

    const handleInputPassword = (e) => {
        const texto = e.target.value;
        setPassword(cleanString(texto))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(!email || !password) {
                toast('Debes completar todos los campos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!validateEmail(email)) {
                toast('El email no es válido!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(email)) {
                toast('El campo email contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(password)) {
                toast('El campo contraseña contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                setShowSpinner(true);
                const response = await fetch(`${apiUrl}/api/sessions/login`, {
                    method: 'POST',         
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password, last_connection })
                })
                const data = await response.json();
                if (response.ok) {
                    const tokenJWT = data.data;
                    const expirationDate = new Date();
                    expirationDate.setDate(expirationDate.getDate() + 1);
                    const cookieJWT = `TokenJWT=${tokenJWT}; expires=${expirationDate.toUTCString()}`;
                    document.cookie = cookieJWT;
                    navigate("/home");
                    toast('Bienvenido, has iniciado sesion con éxito!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    login();
                }
                if(data.error === 'incorrect credentials') {
                    toast('Alguno de los datos ingresados es incorrecto. Inténtalo nuevamente!', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    setShowSpinner(false);
                }
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <>
            <div className='loginContainer'>

                <div className='loginContainer__credentialsContainer'>

                    <div className='loginContainer__credentialsContainer__credentials'>
                        <div className='loginContainer__credentialsContainer__credentials__phrase'>
                            <h1 className='loginContainer__credentialsContainer__credentials__phrase__titleDown'>{company?company.name:'-'}</h1>
                        </div>
                        <div className='loginContainer__credentialsContainer__credentials__phrase'>
                            <h2 className='loginContainer__credentialsContainer__credentials__phrase__h2'>Inicio de sesión</h2>
                        </div>
                        <form className='loginContainer__credentialsContainer__credentials__form'>
                            <div className='loginContainer__credentialsContainer__credentials__form__label-input'>
                                <h2 className='loginContainer__credentialsContainer__credentials__form__label-input__label'>Email</h2>
                                <input className='loginContainer__credentialsContainer__credentials__form__label-input__input' type='email' placeholder='Email' value={email} onChange={handleInputEmail}/>
                            </div>
                            <div className='loginContainer__credentialsContainer__credentials__form__label-input'>
                                <h2 className='loginContainer__credentialsContainer__credentials__form__label-input__label'>Contraseña</h2>
                                <input className='loginContainer__credentialsContainer__credentials__form__label-input__input' type='password' placeholder='Contraseña' value={password} onChange={handleInputPassword}/>
                            </div>     
                            <div className='loginContainer__credentialsContainer__credentials__form__btn'>
                                <button className='loginContainer__credentialsContainer__credentials__form__btn__prop' onClick={handleSubmit}>Iniciar sesión</button>
                            </div>       
                        </form>
                        <Link to={"/singUp"} className='loginContainer__credentialsContainer__credentials__form__btn'>
                            <button className='loginContainer__credentialsContainer__credentials__form__btn__prop'>Registrarse</button>
                        </Link>
                        <Link to={"/sendMail"} className='loginContainer__credentialsContainer__credentials__phrase'>
                            <div className='loginContainer__credentialsContainer__credentials__phrase__sendMail'>¿Olvidaste tu contraseña? Has click aquí</div>
                        </Link>
                        <div className='loginContainer__credentialsContainer__credentials__form__btn'>
                            {showSpinner&&<Spinner/>}
                        </div>  
                    </div>

                </div>

                <div className='loginContainer__logo'>
                    <img src="https://storage.googleapis.com/que-corte-peluquerias-img/logo-que-corte.jpeg" className='loginContainer__logo__prop' alt="logo-que-corte"/>
                </div>

                <div className='loginContainer__background-img-up'>
                    <img src="https://storage.googleapis.com/que-corte-peluquerias-img/logo-que-corte.jpeg" className='loginContainer__background-img-up__prop' alt="logo-que-corte"/>
                </div>

                <div className='loginContainer__credentials'>
                    <div className='loginContainer__credentials__phrase'>
                        <h1 className='loginContainer__credentials__phrase__titleDown'>{company?company.name:'-'}</h1>
                    </div>
                    <div className='loginContainer__credentials__phrase'>
                        <h2 className='loginContainer__credentials__phrase__h2'>Inicio de sesión</h2>
                    </div>
                    <form className='loginContainer__credentials__form'>
                        <div className='loginContainer__credentials__form__label-input'>
                            <h2 className='loginContainer__credentials__form__label-input__label'>Email</h2>
                            <input className='loginContainer__credentials__form__label-input__input' type='email' placeholder='Email' value={email} onChange={handleInputEmail}/>
                        </div>
                        <div className='loginContainer__credentials__form__label-input'>
                            <h2 className='loginContainer__credentials__form__label-input__label'>Contraseña</h2>
                            <input className='loginContainer__credentials__form__label-input__input' type='password' placeholder='Contraseña' value={password} onChange={handleInputPassword}/>
                        </div>     
                        <div className='loginContainer__credentials__form__btn'>
                            <button className='loginContainer__credentials__form__btn__prop' onClick={handleSubmit}>Iniciar sesión</button>
                        </div>       
                    </form>
                    <Link to={"/singUp"} className='loginContainer__credentials__form__btn'>
                        <button className='loginContainer__credentials__form__btn__prop'>Registrarse</button>
                    </Link>
                    <Link to={"/sendMail"} className='loginContainer__credentials__phrase'>
                        <div className='loginContainer__credentials__phrase__sendMail'>¿Olvidaste tu contraseña? Has click aquí</div>
                    </Link>
                    <div className='loginContainer__credentials__form__btn'>
                        {showSpinner&&<Spinner/>}
                    </div>  
                </div>
            </div>
        </>
    )
}

export default Login
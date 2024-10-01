import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';

const SingUp = () => {
    const navigate = useNavigate();
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        async function fetchCompaniesData() {
            const response = await fetch(`${apiUrl}/api/companies`)
            const companiesAll = await response.json();
            setCompanies(companiesAll.data)
        }
        fetchCompaniesData();
    }, []);

    const company = companies.find(company => company.name)

    function regexOnlyLetters(str) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(str);
    }

    const cleanText = (text) => {
        const replacements = {
          'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
          'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
          'ñ': 'n', 'Ñ': 'N'
        };
      
        return text.split('').map(char => replacements[char] || char).join('');
    };

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    const handleInputFirstName = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setFirstName(textToSaved)
        }
    }

    const handleInputLastName = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setLastName(textToSaved)
        }
    }

    const handleInputEmail = (e) => {
        const texto = e.target.value;
        //const textCleaned = cleanString(texto);
        const textToSaved = cleanText(texto);
        setEmail(textToSaved)
    }

    const handleInputPassword = (e) => {
        const texto = e.target.value;
        setPassword(texto)
    }

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(!first_name || !last_name || !email || !password) {
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
            } else if (!isValidUTF8(first_name)) {
                toast('El campo nombre contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(last_name)) {
                toast('El campo apellido contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
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
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                const user_datetime = currentDate;
                setShowSpinner(true);
                const obj = {
                    first_name: cleanString(first_name),
                    last_name: cleanString(last_name),
                    email: cleanString(email),
                    password: cleanString(password),
                    user_datetime: user_datetime
                }
                const response = await fetch(`${apiUrl}/api/sessions/singUp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(obj)
                })
                
                const data = await response.json();
                if (response.ok) {
                    navigate("/login");
                    toast('El registro de usuario se ha realizado con éxito', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                } 
                if(data.error === 'There is already a user with that email') {
                    toast('Ya existe un usuario con ese email!', {
                        position: "top-right",
                        autoClose: 1500,
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
            <div className='singUpContainer'>

                <div className='singUpContainer__credentialsContainer'>
                    <div className='singUpContainer__credentialsContainer__credentials'>
                        {/* <div className='singUpContainer__credentialsContainer__credentials__phrase'>
                            <h1 className='singUpContainer__credentialsContainer__credentials__phrase__titleUp'>MB</h1>
                        </div> */}
                        <div className='singUpContainer__credentialsContainer__credentials__phrase'>
                            <h1 className='singUpContainer__credentialsContainer__credentials__phrase__titleDown'>{company?company.name:'-'}</h1>
                        </div>
                        <div className='singUpContainer__credentialsContainer__credentials__h2'>
                            <h2 className='singUpContainer__credentialsContainer__credentials__h2__prop'>Registro de usuario</h2>
                        </div>
                        <form className='singUpContainer__credentialsContainer__credentials__form'>
                            <div className='singUpContainer__credentialsContainer__credentials__form__label-input'>
                                <h2 className='singUpContainer__credentialsContainer__credentials__form__label-input__label'>Nombre</h2>
                                <input className='singUpContainer__credentialsContainer__credentials__form__label-input__input' placeholder='Nombre' value={first_name} onChange={handleInputFirstName}/>
                            </div>
                            <div className='singUpContainer__credentialsContainer__credentials__form__label-input'>
                                <h2 className='singUpContainer__credentialsContainer__credentials__form__label-input__label'>Apellido</h2>
                                <input className='singUpContainer__credentialsContainer__credentials__form__label-input__input' placeholder='Apellido' value={last_name} onChange={handleInputLastName}/>
                            </div>
                            <div className='singUpContainer__credentialsContainer__credentials__form__label-input'>
                                <h2 className='singUpContainer__credentialsContainer__credentials__form__label-input__label'>Email</h2>
                                <input className='singUpContainer__credentialsContainer__credentials__form__label-input__input' type='email' placeholder='Email' value={email} onChange={handleInputEmail}/>
                            </div>
                            <div className='singUpContainer__credentialsContainer__credentials__form__label-input'>
                                <h2 className='singUpContainer__credentialsContainer__credentials__form__label-input__label'>Contraseña</h2>
                                <input className='singUpContainer__credentialsContainer__credentials__form__label-input__input' type='password' placeholder='Contraseña' value={password} onChange={handleInputPassword}/>
                            </div>
                            <div className='singUpContainer__credentialsContainer__credentials__form__btn'>
                                <button className='singUpContainer__credentialsContainer__credentials__form__btn__prop' onClick={handleSubmit}>Registrarse</button>
                            </div> 
                        </form>
                        <Link to={"/login"} className='singUpContainer__credentialsContainer__credentials__form__btn'>
                            <button className='singUpContainer__credentialsContainer__credentials__form__btn__prop'>Iniciar sesión</button>
                        </Link>
                        <div className='singUpContainer__credentialsContainer__credentials__form__btn'>
                            {showSpinner&&<Spinner/>}
                        </div> 
                    </div>
                </div>

                <div className='singUpContainer__logo'>
                    <img src="https://storage.googleapis.com/que-corte-peluquerias-img/logo-que-corte.jpeg" className='singUpContainer__logo__prop' alt="logo-que-corte"/>
                </div>

                <div className='singUpContainer__credentials'>
                    {/* <div className='singUpContainer__credentials__phrase'>
                        <p className='singUpContainer__credentials__phrase__titleUp'>MB</p>
                    </div> */}
                    <div className='singUpContainer__credentials__phrase'>
                        <p className='singUpContainer__credentials__phrase__titleDown'>{company?company.name:'-'}</p>
                    </div>
                    <div className='singUpContainer__credentials__h2'>
                        <h2 className='singUpContainer__credentials__h2__prop'>Registro de usuario</h2>
                    </div>
                    <form className='singUpContainer__credentials__form'>
                        <div className='singUpContainer__credentials__form__label-input'>
                            <h2 className='singUpContainer__credentials__form__label-input__label'>Nombre</h2>
                            <input className='singUpContainer__credentials__form__label-input__input' placeholder='Nombre' value={first_name} onChange={handleInputFirstName}/>
                        </div>
                        <div className='singUpContainer__credentials__form__label-input'>
                            <h2 className='singUpContainer__credentials__form__label-input__label'>Apellido</h2>
                            <input className='singUpContainer__credentials__form__label-input__input' placeholder='Apellido' value={last_name} onChange={handleInputLastName}/>
                        </div>
                        <div className='singUpContainer__credentials__form__label-input'>
                            <h2 className='singUpContainer__credentials__form__label-input__label'>Email</h2>
                            <input className='singUpContainer__credentials__form__label-input__input' type='email' placeholder='Email' value={email} onChange={handleInputEmail}/>
                        </div>
                        <div className='singUpContainer__credentials__form__label-input'>
                            <h2 className='singUpContainer__credentials__form__label-input__label'>Contraseña</h2>
                            <input className='singUpContainer__credentials__form__label-input__input' type='password' placeholder='Contraseña' value={password} onChange={handleInputPassword}/>
                        </div>
                        <div className='singUpContainer__credentials__form__btn'>
                            <button className='singUpContainer__credentials__form__btn__prop' onClick={handleSubmit}>Registrarse</button>
                        </div> 
                    </form>
                    <Link to={"/login"} className='singUpContainer__credentials__form__btn'>
                        <button className='singUpContainer__credentials__form__btn__prop'>Iniciar sesión</button>
                    </Link>
                    <div className='singUpContainer__credentials__form__btn'>
                        {showSpinner&&<Spinner/>}
                    </div> 
                </div>


            </div>
        </>
    )
}

export default SingUp
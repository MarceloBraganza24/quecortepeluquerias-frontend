import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';

const SendMailPass = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
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

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    const handleInputEmail = (e) => {
        const texto = e.target.value;
        setEmail(cleanString(texto))
    }
    
    const handleBtnRecieveLink = async () => {
        if(!email) {
            toast('Debes ingresar tu email!', {
                position: "top-right",
                autoClose: 3000,
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
        } else {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/users/password-link`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            })
            const data = await response.json();
            if (response.ok) {
                const tokenJWT = data.data;
                const date = new Date();
                date.setTime(date.getTime() + (1 * 60 * 60 * 1000));
                const expires = "expires=" + date.toUTCString();
                const emailCookieJWT = `TokenEmailUser=${tokenJWT}; ${expires}`;
                document.cookie = emailCookieJWT;
                navigate("/login");
                toast('Se ha enviado el link a su correo electrónico!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                toast('No se ha podido generar el link. Inténtalo mas tarde.', {
                    position: "top-right",
                    autoClose: 3000,
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

    };

    return (
        <>
            <div className='sendMailContainer'>
                <div className='sendMailContainer__credentials'>
                    <div className='sendMailContainer__credentials__phrase'>
                        <h1 className='sendMailContainer__credentials__phrase__title'>{company?company.name:'-'}</h1>
                    </div>
                    <div className='sendMailContainer__credentials__phrase'>
                        <h2 className='sendMailContainer__credentials__phrase__h2'>Ingrese su email para recibir un link y así poder cambiar la contraseña</h2>
                    </div>
                    <div className='sendMailContainer__credentials__form'>
                        <div className='sendMailContainer__credentials__form__label-input'>
                            <h2 className='sendMailContainer__credentials__form__label-input__label'>Email</h2>
                            <input className='sendMailContainer__credentials__form__label-input__input' type='email' placeholder='Email' onChange={handleInputEmail}/>
                        </div> 
                        <div className='sendMailContainer__credentials__form__btn'>
                            <button className='sendMailContainer__credentials__form__btn__prop' onClick={handleBtnRecieveLink}>Recibir link</button>
                        </div>
                        <Link to={"/singUp"} className='sendMailContainer__credentials__form__btn'>
                            <button className='sendMailContainer__credentials__form__btn__prop'>Registrarse</button>
                        </Link>     
                        <Link to={"/login"} className='sendMailContainer__credentials__form__btn'>
                            <button className='sendMailContainer__credentials__form__btn__prop'>Iniciar sesión</button>
                        </Link>  
                    </div>
                    <div className='sendMailContainer__credentials__form__btn'>
                        {showSpinner&&<Spinner/>}
                    </div>  
                </div>
            </div>
        </>
    )
}

export default SendMailPass
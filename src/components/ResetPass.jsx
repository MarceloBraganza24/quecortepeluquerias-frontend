import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';

const ResetPass = () => {
    const [password, setPassword] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [isMonted, setIsMonted] = useState(false);
    const [isCorrectCookie, setIsCorrectCookie] = useState(false);
    const [emailUsercookie, setEmailUserCookie] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;



    useEffect(() => {

        const interval = setInterval(() => {
            const getCookie = (name) => {
                const cookieName = name + "=";
                const decodedCookie = decodeURIComponent(document.cookie);
                const cookieArray = decodedCookie.split(';');
                for (let i = 0; i < cookieArray.length; i++) {
                    let cookie = cookieArray[i];
                    while (cookie.charAt(0) === ' ') {
                        cookie = cookie.substring(1);
                    }
                    if (cookie.indexOf(cookieName) === 0) {
                        return cookie.substring(cookieName.length, cookie.length);
                    }
                }
                return "";
            };
            const cookieValue = getCookie('TokenEmailUser');
            if(cookieValue) {
                setIsCorrectCookie(true);
                setEmailUserCookie(cookieValue);
            } else {
                setIsCorrectCookie(false)
            }
        }, 10000);
        return () => clearInterval(interval); 
    }, [isMonted]);

    useEffect(() => {
        const getCookie = (name) => {
            const cookieName = name + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
            }
            return "";
        };
        const cookieValue = getCookie('TokenEmailUser');
        if(cookieValue) {
            setIsCorrectCookie(true);
            setEmailUserCookie(cookieValue);
        } else {
            setIsCorrectCookie(false)
        }
        setTimeout(() => {
            setIsMonted(true);
        }, 10000)
    }, []);

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const ConfirmationResetPassModal = ({handleResetPassModalLocal}) => {

        const resetPass = async () => {

            if (!isValidUTF8(password)) {
                toast('El campo contiene caracteres no válidos', {
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
                const response = await fetch(`${apiUrl}/api/users/reset-pass?cookie=${emailUsercookie}&password=${password}`, {
                    method: 'POST',         
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json();
                if(response.ok) {
                    toast('La contraseña se modificó correctamente!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2500);
                }
                if(data.error === 'no token provide') {
                    toast('El link ha expirado!', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    setTimeout(() => {
                        window.location.href = '/sendMail';
                    }, 2500);
                } else if(data.error === 'do not enter the same password') {
                    toast('No puedes ingresar la misma contraseña!', {
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
        }

        const handleBtnConfirmationResetPassBtnNo = () => {
            handleResetPassModalLocal(false);
        }

      return (
            <>
                <div className='confirmationResetPassModalContainer'>
                    <div className='confirmationResetPassModalContainer__ask'>¿Estás seguro que deseas confirmar los cambios?</div>
                    <div className='confirmationResetPassModalContainer__askMobile'>
                        <div className='confirmationResetPassModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationResetPassModalContainer__askMobile__ask'>confirmar los cambios?</div>
                    </div>
                    <div className='confirmationResetPassModalContainer__btnsContainer'>
                        <div className='confirmationResetPassModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationResetPassModalContainer__btnsContainer__btns'>
                            <button onClick={resetPass} className='confirmationResetPassModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationResetPassModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationResetPassBtnNo} className='confirmationResetPassModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationResetPassModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const [resetPassModalLocal, handleResetPassModalLocal] = useState(false);

    const handleBtnOpenResetPassModal = () => {
        if(!password) {
            toast('Debes ingresar una contraseña!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else {
            handleResetPassModalLocal(true);
        }
    }

    return (
        <>
            {
                isCorrectCookie?
                <>
                    <div className='resetPassContainer'>
                        <div className='resetPassContainer__credentials'>
                            <div className='resetPassContainer__credentials__phrase'>
                                <h1 className='resetPassContainer__credentials__phrase__title'>Que Corte</h1>
                            </div>
                            <div className='resetPassContainer__credentials__phrase'>
                                <h2 className='resetPassContainer__credentials__phrase__h2'>Ingrese su nueva contraseña</h2>
                            </div>
                            <div className='resetPassContainer__credentials__form'>
                                <div className='resetPassContainer__credentials__form__label-input'>
                                    <h2 className='resetPassContainer__credentials__form__label-input__label'>Contraseña:</h2>
                                    <input className='resetPassContainer__credentials__form__label-input__input' type='password' placeholder='Contraseña' onChange={(e) => {setPassword(e.target.value)}}/>
                                </div> 
                                <div className='resetPassContainer__credentials__form__btn'>
                                    <button className='resetPassContainer__credentials__form__btn__prop' onClick={handleBtnOpenResetPassModal}>Confirmar cambios</button>
                                </div>       
                            </div>
                            <div className='resetPassContainer__credentials__form__btn'>
                            </div>  
                        </div>
                    </div>
                    {
                        resetPassModalLocal&&
                        <ConfirmationResetPassModal handleResetPassModalLocal={handleResetPassModalLocal}/>
                    }
                </>
                :
                <>
                    <div className='resetPassContainer'>
                        <div className='resetPassContainer__credentials'>
                            <div className='resetPassContainer__credentials__phrase'>
                                <h1 className='resetPassContainer__credentials__phrase__title'>Que Corte</h1>
                            </div>
                            <div className='resetPassContainer__credentials__phrase'>
                                <h2 className='resetPassContainer__credentials__phrase__h2'>El link ha expirado</h2>
                            </div>
                            <div className='resetPassContainer__credentials__phrase__ask'>¿Deseas volver a enviar el link?</div>
                            <Link to={"/sendMail"} className='resetPassContainer__credentials__phrase'>
                                Has click aquí
                            </Link>
                        </div>
                    </div>
                </>
            }
            
        </>
    )
}

export default ResetPass
import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import {OpenModalContext} from '../context/OpenModalContext'; 

const CreateUserModalMobile = ({setIsOpenCreateUserModalLocalMobile}) => {
    const {handleCreateUserModalMobile} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [inputFirstNameUL, setInputFirstNameUL] = useState('');
    const [inputLastNameUL, setInputLastNameUL] = useState('');
    const [selectRoleOptionUL, setSelectRoleOptionUL] = useState('');
    const [inputEmailUL, setInputEmailUL] = useState('');
    const [inputPasswordUL, setInputPasswordUL] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const optionsRoleIU = ["user", "premium"];

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

    const handleInputFirstNameUL = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputFirstNameUL(textToSaved)
        }
    };

    const handleInputLastNameUL = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputLastNameUL(textToSaved)
        }
    };

    const handleSelectRoleOptionUL = (e) => {
        const inputValue = e.target.value;
        setSelectRoleOptionUL(inputValue);
    };

    const handleInputEmailUL = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputEmailUL(textToSaved)
    };

    const handleInputPasswordUL = (e) => {
        const texto = e.target.value;
        setInputPasswordUL(texto);
    };

    const closeM = () => {
        setIsOpenCreateUserModalLocalMobile(false);
        handleCreateUserModalMobile(false);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const cleanPropsCreateUser = () => {
        setInputFirstNameUL('');
        setInputLastNameUL('');
        setSelectRoleOptionUL(optionsRoleIU[0]);
        setInputEmailUL('');
        setInputPasswordUL('');
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnCreateUser = async() => {
        if(!inputFirstNameUL || !inputLastNameUL || !inputEmailUL || !inputPasswordUL) {
            toast('Debes completar todos los campos!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (inputEmailUL && !validateEmail(inputEmailUL)) {
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
        } else if (!isValidUTF8(inputFirstNameUL)) {
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
        } else if (!isValidUTF8(inputLastNameUL)) {
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
        } else if (!isValidUTF8(inputEmailUL)) {
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
        } else if (!isValidUTF8(inputPasswordUL)) {
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
            const user_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;
            document.getElementById('btnCreateUser').style.display = 'none';
            setShowSpinner(true);
            const userToCreate = {
                first_name: cleanString(inputFirstNameUL),
                last_name: cleanString(inputLastNameUL),
                email: cleanString(inputEmailUL),
                role: selectRoleOptionUL?selectRoleOptionUL:optionsRoleIU[0],
                password: inputPasswordUL,
                user_datetime: user_datetime
            }
            const response = await fetch(`${apiUrl}/api/sessions/singUp`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userToCreate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has creado el usuario correctamente!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    document.getElementById('btnCreateUser').style.display = 'block';
                    setShowSpinner(false);
                    cleanPropsCreateUser();
                }, 2000);
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
                document.getElementById('btnCreateUser').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    return (
        <>
            <div className='createUserModalContainerMobile'>
                <div className='createUserModalContainerMobile__btnCloseModal'>
                    <Link onClick={closeM} className='createUserModalContainerMobile__btnCloseModal__prop'>
                        Cerrar
                    </Link>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createUserModalContainerMobile__labelInput'>
                    <div className='createUserModalContainerMobile__labelInput__label'>
                        <div className='createUserModalContainerMobile__labelInput__label__prop'>Nombre:</div>
                    </div>
                    <div className='createUserModalContainerMobile__labelInput__input'>
                        <input type='text' className='createUserModalContainerMobile__labelInput__input__prop' value={inputFirstNameUL} onChange={handleInputFirstNameUL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createUserModalContainerMobile__labelInput'>
                    <div className='createUserModalContainerMobile__labelInput__label'>
                        <div className='createUserModalContainerMobile__labelInput__label__prop'>Apellido:</div>
                    </div>
                    <div className='createUserModalContainerMobile__labelInput__input'>
                        <input type='text' className='createUserModalContainerMobile__labelInput__input__prop' value={inputLastNameUL} onChange={handleInputLastNameUL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createUserModalContainerMobile__labelInput'>
                    <div className='createUserModalContainerMobile__labelInput__label'>
                        <div className='createUserModalContainerMobile__labelInput__label__prop'>Email:</div>
                    </div>
                    <div className='createUserModalContainerMobile__labelInput__input'>
                        <input type='email' className='createUserModalContainerMobile__labelInput__input__prop' value={inputEmailUL} onChange={handleInputEmailUL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createUserModalContainerMobile__labelInput'>
                    <div className='createUserModalContainerMobile__labelInput__label'>
                        <div className='createUserModalContainerMobile__labelInput__label__prop'>Rol:</div>
                    </div>
                    <div className='createUserModalContainerMobile__labelInput__selectRole'>
                        <select className='createUserModalContainerMobile__labelInput__selectRole__select' value={selectRoleOptionUL} onChange={handleSelectRoleOptionUL}>
                            {optionsRoleIU.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createUserModalContainerMobile__labelInput'>
                    <div className='createUserModalContainerMobile__labelInput__label'>
                        <div className='createUserModalContainerMobile__labelInput__label__prop'>Contraseña:</div>
                    </div>
                    <div className='createUserModalContainerMobile__labelInput__input'>
                        <input type='password' className='createUserModalContainerMobile__labelInput__input__prop' value={inputPasswordUL} onChange={handleInputPasswordUL}/>
                    </div>
                </div>
                <div style={{paddingTop:'2vh'}} className='createUserModalContainerMobile__btns'>
                    <button id='btnCreateUser' className='createUserModalContainerMobile__btns__btn' onClick={handleBtnCreateUser}>Crear usuario</button>
                </div>
                {showSpinner&&<Spinner/>}
            </div>
        </>
    )
}

export default CreateUserModalMobile
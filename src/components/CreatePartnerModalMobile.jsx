import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import {OpenModalContext} from '../context/OpenModalContext'; 

const CreatePartnerModalMobile = ({setIsOpenCreatePartnerModalLocalMobile,resultCompleteMembershipNumber}) => {
    const {handleCreatePartnerModalMobile} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [inputFirstNamePaL, setInputFirstNamePaL] = useState('');
    const [inputLastNamePaL, setInputLastNamePaL] = useState('');
    const [selectOptionMembershipNumber, setSelectOptionMembershipNumberShL] = useState('');
    const [inputEmailPaL, setInputEmailPaL] = useState('');
    const [inputPointsPaL, setInputPointsPaL] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const optionsMembershipNumber = [];
    resultCompleteMembershipNumber.forEach((element) => {
        optionsMembershipNumber.push(element)
    })

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

    const handleInputFirstNamePaL = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputFirstNamePaL(textToSaved)
        }
    };

    const handleInputLastNamePaL = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputLastNamePaL(textToSaved)
        }
    };

    const handleSelectOptionMembershipNumberShL = (e) => {
        setSelectOptionMembershipNumberShL(e);
    };

    const handleInputEmailPaL = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputEmailPaL(textToSaved)
    };

    const handleInputPointsPaL = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputPointsPaL(inputValue);
        } 
    };

    const closeM = () => {
        setIsOpenCreatePartnerModalLocalMobile(false);
        handleCreatePartnerModalMobile(false);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const cleanPropsCreatePartner = () => {
        setInputFirstNamePaL('')
        setInputLastNamePaL('')
        setInputEmailPaL('')
        setInputPointsPaL('')
        setSelectOptionMembershipNumberShL(optionsMembershipNumber[0])
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    function regexOnlyLetters(str) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(str);
    }

    const handleBtnCreatePartner = async() => {
        if(!inputFirstNamePaL || !inputLastNamePaL || !inputEmailPaL) {
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
        } else if (!isValidUTF8(inputFirstNamePaL)) {
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
        } else if (!isValidUTF8(inputLastNamePaL)) {
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
        } else if (!isValidUTF8(inputEmailPaL)) {
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
        } else if (inputEmailPaL && !validateEmail(inputEmailPaL)) {
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
        } else {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const partner_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;
            document.getElementById('btnCreatePartner').style.display = 'none';
            setShowSpinner(true);
            const partnerToCreate = {
                first_name: cleanString(inputFirstNamePaL),
                last_name: cleanString(inputLastNamePaL),
                partner_number: selectOptionMembershipNumber?selectOptionMembershipNumber:optionsMembershipNumber[0],
                email: cleanString(inputEmailPaL),
                points: inputPointsPaL,
                partner_datetime: partner_datetime
            }
            const response = await fetch(`${apiUrl}/api/partners/register`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partnerToCreate)
            })
            if(response.ok) {
                toast('Has registrado un socio correctamente!', {
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
                    cleanPropsCreatePartner();
                    document.getElementById('btnCreatePartner').style.display = 'block';
                    setShowSpinner(false);
                }, 2000);
            }
            const data = await response.json();
            if(data.error === 'There is already a partner with that data') {
                toast('Ya existe un socio con ese email o número de socio ingresado!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnCreatePartner').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    return (
        <>
            <div className='createPartnerModalContainerMobile'>
                <div className='createPartnerModalContainerMobile__btnCloseModal'>
                    <Link onClick={closeM} className='createPartnerModalContainerMobile__btnCloseModal__prop'>
                        Cerrar
                    </Link>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createPartnerModalContainerMobile__labelInput'>
                    <div className='createPartnerModalContainerMobile__labelInput__label'>
                        <div className='createPartnerModalContainerMobile__labelInput__label__prop'>N° socio:</div>
                    </div>
                    <div className='createPartnerModalContainerMobile__labelInput__select'>
                        <select className='createPartnerModalContainerMobile__labelInput__select__prop' value={selectOptionMembershipNumber} onChange={(e) => {handleSelectOptionMembershipNumberShL(e.target.value)}}>
                            {optionsMembershipNumber.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createPartnerModalContainerMobile__labelInput'>
                    <div className='createPartnerModalContainerMobile__labelInput__label'>
                        <div className='createPartnerModalContainerMobile__labelInput__label__prop'>Puntos:</div>
                    </div>
                    <div className='createPartnerModalContainerMobile__labelInput__input'>
                        <input type='text' className='createPartnerModalContainerMobile__labelInput__input__prop' value={inputPointsPaL} onChange={handleInputPointsPaL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createPartnerModalContainerMobile__labelInput'>
                    <div className='createPartnerModalContainerMobile__labelInput__label'>
                        <div className='createPartnerModalContainerMobile__labelInput__label__prop'>Nombre:</div>
                    </div>
                    <div className='createPartnerModalContainerMobile__labelInput__input'>
                        <input type='text' className='createPartnerModalContainerMobile__labelInput__input__prop' value={inputFirstNamePaL} onChange={handleInputFirstNamePaL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createPartnerModalContainerMobile__labelInput'>
                    <div className='createPartnerModalContainerMobile__labelInput__label'>
                        <div className='createPartnerModalContainerMobile__labelInput__label__prop'>Apellido:</div>
                    </div>
                    <div className='createPartnerModalContainerMobile__labelInput__input'>
                        <input type='text' className='createPartnerModalContainerMobile__labelInput__input__prop' value={inputLastNamePaL} onChange={handleInputLastNamePaL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createPartnerModalContainerMobile__labelInput'>
                    <div className='createPartnerModalContainerMobile__labelInput__label'>
                        <div className='createPartnerModalContainerMobile__labelInput__label__prop'>Email:</div>
                    </div>
                    <div className='createPartnerModalContainerMobile__labelInput__input'>
                        <input type='email' className='createPartnerModalContainerMobile__labelInput__input__prop' value={inputEmailPaL} onChange={handleInputEmailPaL}/>
                    </div>
                </div>
                <div style={{paddingTop:'2vh'}} className='createPartnerModalContainerMobile__btns'>
                    <button id='btnCreatePartner' className='createPartnerModalContainerMobile__btns__btn' onClick={handleBtnCreatePartner}>Crear socio</button>
                </div>
                {showSpinner&&<Spinner/>}
            </div>
        </>
    )
}

export default CreatePartnerModalMobile
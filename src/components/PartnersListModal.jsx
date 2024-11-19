import React, {useState,useContext,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext';

const PartnersListModal = ({id,first_name,last_name,points,partner_number,email,handleUpdatePartnerModalLocal,resultCompleteMembershipNumber}) => {
    const [inputPointsIPa, setInputPointsIPa] = useState('');
    const [inputFirstNameIPa, setInputFirstNameIPa] = useState('');
    const [inputLastNameIPa, setInputLastNameIPa] = useState('');
    const [inputPartnerNumberIPa, setInputPartnerNumberIPa] = useState('');
    const [selectOptionMembershipNumber, handleSelectOptionMembershipNumberShL] = useState('');
    const [inputEmailIPa, setInputEmailIPa] = useState('');
    const [confirmationDelPartnersModal, handleConfirmationDelPartnersModal] = useState(false);
    const {handleUpdatePartnerModal} = useContext(OpenModalContext);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const optionsMembershipNumber = [];
    optionsMembershipNumber.push(`${partner_number}`)
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

    const handleInputPointsIPa = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputPointsIPa(textToSaved)
        texto==points?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(inputFirstNameIPa!==first_name && inputFirstNameIPa!=='')setInputChanges(true);
        if(inputLastNameIPa!==last_name && inputLastNameIPa!=='')setInputChanges(true);
        if(inputPartnerNumberIPa!=partner_number && inputPartnerNumberIPa!='')setInputChanges(true);
        if(inputEmailIPa!==email && inputEmailIPa!=='')setInputChanges(true);
    };

    const handleInputFirstNameIPa = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputFirstNameIPa(textToSaved)
        }
        texto===first_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputPointsIPa!=points && inputPointsIPa!='')setInputChanges(true);
        if(inputLastNameIPa!==last_name && inputLastNameIPa!=='')setInputChanges(true);
        if(inputPartnerNumberIPa!=partner_number && inputPartnerNumberIPa!='')setInputChanges(true);
        if(inputEmailIPa!==email && inputEmailIPa!=='')setInputChanges(true);
    };

    const handleInputLastNameIPa = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputLastNameIPa(textToSaved)
        }
        texto===last_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputPointsIPa!=points && inputPointsIPa!='')setInputChanges(true);
        if(inputFirstNameIPa!==first_name && inputFirstNameIPa!=='')setInputChanges(true);
        if(inputPartnerNumberIPa!=partner_number && inputPartnerNumberIPa!='')setInputChanges(true);
        if(inputEmailIPa!==email && inputEmailIPa!=='')setInputChanges(true);
    };

    const handleInputEmailIPa = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputEmailIPa(textToSaved)
        texto===email?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputPointsIPa!=points && inputPointsIPa!='')setInputChanges(true);
        if(inputFirstNameIPa!==first_name && inputFirstNameIPa!=='')setInputChanges(true);
        if(inputLastNameIPa!==last_name && inputLastNameIPa!=='')setInputChanges(true);
        if(inputPartnerNumberIPa!=partner_number && inputPartnerNumberIPa!='')setInputChanges(true);
    };

    const handleBtnDelPartner = async() => {
        handleConfirmationDelPartnersModal(true);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    function regexOnlyLetters(str) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(str);
    }

    const handleBtnUpdPartner = async() => {
        if (!validateEmail(inputEmailIPa?inputEmailIPa:email)) {
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
        } else if ((inputPointsIPa == points || inputPointsIPa == '') && (inputFirstNameIPa == first_name || inputFirstNameIPa == '') && (inputLastNameIPa == last_name || inputLastNameIPa == '') && (inputEmailIPa == email || inputEmailIPa == '') && (selectOptionMembershipNumber?selectOptionMembershipNumber:optionsMembershipNumber[0]) == partner_number) {
            toast('No tienes cambios para actualizar!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputFirstNameIPa)) {
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
        } else if (!isValidUTF8(inputLastNameIPa)) {
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
        } else if (!isValidUTF8(inputEmailIPa)) {
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
            document.getElementById('btnUpdatePartner').style.display = 'none';
            setShowSpinner(true);
            const partnerToUpdate = {
                first_name: inputFirstNameIPa?cleanString(inputFirstNameIPa):first_name,
                last_name: inputLastNameIPa?cleanString(inputLastNameIPa):last_name,
                partner_number: selectOptionMembershipNumber?selectOptionMembershipNumber:partner_number,
                email: inputEmailIPa?cleanString(inputEmailIPa):email,
                points: inputPointsIPa?cleanString(inputPointsIPa):points,
            }
            const response = await fetch(`${apiUrl}/api/partners/${id}`, {
                method: 'PUT',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partnerToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has actualizado el socio correctamente!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    handleUpdatePartnerModal(false);
                    handleUpdatePartnerModalLocal(false);
                    setInputChanges(false);
                }, 1500);
            }
            if(data.error === 'There is already a partner with that email or membership number') {
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
                document.getElementById('btnUpdatePartner').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    const ConfirmationDeleteModal = () => {
        const handleBtnDelPartner = async() => {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/partners/${id}`, {
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            })
            if(response.ok) {
                toast('Has eliminado el socio correctamente!', {
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
                    handleUpdatePartnerModal(false);
                    handleUpdatePartnerModalLocal(false);
                    handleConfirmationDelPartnersModal(false);
                    setInputChanges(false);
                }, 2000);
            } else {
                toast('Has eliminado el socio correctamente y el usuario no existe más!', {
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
                    handleUpdatePartnerModal(false);
                    handleUpdatePartnerModalLocal(false);
                    handleConfirmationDelPartnersModal(false);
                    setInputChanges(false);
                }, 2000);
            }
        };

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelPartnersModal(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnPartnersListModalContainer'>
                    <div className='confirmationDeleteBtnPartnersListModalContainer__ask'>¿Estás seguro que deseas borrar el socio?</div>
                    <div className='confirmationDeleteBtnPartnersListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnPartnersListModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnPartnersListModalContainer__askMobile__ask'>borrar el socio?</div>
                    </div>
                    <div className='confirmationDeleteBtnPartnersListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnPartnersListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnPartnersListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelPartner} className='confirmationDeleteBtnPartnersListModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnPartnersListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnPartnersListModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnPartnersListModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdatePartnerModal(false);
        handleUpdatePartnerModalLocal(false);
    }

    const unsavedChanges = () => {
        toast('No has actualizado los cambios!', {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    const buttonDisabledStyle = {
        color: '#d2b569',
        cursor: 'pointer'
    };

    return (
    <>
        
        <div className='partnersModalContainer'>
            <div className='partnersModalContainer__btnCloseModal'>
                {
                    !confirmationDelPartnersModal&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='partnersModalContainer__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='partnersModalContainer__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            <div className='partnersModalContainer__header'>
                <div className='partnersModalContainer__header__label'>N° socio</div>
                <div className='partnersModalContainer__header__label'>Puntos</div>
                <div className='partnersModalContainer__header__label'>Nombre</div>
                <div className='partnersModalContainer__header__label'>Apellido</div>
                <div className='partnersModalContainer__header__label'>Email</div>
            </div>
            <div className='partnersModalContainer__itemPartner'>
                {
                    !confirmationDelPartnersModal?
                    <>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <select className='itemCreatePartner__select__prop' value={selectOptionMembershipNumber} onChange={(e) => {handleSelectOptionMembershipNumberShL(e.target.value)}}>
                                {optionsMembershipNumber.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <input className='partnersModalContainer__itemPartner__input__prop' value={!inputPointsIPa?points:inputPointsIPa} onChange={handleInputPointsIPa}/>
                        </div>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <input className='partnersModalContainer__itemPartner__input__prop' value={!inputFirstNameIPa?first_name:inputFirstNameIPa} onChange={handleInputFirstNameIPa}/>
                        </div>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <input className='partnersModalContainer__itemPartner__input__prop' value={!inputLastNameIPa?last_name:inputLastNameIPa} onChange={handleInputLastNameIPa}/>
                        </div>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <input type='email' className='partnersModalContainer__itemPartner__input__prop' value={!inputEmailIPa?email:inputEmailIPa} onChange={handleInputEmailIPa}/>
                        </div>
                        <div className='partnersModalContainer__itemPartner__btns'>
                            <button className='partnersModalContainer__itemPartner__btns__btn' onClick={handleBtnDelPartner}>Borrar</button>
                            <button id='btnUpdatePartner' className='partnersModalContainer__itemPartner__btns__btn' onClick={handleBtnUpdPartner}>Actualizar</button>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </>
                    :
                    <>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <select disabled className='itemCreatePartner__select__prop' value={selectOptionMembershipNumber} onChange={(e) => {handleSelectOptionMembershipNumberShL(e.target.value)}}>
                                {optionsMembershipNumber.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <input disabled className='partnersModalContainer__itemPartner__input__prop' value={!inputPointsIPa?points:inputPointsIPa} onChange={handleInputPointsIPa}/>
                        </div>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <input disabled className='partnersModalContainer__itemPartner__input__prop' value={!inputFirstNameIPa?first_name:inputFirstNameIPa} onChange={handleInputFirstNameIPa}/>
                        </div>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <input disabled className='partnersModalContainer__itemPartner__input__prop' value={!inputLastNameIPa?last_name:inputLastNameIPa} onChange={handleInputLastNameIPa}/>
                        </div>
                        <div className='partnersModalContainer__itemPartner__input'>
                            <input disabled type='email' className='partnersModalContainer__itemPartner__input__prop' value={!inputEmailIPa?email:inputEmailIPa} onChange={handleInputEmailIPa}/>
                        </div>
                        <div className='partnersModalContainer__itemPartner__btns'>
                            <button className='partnersModalContainer__itemPartner__btns__btn'>Borrar</button>
                            <button disabled id='btnUpdateShift' style={buttonDisabledStyle} className='partnersModalContainer__itemPartner__btns__btn'>Actualizar</button>
                        </div>
                    </>
                }
            </div>
            {
                confirmationDelPartnersModal&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
    )
}

export default PartnersListModal
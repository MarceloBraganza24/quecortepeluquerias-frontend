import React, { useState, useEffect, useContext } from 'react'
import {OpenModalContext} from '../context/OpenModalContext';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';

const ProvidersListModalMobile = ({id,business_name,cuit_cuil,phone,email,handleUpdateProviderModalMobileLocal}) => {
    const [inputBusinessNameIPr, setInputBusinessNameIPr] = useState('');
    const [inputCuitCuilIPr, setInputCuitCuilIPr] = useState('');
    const [inputPhoneIPr, setInputPhoneIPr] = useState('');
    const [inputEmailIPr, setInputEmailIPr] = useState('');
    const [confirmationDelProvidersModalMobile, handleConfirmationDelProvidersModalMobile] = useState(false);
    const {handleUpdateProviderModalMobile} = useContext(OpenModalContext);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

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
    
    function regexOnlyLetters(str) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(str);
    }

    const handleInputBusinessNameIPr = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputBusinessNameIPr(textToSaved)
        }
        texto===business_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputCuitCuilIPr!=cuit_cuil && inputCuitCuilIPr!='')setInputChanges(true);
        if(inputPhoneIPr!=phone && inputPhoneIPr!='')setInputChanges(true);
        if(inputEmailIPr!==email && inputEmailIPr!=='')setInputChanges(true);
    };

    const handleInputCuitCuilIPr = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputCuitCuilIPr(inputValue);
            inputValue==cuit_cuil?setInputChanges(false):setInputChanges(true);
            inputValue==''&&setInputChanges(false);
            if(inputBusinessNameIPr!==business_name && inputBusinessNameIPr!=='')setInputChanges(true);
            if(inputPhoneIPr!=phone && inputPhoneIPr!='')setInputChanges(true);
            if(inputEmailIPr!==email && inputEmailIPr!=='')setInputChanges(true);
        }
    };

    const handleInputPhoneIPr = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputPhoneIPr(inputValue);
            inputValue==phone?setInputChanges(false):setInputChanges(true);
            inputValue==''&&setInputChanges(false);
            if(inputBusinessNameIPr!==business_name && inputBusinessNameIPr!=='')setInputChanges(true);
            if(inputCuitCuilIPr!=cuit_cuil && inputCuitCuilIPr!='')setInputChanges(true);
            if(inputEmailIPr!==email && inputEmailIPr!=='')setInputChanges(true);
        }
    };

    const handleInputEmailIPr = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputEmailIPr(textToSaved)
        texto===email?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputBusinessNameIPr!==business_name && inputBusinessNameIPr!=='')setInputChanges(true);
        if(inputCuitCuilIPr!==cuit_cuil && inputCuitCuilIPr!=='')setInputChanges(true);
        if(inputPhoneIPr!=phone && inputPhoneIPr!='')setInputChanges(true);
    };
    
    const handleBtnDelProvider = async() => {
        handleConfirmationDelProvidersModalMobile(true);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdPartner = async() => {
        if (!validateEmail(inputEmailIPr?inputEmailIPr:email)) {
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
        } else if (!isValidUTF8(inputBusinessNameIPr)) {
            toast('El campo razón social contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            document.getElementById('btnUpdateProvider').style.display = 'block';
            setShowSpinner(false);
        } else if (!isValidUTF8(inputCuitCuilIPr)) {
            toast('El campo CUIT-CUIL contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            document.getElementById('btnUpdateProvider').style.display = 'block';
            setShowSpinner(false);
        } else if (!isValidUTF8(inputPhoneIPr)) {
            toast('El campo teléfono contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            document.getElementById('btnUpdateProvider').style.display = 'block';
            setShowSpinner(false);
        } else if (!isValidUTF8(inputEmailIPr)) {
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
            document.getElementById('btnUpdateProvider').style.display = 'block';
            setShowSpinner(false);
        } else if ((inputBusinessNameIPr == business_name || inputBusinessNameIPr == '') && (inputCuitCuilIPr == cuit_cuil || inputCuitCuilIPr == '') && (inputPhoneIPr == phone || inputPhoneIPr == '') && (inputEmailIPr == email || inputEmailIPr == '')) {
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
        } else {
            document.getElementById('btnUpdateProvider').style.display = 'none';
            setShowSpinner(true);
            const providerToUpdate = {
                business_name: inputBusinessNameIPr?cleanString(inputBusinessNameIPr):business_name,
                cuit_cuil: inputCuitCuilIPr?inputCuitCuilIPr:cuit_cuil,
                phone: inputPhoneIPr?inputPhoneIPr:phone,
                email: inputEmailIPr?cleanString(inputEmailIPr):email
            }
            const response = await fetch(`${apiUrl}/api/providers/${id}`, {
                method: 'PUT',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(providerToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has actualizado el proveedor correctamente!', {
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
                    document.getElementById('btnUpdateProvider').style.display = 'block';
                    setShowSpinner(false);
                    handleUpdateProviderModalMobile(false);
                    handleUpdateProviderModalMobileLocal(false);
                    setInputChanges(false);
                }, 1500);
            }
            if(data.error === 'There is already a provider with that CUIT-CUIL') {
                toast('Ya existe un proveedor con ese CUIT-CUIL!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnUpdateProvider').style.display = 'block';
                setShowSpinner(false);
            } else if(data.error === 'There is already a provider with that email') {
                toast('Ya existe un proveedor con ese email!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnUpdateProvider').style.display = 'block';
                setShowSpinner(false);
            } else if(data.error === 'There is already a provider with that business name') {
                toast('Ya existe un proveedor con esa razón social!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnUpdateProvider').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    const ConfirmationDeleteModal = () => {
        const handleBtnDelProvider = async() => {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/providers/${id}`, {
                method: 'DELETE'
            })
            if(response.ok) {
                toast('Has eliminado el proveedor correctamente!', {
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
                    handleUpdateProviderModalMobile(false);
                    handleUpdateProviderModalMobileLocal(false);
                    handleConfirmationDelProvidersModalMobile(false);
                    setInputChanges(false);
                }, 2000);
            } else {
                toast('Has ocurrido un error al querer eliminar el proveedor!', {
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
        };

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelProvidersModalMobile(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnPartnersListModalContainerMobile'>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__ask'>¿Estás seguro que deseas borrar el proveedor?</div>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile'>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile__ask'>borrar el proveedor?</div>
                    </div>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__btns'>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn'>
                            <button onClick={handleBtnDelProvider} className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn__prop'>No</button>
                        </div>
                        {showSpinner&&<Spinner/>}
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdateProviderModalMobile(false);
        handleUpdateProviderModalMobileLocal(false);
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
        color: 'white',
        cursor: 'pointer'
    };

  return (
    <>
     <div className='updateProviderModalContainerMobile'>
            <div className='updateProviderModalContainerMobile__btnCloseModal'>
                {
                    !confirmationDelProvidersModalMobile&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='updateProviderModalContainerMobile__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='updateProviderModalContainerMobile__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            {
                !confirmationDelProvidersModalMobile?
                <>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__labelInput'>
                        <div className='updateProviderModalContainerMobile__labelInput__label'>
                            <div className='updateProviderModalContainerMobile__labelInput__label__prop'>Razón social:</div>
                        </div>
                        <div className='updateProviderModalContainerMobile__labelInput__input'>
                            <input className='updateProviderModalContainerMobile__labelInput__input__prop' value={!inputBusinessNameIPr?business_name:inputBusinessNameIPr}onChange={handleInputBusinessNameIPr}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__labelInput'>
                        <div className='updateProviderModalContainerMobile__labelInput__label'>
                            <div className='updateProviderModalContainerMobile__labelInput__label__prop'>CUIT/CUIL:</div>
                        </div>
                        <div className='updateProviderModalContainerMobile__labelInput__input'>
                            <input className='updateProviderModalContainerMobile__labelInput__input__prop' value={!inputCuitCuilIPr?cuit_cuil:inputCuitCuilIPr}onChange={handleInputCuitCuilIPr}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__labelInput'>
                        <div className='updateProviderModalContainerMobile__labelInput__label'>
                            <div className='updateProviderModalContainerMobile__labelInput__label__prop'>Teléfono:</div>
                        </div>
                        <div className='updateProviderModalContainerMobile__labelInput__input'>
                            <input className='updateProviderModalContainerMobile__labelInput__input__prop' value={!inputPhoneIPr?phone:inputPhoneIPr}onChange={handleInputPhoneIPr}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__labelInput'>
                        <div className='updateProviderModalContainerMobile__labelInput__label'>
                            <div className='updateProviderModalContainerMobile__labelInput__label__prop'>Email:</div>
                        </div>
                        <div className='updateProviderModalContainerMobile__labelInput__input'>
                            <input className='updateProviderModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailIPr?email:inputEmailIPr}onChange={handleInputEmailIPr}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__btns'>
                        <button className='updateProviderModalContainerMobile__btns__btn' onClick={handleBtnDelProvider}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateProviderModalContainerMobile__btns'>
                        <button id='btnUpdateProvider' className='updateProviderModalContainerMobile__btns__btn' onClick={handleBtnUpdPartner}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateProviderModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
                :
                <>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__labelInput'>
                        <div className='updateProviderModalContainerMobile__labelInput__label'>
                            <div className='updateProviderModalContainerMobile__labelInput__label__prop'>Razón social:</div>
                        </div>
                        <div className='updateProviderModalContainerMobile__labelInput__input'>
                            <input disabled className='updateProviderModalContainerMobile__labelInput__input__prop' value={!inputBusinessNameIPr?business_name:inputBusinessNameIPr}onChange={handleInputBusinessNameIPr}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__labelInput'>
                        <div className='updateProviderModalContainerMobile__labelInput__label'>
                            <div className='updateProviderModalContainerMobile__labelInput__label__prop'>CUIT/CUIL:</div>
                        </div>
                        <div className='updateProviderModalContainerMobile__labelInput__input'>
                            <input disabled className='updateProviderModalContainerMobile__labelInput__input__prop' value={!inputCuitCuilIPr?cuit_cuil:inputCuitCuilIPr}onChange={handleInputCuitCuilIPr}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__labelInput'>
                        <div className='updateProviderModalContainerMobile__labelInput__label'>
                            <div className='updateProviderModalContainerMobile__labelInput__label__prop'>Teléfono:</div>
                        </div>
                        <div className='updateProviderModalContainerMobile__labelInput__input'>
                            <input disabled className='updateProviderModalContainerMobile__labelInput__input__prop' value={!inputPhoneIPr?phone:inputPhoneIPr}onChange={handleInputPhoneIPr}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__labelInput'>
                        <div className='updateProviderModalContainerMobile__labelInput__label'>
                            <div className='updateProviderModalContainerMobile__labelInput__label__prop'>Email:</div>
                        </div>
                        <div className='updateProviderModalContainerMobile__labelInput__input'>
                            <input disabled className='updateProviderModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailIPr?email:inputEmailIPr}onChange={handleInputEmailIPr}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProviderModalContainerMobile__btns'>
                        <button disabled className='updateProviderModalContainerMobile__btns__btn' onClick={handleBtnDelProvider}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateProviderModalContainerMobile__btns'>
                        <button disabled id='btnUpdateProvider' className='updateProviderModalContainerMobile__btns__btn' onClick={handleBtnUpdPartner}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateProviderModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
            }
            {
                confirmationDelProvidersModalMobile&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
  )
}

export default ProvidersListModalMobile
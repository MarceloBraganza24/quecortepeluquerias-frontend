import React, {useState,useContext} from 'react'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext';

const ProvidersListModal = ({id,businessName,cuitCuil,phone,email,handleUpdateProviderModalLocal}) => {
    const [inputBusinessNameIPr, setInputBusinessNameIPr] = useState('');
    const [inputCuitCuilIPr, setInputCuitCuilIPr] = useState('');
    const [inputPhoneIPr, setInputPhoneIPr] = useState('');
    const [inputEmailIPr, setInputEmailIPr] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const [confirmationDelProvidersModal, handleConfirmationDelProvidersModal] = useState(false);
    const {handleUpdateProviderModal} = useContext(OpenModalContext);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

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
        texto===businessName?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputCuitCuilIPr!=cuitCuil && inputCuitCuilIPr!='')setInputChanges(true);
        if(inputPhoneIPr!=phone && inputPhoneIPr!='')setInputChanges(true);
        if(inputEmailIPr!==email && inputEmailIPr!=='')setInputChanges(true);
    };

    const handleInputCuitCuilIIPr = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputCuitCuilIPr(inputValue);
            inputValue===cuitCuil?setInputChanges(false):setInputChanges(true);
            inputValue===''&&setInputChanges(false);
            if(inputBusinessNameIPr!==businessName && inputBusinessNameIPr!=='')setInputChanges(true);
            if(inputPhoneIPr!=phone && inputPhoneIPr!='')setInputChanges(true);
            if(inputEmailIPr!==email && inputEmailIPr!=='')setInputChanges(true);
        }
    };

    const handleInputPhoneIPr = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputPhoneIPr(inputValue);
            Number(inputValue)===phone?setInputChanges(false):setInputChanges(true);
            inputValue===''&&setInputChanges(false);
            if(inputBusinessNameIPr!==businessName && inputBusinessNameIPr!=='')setInputChanges(true);
            if(inputCuitCuilIPr!=cuitCuil && inputCuitCuilIPr!='')setInputChanges(true);
            if(inputEmailIPr!==email && inputEmailIPr!=='')setInputChanges(true);
        }
    };

    const handleInputEmailIPr = (e) => {
        const inputValue = e.target.value;
        const textToSaved = cleanText(inputValue);
        setInputEmailIPr(textToSaved)
        inputValue===email?setInputChanges(false):setInputChanges(true);
        inputValue===''&&setInputChanges(false);
        if(inputBusinessNameIPr!==businessName && inputBusinessNameIPr!=='')setInputChanges(true);
        if(inputCuitCuilIPr!=cuitCuil && inputCuitCuilIPr!='')setInputChanges(true);
        if(inputPhoneIPr!=phone && inputPhoneIPr!='')setInputChanges(true);
    };

    const handleBtnDelProvider = async() => {
        handleConfirmationDelProvidersModal(true);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdProvider = async() => {
        document.getElementById('btnUpdateProvider').style.display = 'none';
        setShowSpinner(true);
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
            document.getElementById('btnUpdateProvider').style.display = 'block';
            setShowSpinner(false);
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
        } else if ((inputBusinessNameIPr == businessName || inputBusinessNameIPr == '') && (inputCuitCuilIPr == cuitCuil || inputCuitCuilIPr == '') && (inputPhoneIPr == phone || inputPhoneIPr == '') && (inputEmailIPr == email || inputEmailIPr == '')) {
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
            document.getElementById('btnUpdateProvider').style.display = 'block';
            setShowSpinner(false);
        } else {
            const providerToUpdate = {
                business_name: inputBusinessNameIPr?cleanString(inputBusinessNameIPr):businessName,
                cuit_cuil: inputCuitCuilIPr?inputCuitCuilIPr:cuitCuil,
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
                    handleUpdateProviderModal(false);
                    handleUpdateProviderModalLocal(false);
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
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                }
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
                    handleUpdateProviderModal(false);
                    handleUpdateProviderModalLocal(false);
                }, 2000);
            } else {
                toast('Has ocurrido un error al querer eliminar el proveeedor!', {
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
        };

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelProvidersModal(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnProvidersListModalContainer'>
                    <div className='confirmationDeleteBtnProvidersListModalContainer__ask'>¿Estás seguro que deseas borrar el proveedor?</div>
                    <div className='confirmationDeleteBtnProvidersListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnProvidersListModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnProvidersListModalContainer__askMobile__ask'>borrar el proveedor?</div>
                    </div>
                    <div className='confirmationDeleteBtnProvidersListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnProvidersListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnProvidersListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelProvider} className='confirmationDeleteBtnProvidersListModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnProvidersListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnProvidersListModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnProvidersListModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdateProviderModal(false);
        handleUpdateProviderModalLocal(false);
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
        <div className='providersModalContainer'>
            <div className='providersModalContainer__btnCloseModal'>
                {
                    !confirmationDelProvidersModal&&!inputChanges?
                    <Link onClick={closeM} className='providersModalContainer__btnCloseModal__prop'>
                        Cerrar
                    </Link>
                    :
                    <div onClick={unsavedChanges} className='providersModalContainer__btnCloseModal__prop'>Cerrar</div>
                }
            </div>
            <div className='providersModalContainer__header'>
                <div className='providersModalContainer__header__label'>Razón social</div>
                <div className='providersModalContainer__header__label'>CUIT-CUIL</div>
                <div className='providersModalContainer__header__label'>Teléfono</div>
                <div className='providersModalContainer__header__label'>Email</div>
            </div>
            <div className='providersModalContainer__itemProvider'>
                {
                    !confirmationDelProvidersModal?
                    <>
                        <div className='providersModalContainer__itemProvider__input'>
                            <input className='providersModalContainer__itemProvider__input__prop' value={!inputBusinessNameIPr?businessName:inputBusinessNameIPr} onChange={handleInputBusinessNameIPr}/>
                        </div>
                        <div className='providersModalContainer__itemProvider__input'>
                            <input className='providersModalContainer__itemProvider__input__prop' maxLength={11} value={!inputCuitCuilIPr?cuitCuil:inputCuitCuilIPr} onChange={handleInputCuitCuilIIPr}/>
                        </div>
                        <div className='providersModalContainer__itemProvider__input'>
                            <input className='providersModalContainer__itemProvider__input__prop' maxLength={13} value={!inputPhoneIPr?phone:inputPhoneIPr} onChange={handleInputPhoneIPr}/>
                        </div>
                        <div className='providersModalContainer__itemProvider__input'>
                            <input type='email' className='providersModalContainer__itemProvider__input__prop' value={!inputEmailIPr?email:inputEmailIPr} onChange={handleInputEmailIPr}/>
                        </div>
                        <div className='providersModalContainer__itemProvider__btns'>
                            <button className='providersModalContainer__itemProvider__btns__btn' onClick={handleBtnDelProvider}>Borrar</button>
                            <button id='btnUpdateProvider' className='providersModalContainer__itemProvider__btns__btn' onClick={handleBtnUpdProvider}>Actualizar</button>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </>
                    :
                    <>
                        <div className='providersModalContainer__itemProvider__input'>
                            <input disabled className='providersModalContainer__itemProvider__input__prop' value={!inputBusinessNameIPr?businessName:inputBusinessNameIPr} onChange={handleInputBusinessNameIPr}/>
                        </div>
                        <div className='providersModalContainer__itemProvider__input'>
                            <input disabled className='providersModalContainer__itemProvider__input__prop' value={!inputCuitCuilIPr?cuitCuil:inputCuitCuilIPr} onChange={handleInputCuitCuilIIPr}/>
                        </div>
                        <div className='providersModalContainer__itemProvider__input'>
                            <input disabled className='providersModalContainer__itemProvider__input__prop' value={!inputPhoneIPr?phone:inputPhoneIPr} onChange={handleInputPhoneIPr}/>
                        </div>
                        <div className='providersModalContainer__itemProvider__input'>
                            <input disabled className='providersModalContainer__itemProvider__input__prop' value={!inputEmailIPr?email:inputEmailIPr} onChange={handleInputEmailIPr}/>
                        </div>
                        <div className='providersModalContainer__itemProvider__btns'>
                            <button className='providersModalContainer__itemProvider__btns__btn'>Borrar</button>
                            <button disabled style={buttonDisabledStyle} id='btnCreateProvider' className='providersModalContainer__itemProvider__btns__btn'>Actualizar</button>
                        </div>
                    </>
                }
                
            </div>
            {
                confirmationDelProvidersModal&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
    )
}

export default ProvidersListModal
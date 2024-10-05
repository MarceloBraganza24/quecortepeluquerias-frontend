import React, { useState, useEffect, useContext } from 'react'
import {OpenModalContext} from '../context/OpenModalContext';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';

const UsersListModalMobile = ({id,first_name,last_name,email,role,handleUpdateUserModalMobileLocal}) => {
    const [inputFirstNameIU, setInputFirstNameIU] = useState('');
    const [inputLastNameIU, setInputLastNameIU] = useState('');
    const [inputEmailIU, setInputEmailIU] = useState('');
    const [selectRoleOptionIU, setSelectRoleOptionIU] = useState(`${role}`);
    const [confirmationDelUsersModalMobile, handleConfirmationDelUsersModalMobile] = useState(false);
    const {handleUpdateUserModalMobile} = useContext(OpenModalContext);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const optionsRoleIU = ["user","admin", "premium"];

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

    const handleInputFirstNameIU = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputFirstNameIU(textToSaved)
        }
        texto==first_name?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(inputLastNameIU!=last_name && inputLastNameIU!='')setInputChanges(true);
        if(inputEmailIU!=email && inputEmailIU!='')setInputChanges(true);
        if(selectRoleOptionIU!=role && selectRoleOptionIU!='')setInputChanges(true);
    };

    const handleInputLastNameIU = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputLastNameIU(textToSaved)
        }
        texto==last_name?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(inputFirstNameIU!=first_name && inputFirstNameIU!='')setInputChanges(true);
        if(inputEmailIU!=email && inputEmailIU!='')setInputChanges(true);
        if(selectRoleOptionIU!=role && selectRoleOptionIU!='')setInputChanges(true);
    };

    const handleInputEmailIU = (e) => {
        const texto = e.target.value;
        //const textCleaned = cleanString(texto);
        const textToSaved = cleanText(texto);
        setInputEmailIU(textToSaved)
        texto==email?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(inputFirstNameIU!=first_name && inputFirstNameIU!='')setInputChanges(true);
        if(inputLastNameIU!=last_name && inputLastNameIU!='')setInputChanges(true);
        if(selectRoleOptionIU!=role && selectRoleOptionIU!='')setInputChanges(true);
    };

    const handleSelectRoleOptionIU = (e) => {
        const texto = e.target.value;
        setSelectRoleOptionIU(texto);
        texto==role?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(inputFirstNameIU!=first_name && inputFirstNameIU!='')setInputChanges(true);
        if(inputLastNameIU!=last_name && inputLastNameIU!='')setInputChanges(true);
        if(inputEmailIU!=email && inputEmailIU!='')setInputChanges(true);
    };
    
    const handleBtnDelUser = async() => {
        handleConfirmationDelUsersModalMobile(true);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdProduct = async() => {
        if ((inputFirstNameIU == first_name || inputFirstNameIU == '') && (inputLastNameIU == last_name || inputLastNameIU == '') && (inputEmailIU == email || inputEmailIU == '') && (selectRoleOptionIU?selectRoleOptionIU:optionsRoleIU[0]) == role) {
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
        } else if (!isValidUTF8(inputFirstNameIU)) {
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
        } else if (!isValidUTF8(inputLastNameIU)) {
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
        } else if (!isValidUTF8(inputEmailIU)) {
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
            document.getElementById('btnUpdateUser').style.display = 'none';
            setShowSpinner(true);
            const userToUpdate = {
                first_name: inputFirstNameIU?cleanString(inputFirstNameIU):first_name,
                last_name: inputLastNameIU?cleanString(inputLastNameIU):last_name,
                email: inputEmailIU?cleanString(inputEmailIU):email,
                role: selectRoleOptionIU?selectRoleOptionIU:role,
            }
            const response = await fetch(`${apiUrl}/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(userToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has actualizado el usuario correctamente!', {
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
                    handleUpdateUserModalMobile(false);
                    handleUpdateUserModalMobileLocal(false);
                    setInputChanges(false);
                }, 1500);
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
    };

    const ConfirmationDeleteModal = () => {
        const handleBtnDelUser = async() => {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/users/delete-one/${id}`, {
                method: 'DELETE'
            })
            if(response.ok) {
                toast('Has eliminado el usuario correctamente!', {
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
                    handleUpdateUserModalMobile(false);
                    handleUpdateUserModalMobileLocal(false);
                    handleConfirmationDelUsersModalMobile(false);
                    setInputChanges(false);
                }, 2000);
            } else {
                toast('Has ocurrido un error al querer eliminar el usuario!', {
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
            handleConfirmationDelUsersModalMobile(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnPartnersListModalContainerMobile'>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__ask'>¿Estás seguro que deseas borrar el usuario?</div>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile'>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile__ask'>borrar el usuario?</div>
                    </div>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__btns'>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn'>
                            <button onClick={handleBtnDelUser} className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn__prop'>Si</button>
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
        handleUpdateUserModalMobile(false);
        handleUpdateUserModalMobileLocal(false);
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
        <div className='updateUserModalContainerMobile'>
            <div className='updateUserModalContainerMobile__btnCloseModal'>
                {
                    !confirmationDelUsersModalMobile&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='updateUserModalContainerMobile__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='updateUserModalContainerMobile__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            {
                !confirmationDelUsersModalMobile?
                <>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__labelInput'>
                        <div className='updateUserModalContainerMobile__labelInput__label'>
                            <div className='updateUserModalContainerMobile__labelInput__label__prop'>Nombre:</div>
                        </div>
                        <div className='updateUserModalContainerMobile__labelInput__input'>
                            <input className='updateUserModalContainerMobile__labelInput__input__prop' value={!inputFirstNameIU?first_name:inputFirstNameIU}onChange={handleInputFirstNameIU}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__labelInput'>
                        <div className='updateUserModalContainerMobile__labelInput__label'>
                            <div className='updateUserModalContainerMobile__labelInput__label__prop'>Apellido:</div>
                        </div>
                        <div className='updateUserModalContainerMobile__labelInput__input'>
                            <input className='updateUserModalContainerMobile__labelInput__input__prop' value={!inputLastNameIU?last_name:inputLastNameIU}onChange={handleInputLastNameIU}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__labelInput'>
                        <div className='updateUserModalContainerMobile__labelInput__label'>
                            <div className='updateUserModalContainerMobile__labelInput__label__prop'>Email:</div>
                        </div>
                        <div className='updateUserModalContainerMobile__labelInput__input'>
                            <input className='updateUserModalContainerMobile__labelInput__input__prop' value={!inputEmailIU?email:inputEmailIU}onChange={handleInputEmailIU}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__labelInput'>
                        <div className='updateUserModalContainerMobile__labelInput__label'>
                            <div className='updateUserModalContainerMobile__labelInput__label__prop'>Rol:</div>
                        </div>
                        <div className='updateUserModalContainerMobile__labelInput__selectSchedule'>
                            <select className='updateUserModalContainerMobile__labelInput__selectSchedule__select' value={selectRoleOptionIU} onChange={handleSelectRoleOptionIU}>
                                {optionsRoleIU.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__btns'>
                        <button className='updateUserModalContainerMobile__btns__btn' onClick={handleBtnDelUser}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateUserModalContainerMobile__btns'>
                        <button id='btnUpdateUser' className='updateUserModalContainerMobile__btns__btn' onClick={handleBtnUpdProduct}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateUserModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
                :
                <>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__labelInput'>
                        <div className='updateUserModalContainerMobile__labelInput__label'>
                            <div className='updateUserModalContainerMobile__labelInput__label__prop'>Nombre:</div>
                        </div>
                        <div className='updateUserModalContainerMobile__labelInput__input'>
                            <input disabled className='updateUserModalContainerMobile__labelInput__input__prop' value={!inputFirstNameIU?first_name:inputFirstNameIU}onChange={handleInputFirstNameIU}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__labelInput'>
                        <div className='updateUserModalContainerMobile__labelInput__label'>
                            <div className='updateUserModalContainerMobile__labelInput__label__prop'>Apellido:</div>
                        </div>
                        <div className='updateUserModalContainerMobile__labelInput__input'>
                            <input disabled className='updateUserModalContainerMobile__labelInput__input__prop' value={!inputLastNameIU?last_name:inputLastNameIU}onChange={handleInputLastNameIU}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__labelInput'>
                        <div className='updateUserModalContainerMobile__labelInput__label'>
                            <div className='updateUserModalContainerMobile__labelInput__label__prop'>Email:</div>
                        </div>
                        <div className='updateUserModalContainerMobile__labelInput__input'>
                            <input disabled className='updateUserModalContainerMobile__labelInput__input__prop' value={!inputEmailIU?email:inputEmailIU}onChange={handleInputEmailIU}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__labelInput'>
                        <div className='updateUserModalContainerMobile__labelInput__label'>
                            <div className='updateUserModalContainerMobile__labelInput__label__prop'>Rol:</div>
                        </div>
                        <div className='updateUserModalContainerMobile__labelInput__input'>
                            <select disabled className='updateShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectRoleOptionIU} onChange={handleSelectRoleOptionIU}>
                                {optionsRoleIU.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateUserModalContainerMobile__btns'>
                        <button disabled className='updateUserModalContainerMobile__btns__btn' onClick={handleBtnDelUser}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateUserModalContainerMobile__btns'>
                        <button disabled id='btnUpdateUser' className='updateUserModalContainerMobile__btns__btn' onClick={handleBtnUpdProduct}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateUserModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
            }
            {
                confirmationDelUsersModalMobile&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
  )
}

export default UsersListModalMobile
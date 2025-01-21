import React, {useState,useContext} from 'react'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext';

const UsersListModal = ({id,first_name,last_name,email,role,handleUpdateUsersModalLocal}) => {
    const [inputFirstNameIU, setInputFirstNameIU] = useState('');
    const [inputLastNameIU, setInputLastNameIU] = useState('');
    const [inputEmailIU, setInputEmailIU] = useState('');
    const [inputRoleIU, setInputRoleIU] = useState('');
    const optionsRoleIU = []
    role=="admin"?optionsRoleIU.push(`${role}`,'premium','user'):
    role=="premium"?optionsRoleIU.push(`${role}`,'user'):
    role=="user"&&optionsRoleIU.push(`${role}`,'premium')
    const apiUrl = import.meta.env.VITE_API_URL;
    const [confirmationDelUsersModal, handleConfirmationDelUsersModal] = useState(false);
    const {handleUpdateUserModal} = useContext(OpenModalContext);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

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
            const textToSaved = cleanText(texto);
            setInputFirstNameIU(textToSaved)
        } 
        texto===first_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputLastNameIU!==last_name && inputLastNameIU!=='')setInputChanges(true);
        if(inputRoleIU!=role && inputRoleIU!='')setInputChanges(true);
        if(inputEmailIU!==email && inputEmailIU!=='')setInputChanges(true);
    };

    const handleInputLastNameIU = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputLastNameIU(textToSaved)
        }
        texto===last_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputFirstNameIU!==first_name && inputFirstNameIU!=='')setInputChanges(true);
        if(inputRoleIU!=role && inputRoleIU!='')setInputChanges(true);
        if(inputEmailIU!==email && inputEmailIU!=='')setInputChanges(true);
    };

    const handleInputEmailIU = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputEmailIU(textToSaved)
        texto===email?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputFirstNameIU!==first_name && inputFirstNameIU!=='')setInputChanges(true);
        if(inputLastNameIU!==last_name && inputLastNameIU!=='')setInputChanges(true);
        if(inputRoleIU!=role && inputRoleIU!='')setInputChanges(true);
    };

    const handleInputRoleIU = (e) => {
        const texto = e.target.value;
        setInputRoleIU(texto);
        texto===role?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputFirstNameIU!==first_name && inputFirstNameIU!=='')setInputChanges(true);
        if(inputLastNameIU!==last_name && inputLastNameIU!=='')setInputChanges(true);
        if(inputEmailIU!==email && inputEmailIU!=='')setInputChanges(true);
    };

    const handleBtnDelUser = async() => {
        handleConfirmationDelUsersModal(true);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdUser = async() => {
        if ((inputFirstNameIU == first_name || inputFirstNameIU == '') && (inputLastNameIU == last_name || inputLastNameIU == '') && (inputEmailIU == email || inputEmailIU == '') && (inputRoleIU?inputRoleIU:optionsRoleIU[0]) == role) {
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
        } else if (!validateEmail(inputEmailIU?inputEmailIU:email)) {
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
                role: inputRoleIU?inputRoleIU:role
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
                    handleUpdateUserModal(false);
                    handleUpdateUsersModalLocal(false);
                    setInputChanges(false)
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
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                }
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
                    handleUpdateUserModal(false);
                    handleUpdateUsersModalLocal(false);
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
            handleConfirmationDelUsersModal(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnUsersListModalContainer'>
                    <div className='confirmationDeleteBtnUsersListModalContainer__ask'>¿Estás seguro que deseas borrar el usuario?</div>
                    <div className='confirmationDeleteBtnUsersListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnUsersListModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnUsersListModalContainer__askMobile__ask'>borrar el usuario?</div>
                    </div>
                    <div className='confirmationDeleteBtnUsersListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnUsersListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnUsersListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelUser} className='confirmationDeleteBtnUsersListModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnUsersListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnUsersListModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnUsersListModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdateUserModal(false);
        handleUpdateUsersModalLocal(false);
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
        
        <div className='usersModalContainer'>
            <div className='usersModalContainer__btnCloseModal'>
                {
                    !confirmationDelUsersModal&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='usersModalContainer__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='usersModalContainer__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            <div className='usersModalContainer__header'>
                <div className='usersModalContainer__header__label'>Nombre</div>
                <div className='usersModalContainer__header__label'>Apellido</div>
                <div className='usersModalContainer__header__label'>Email</div>
                <div className='usersModalContainer__header__label'>Rol</div>
            </div>
            <div className='usersModalContainer__itemUser'>
                {
                    !confirmationDelUsersModal?
                    <>
                        <div className='usersModalContainer__itemUser__input'>
                            <input className='usersModalContainer__itemUser__input__prop' value={!inputFirstNameIU?first_name:inputFirstNameIU} onChange={handleInputFirstNameIU}/>
                        </div>
                        <div className='usersModalContainer__itemUser__input'>
                            <input className='usersModalContainer__itemUser__input__prop' value={!inputLastNameIU?last_name:inputLastNameIU} onChange={handleInputLastNameIU}/>
                        </div>
                        <div className='usersModalContainer__itemUser__input'>
                            <input className='usersModalContainer__itemUser__input__prop' type='email' value={!inputEmailIU?email:inputEmailIU} onChange={handleInputEmailIU}/>
                        </div>
                        <div className='usersModalContainer__itemUser__selectRole'>
                            <select className='usersModalContainer__itemUser__selectRole__select' value={inputRoleIU} onChange={handleInputRoleIU}>
                                {optionsRoleIU.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='usersModalContainer__itemUser__btns'>
                            <button className='usersModalContainer__itemUser__btns__btn' onClick={handleBtnDelUser}>Borrar</button>
                            <button id='btnUpdateUser' className='usersModalContainer__itemUser__btns__btn' onClick={handleBtnUpdUser}>Actualizar</button>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </>
                    :
                    <>
                        <div className='usersModalContainer__itemUser__input'>
                            <input disabled className='usersModalContainer__itemUser__input__prop' value={!inputFirstNameIU?first_name:inputFirstNameIU} onChange={handleInputFirstNameIU}/>
                        </div>
                        <div className='usersModalContainer__itemUser__input'>
                            <input disabled className='usersModalContainer__itemUser__input__prop' value={!inputLastNameIU?last_name:inputLastNameIU} onChange={handleInputLastNameIU}/>
                        </div>
                        <div className='usersModalContainer__itemUser__input'>
                            <input disabled type='email' className='usersModalContainer__itemUser__input__prop' value={!inputEmailIU?email:inputEmailIU} onChange={handleInputEmailIU}/>
                        </div>
                        <div className='usersModalContainer__itemUser__input'>
                            <input disabled className='usersModalContainer__itemUser__input__prop' value={!inputRoleIU?role:inputRoleIU} onChange={setInputRoleIU}/>
                        </div>
                        <div className='usersModalContainer__itemUser__btns'>
                            <button className='usersModalContainer__itemUser__btns__btn'>Borrar</button>
                            <button disabled id='btnUpdateShift' style={buttonDisabledStyle} className='usersModalContainer__itemUser__btns__btn'>Actualizar</button>
                        </div>
                    </>
                }
            </div>
            {
                confirmationDelUsersModal&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
    )
}

export default UsersListModal
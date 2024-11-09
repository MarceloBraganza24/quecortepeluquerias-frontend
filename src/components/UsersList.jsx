import React, { useEffect, useContext, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import {IsLoggedContext} from '../context/IsLoggedContext';
import {InputDataULContext} from '../context/InputDataULContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import HMenu from './HMenu';
import ItemUser from './ItemUser';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import CreateUserModalMobile from './CreateUserModalMobile';

const UsersList = () => {
    const { inputFirstNameUL, handleInputFirstNameUL, inputLastNameUL, handleInputLastNameUL, inputPasswordUL, handleInputPasswordUL, inputEmailUL, handleInputEmailUL,handleEmptyInputFirstNameUL,handleEmptyInputLastNameUL,handleEmptyInputPasswordUL,handleEmptyInputEmailUL } = useContext(InputDataULContext);
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [inputFilteredUsers, setInputFilteredUsers] = useState('');
    const [inputRoleUL, setInputRoleUL] = useState('');
    const [users, setUsers] = useState([]);
    const {menuOptionsModal,handleMenuOptionsModal,updateUsersModal,updateUserModalMobile,createUserModalMobile,handleCreateUserModalMobile} = useContext(OpenModalContext);
    const optionsRoleUL = ["user","admin", "premium"];
    const [isMonted, setIsMonted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isOpenCreateUserModalLocalMobile, setIsOpenCreateUserModalLocalMobile] = useState(false);

    const handleInputFilteredUsers = (e) => {
        const texto = e.target.value;
        setInputFilteredUsers(texto)
    }
    
    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    useEffect(() => {

        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchUsersData() {
                const response = await fetch(`${apiUrl}/api/users`)
                const usersAll = await response.json();
                if(!response.ok) {
                    toast('No se pudieron obtener los usuarios, contacte al administrador', {
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
                    setUsers(usersAll.data)
                }
            }
            if(users.length != 0) {
                fetchUsersData();
            }
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
            const cookieValue = getCookie('TokenJWT');
            const fetchUser = async () => {
                try {
                    const response = await fetch(`${apiUrl}/api/sessions/current?cookie=${cookieValue}`)
                    const data = await response.json();
                    if(data.error === 'jwt expired') {
                    logout();
                    window.location.href = '/login';
                } else {
                    const user = data.data
                    if(user) {
                        setUser(user)
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
            };
            fetchUser();
            if(cookieValue) {
                login()
            } else {
                logout()
            }
        }, 10000);
        return () => clearInterval(interval); 
    }, [isMonted]);

    useEffect(() => {
        menuOptionsModal&&handleMenuOptionsModal(false);
        async function fetchUsersData() {


            try {
                const response = await fetch(`${apiUrl}/api/users`)
                const usersAll = await response.json();
                if(!response.ok) {
                    toast('No se pudieron obtener los usuarios, contacte al administrador', {
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
                    setUsers(usersAll.data)
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            } finally {
                setIsLoading(false);
            }










            /* const response = await fetch(`${apiUrl}/api/users`)
            const usersAll = await response.json();
            if(!response.ok) {
                toast('No se pudieron obtener los usuarios, contacte al administrador', {
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
                setUsers(usersAll.data)
            } */
        }
        fetchUsersData();
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
        const cookieValue = getCookie('TokenJWT');
        const fetchUser = async () => {
            try {
              const response = await fetch(`${apiUrl}/api/sessions/current?cookie=${cookieValue}`)
              const data = await response.json();
              if(data.error === 'jwt expired') {
                logout();
                window.location.href = '/login';
              } else {
                const user = data.data
                if(user) {
                    setUser(user)
                }
              }
            } catch (error) {
              console.error('Error:', error);
            }
          };
        fetchUser();
        if(cookieValue) {
            login()
          } else {
            logout()
        }
        setTimeout(() => {
            setIsMonted(true);
        }, 10000)
    }, []);

    function filtrarPorApellido(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = users.filter(objeto => {
            const nombreMinusculas = objeto.last_name.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorApellido(inputFilteredUsers);

    const usersSinMi = objetosFiltrados.filter(item => item.email != 'marcelo_braganza@hotmail.com') 
    const usersSinRoot = usersSinMi.filter(item => item.email != 'lm@gmail.com') 

    usersSinRoot.sort((a, b) => {
        return new Date(b.user_datetime) - new Date(a.user_datetime);
    });

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
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
        } else if (!validateEmail(inputEmailUL)) {
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
                role: inputRoleUL?inputRoleUL:optionsRoleUL[0],
                password: inputPasswordUL,
                user_datetime: user_datetime
            }
            const response = await fetch(`${apiUrl}/api/sessions/singUp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(userToCreate)
            })
            if(response.ok) {
                toast('Has registrado un usuario correctamente!', {
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
                    cleanPropsCreateUser();
                    document.getElementById('btnCreateUser').style.display = 'block';
                    setShowSpinner(false);
                }, 2000);
            }
            const data = await response.json();
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

    const cleanPropsCreateUser = () => {
        handleEmptyInputFirstNameUL('');
        handleEmptyInputLastNameUL('');
        handleEmptyInputEmailUL('');
        handleEmptyInputPasswordUL('');
        setInputRoleUL(optionsRoleUL[0]);
    };

    const handleInputRoleUL = (e) => {
        const texto = e.target.value;
        setInputRoleUL(texto);
    } 

    const inputDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: 'white'
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };

    const handleBtnCreateUserModalMobile = () => {
        setIsOpenCreateUserModalLocalMobile(true);
        handleCreateUserModalMobile(true);
    };

  return (
    <>
        <NavBar/>
        {
            isLoggedIn && (user.role=='admin')?
            <>

                <div className='usersListContainer'>
                    <div className='usersListContainer__title'>- Usuarios -</div>
                    <div className='usersListContainer__inputFilteredUsers'>
                        {
                            !updateUsersModal&&!createUserModalMobile&&!updateUserModalMobile?
                            <input className='usersListContainer__inputFilteredUsers__prop' placeholder='Ingrese un apellido' value={inputFilteredUsers} onChange={handleInputFilteredUsers}/>
                            :
                            <input disabled style={inputDisabledStyle} className='usersListContainer__inputFilteredUsers__prop' placeholder='Ingrese un apellido'/>
                        }
                    </div>
                    <div className='usersListContainer__createUserMobile'>
                        <button onClick={handleBtnCreateUserModalMobile} className='usersListContainer__createUserMobile__btnCreateUser'>Crear usuario</button>
                        {isOpenCreateUserModalLocalMobile&&<CreateUserModalMobile setIsOpenCreateUserModalLocalMobile={setIsOpenCreateUserModalLocalMobile}/>}
                    </div>
                    <div className='usersListContainer__usersList'>
                        <div className='usersListContainer__usersList__lengthShifts'>
                            <div className='usersListContainer__usersList__lengthShifts__prop'>Cantidad de usuarios: {usersSinRoot.length}</div>
                        </div>
                        <div className='usersListContainer__usersList__headerMobile'>
                            <div className='usersListContainer__usersList__headerMobile__label'>Nombre</div>
                            <div className='usersListContainer__usersList__headerMobile__label'>Apellido</div>
                            <div className='usersListContainer__usersList__headerMobile__label'>Email</div>
                            <div className='usersListContainer__usersList__headerMobile__label'>Rol</div>
                        </div>
                        <div className='usersListContainer__usersList__header'>
                            <div className='usersListContainer__usersList__header__label'>Nombre</div>
                            <div className='usersListContainer__usersList__header__label'>Apellido</div>
                            <div className='usersListContainer__usersList__header__label'>Email</div>
                            <div className='usersListContainer__usersList__header__label'>Rol</div>
                            <div className='usersListContainer__usersList__header__label'>Contraseña</div>
                        </div>
                        <div className='itemCreateUser'>
                            {
                                !updateUsersModal?
                                <>
                                    <div className='itemCreateUser__input'>
                                        <input type='text' className='itemCreateUser__input__prop' placeholder='-' value={inputFirstNameUL} onChange={handleInputFirstNameUL}/>
                                    </div>
                                    <div className='itemCreateUser__input'>
                                        <input type='text' className='itemCreateUser__input__prop' placeholder='-' value={inputLastNameUL} onChange={handleInputLastNameUL}/>
                                    </div>
                                    <div className='itemCreateUser__input'>
                                        <input className='itemCreateUser__input__prop' type='email' placeholder='-' value={inputEmailUL} onChange={handleInputEmailUL}/>
                                    </div>
                                    <div className='itemCreateUser__selectRole'>
                                        <select className='itemCreateUser__selectRole__select' value={inputRoleUL} onChange={handleInputRoleUL}>
                                            {optionsRoleUL.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='itemCreateUser__input'>
                                        <input type='password' className='itemCreateUser__input__prop' placeholder='-' value={inputPasswordUL} onChange={handleInputPasswordUL}/>
                                    </div>
                                    <div className='itemCreateUser__btns'>
                                        <button id='btnCreateUser' className='itemCreateUser__btns__btn' onClick={handleBtnCreateUser}>Registrar usuario</button>
                                        {showSpinner&&<Spinner/>}
                                    </div>
                                </>
                                :
                                <>
                                    <div className='itemCreateUser__input'>
                                        <input disabled type='text' className='itemCreateUser__input__prop' placeholder='-' value={inputFirstNameUL} onChange={handleInputFirstNameUL}/>
                                    </div>
                                    <div className='itemCreateUser__input'>
                                        <input disabled type='text' className='itemCreateUser__input__prop' placeholder='-' value={inputLastNameUL} onChange={handleInputLastNameUL}/>
                                    </div>
                                    <div className='itemCreateUser__input'>
                                        <input disabled className='itemCreateUser__input__prop' placeholder='-' value={inputEmailUL} onChange={handleInputEmailUL}/>
                                    </div>
                                    <div className='itemCreateUser__input'>
                                        <input disabled className='itemCreateUser__input__prop' placeholder='-' value={inputRoleUL} onChange={handleInputRoleUL}/>
                                    </div>
                                    <div className='itemCreateUser__input'>
                                        <input disabled type='email' className='itemCreateUser__input__prop' placeholder='-' value={inputPasswordUL} onChange={handleInputPasswordUL}/>
                                    </div>
                                    <div className='itemCreateUser__btns'>
                                        <button disabled style={buttonDisabledStyle} id='btnCreateUser' className='itemCreateUser__btns__btn' onClick={handleBtnCreateUser}>Registrar usuario</button>
                                    </div>
                                </>
                            }
                        </div>
                        {
                            isLoading ?
                            <div className='myShiftsListContainer__withoutItems'>Cargando usuarios ...</div>
                            :
                            (usersSinRoot.length != 0) ?
                            usersSinRoot.map((user) => {
                                return(
                                    <ItemUser
                                    id={user._id}
                                    first_name={user.first_name}
                                    last_name={user.last_name}
                                    email={user.email}   
                                    role={user.role}
                                    />
                                )
                            })
                            :
                            <div className='myShiftsListContainer__withoutItems'>Aún no existen usuarios</div>
                        }
                    </div>
                </div>
                {
                    (usersSinRoot.length == 0) ?
                    <>
                        <div className='usersListContainer__blackDiv' style={{padding:'10vh 0vh'}}></div>
                        <div className='usersListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (usersSinRoot.length == 1) ?
                    <>
                        <div className='usersListContainer__blackDiv' style={{padding:'10vh 0vh'}}></div>
                        <div className='usersListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (usersSinRoot.length == 2) ?
                    <>
                        <div className='usersListContainer__blackDiv' style={{padding:'8vh 0vh'}}></div>
                        <div className='usersListContainer__blackDivMobile' style={{padding:'10vh 0vh'}}></div>
                    </>
                    : (usersSinRoot.length == 3) ?
                    <>
                        <div className='usersListContainer__blackDiv' style={{padding:'4vh 0vh'}}></div>
                        <div className='usersListContainer__blackDivMobile' style={{padding:'8vh 0vh'}}></div>
                    </>
                    : (usersSinRoot.length == 4) ?
                    <div className='usersListContainer__blackDivMobile' style={{padding:'4vh 0vh'}}></div>
                    : (usersSinRoot.length == 5) &&
                    <div className='usersListContainer__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                }
                <LogOut/>
            </>
            :
            <>
                <div className='warningLogin'>
                    <p className='warningLogin__prop'>Si aún no has iniciado sesión, <Link to={"/login"} className='warningLogin__link'>has click aquí</Link></p>
                </div>
                <div className='blackDiv'></div> 
            </>
        }
        <Footer/>
    </>
  )
}

export default UsersList
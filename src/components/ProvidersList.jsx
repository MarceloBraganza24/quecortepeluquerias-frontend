import React, { useEffect, useContext, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import {IsLoggedContext} from '../context/IsLoggedContext';
import {InputDataPrContext} from '../context/InputDataPrContext';
import HMenu from './HMenu';
import ItemProvider from './ItemProvider';
import { Link } from 'react-router-dom';
import {OpenModalContext} from '../context/OpenModalContext'; 
import Spinner from './Spinner';
import CreateProviderModalMobile from './CreateProviderModalMobile';

const ProvidersList = () => {
    const { inputBusinessNamePr, handleInputBusinessNamePr, inputCuitCuilPr, handleInputCuitCuilPr, inputPhonePr, handleInputPhonePr, inputEmailPr, handleInputEmailPr,handleEmptyInputBusinessNamePr,handleEmptyInputCuitCuilPr,handleEmptyInputPhonePr,handleEmptyInputEmailPr } = useContext(InputDataPrContext);
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [inputFilteredProviders, setInputFilteredProviders] = useState('');
    const [providers, setProviders] = useState([]);
    const {menuOptionsModal,handleMenuOptionsModal,updateProviderModal,updateProviderModalMobile,handleCreateProviderModalMobile,createProviderModalMobile} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isMonted, setIsMonted] = useState(false);
    const [isOpenCreateProviderModalLocalMobile, setIsOpenCreateProviderModalLocalMobile] = useState(false);

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchData() {
                const response = await fetch(`${apiUrl}/api/providers`)
                const providersAll = await response.json();
                setProviders(providersAll.data)
            }
            fetchData();
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
        async function fetchData() {
            const response = await fetch(`${apiUrl}/api/providers`)
            const providersAll = await response.json();
            setProviders(providersAll.data)
        }
        fetchData();
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

    providers.sort((a, b) => {
        return new Date(b.provider_datetime) - new Date(a.provider_datetime);
    });

    function filtrarPorRazonSocial(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = providers.filter(objeto => {
            const nombreMinusculas = objeto.business_name.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorRazonSocial(inputFilteredProviders);    

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnCreateProvider = async() => {
        if(!inputBusinessNamePr || !inputCuitCuilPr || !inputPhonePr || !inputEmailPr) {
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
        } else if (!validateEmail(inputEmailPr?inputEmailPr:email)) {
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
        } else if (!isValidUTF8(inputBusinessNamePr)) {
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
        } else if (!isValidUTF8(inputCuitCuilPr)) {
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
        } else if (!isValidUTF8(inputPhonePr)) {
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
        } else if (!isValidUTF8(inputEmailPr)) {
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
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const provider_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;
            document.getElementById('btnCreateProvider').style.display = 'none';
            setShowSpinner(true);
            const providerToCreate = {
                business_name: cleanString(inputBusinessNamePr),
                cuit_cuil: inputCuitCuilPr,
                phone: inputPhonePr,
                email: cleanString(inputEmailPr),
                provider_datetime: provider_datetime,
            }
            const response = await fetch(`${apiUrl}/api/providers/register`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(providerToCreate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has registrado un proveedor correctamente!', {
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
                    document.getElementById('btnCreateProvider').style.display = 'block';
                    setShowSpinner(false);   
                    cleanPropsCreateProvider();
                }, 2000);
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
                document.getElementById('btnCreateProvider').style.display = 'block';
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
                document.getElementById('btnCreateProvider').style.display = 'block';
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
                document.getElementById('btnCreateProvider').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    const cleanPropsCreateProvider = () => {
        handleEmptyInputBusinessNamePr('');
        handleEmptyInputCuitCuilPr('');
        handleEmptyInputPhonePr('');
        handleEmptyInputEmailPr('');
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };
    
    const selectDisabledStyle = {
        cursor: 'pointer',
        backgroundColor: 'white'
    };

    const handleBtnCreateProviderModalMobile = () => {
        setIsOpenCreateProviderModalLocalMobile(true);
        handleCreateProviderModalMobile(true);
    };

  return (
    <>
        <NavBar/>
        {
            isLoggedIn && user.role==='admin'?
            <>
                <div className='providersListContainer'>
                    <div className='providersListContainer__title'>- Proveedores -</div>
                    <div className='providersListContainer__inputFilteredProviders'>
                        {
                            !updateProviderModal&&!createProviderModalMobile&&!updateProviderModalMobile?
                            <input type='text' className='providersListContainer__inputFilteredProviders__prop' placeholder='Ingrese la razón social' value={inputFilteredProviders} onChange={(e) => {setInputFilteredProviders(e.target.value)}}/>
                            :
                            <input disabled style={selectDisabledStyle} type='text' className='providersListContainer__inputFilteredProviders__prop' placeholder='Ingrese la razón social' value={inputFilteredProviders} onChange={(e) => {setInputFilteredProviders(e.target.value)}}/>
                        }
                    </div>
                    <div className='providersListContainer__createProviderMobile'>
                        <button onClick={handleBtnCreateProviderModalMobile} className='providersListContainer__createProviderMobile__btnCreateProvider'>Crear proveedor</button>
                        {isOpenCreateProviderModalLocalMobile&&<CreateProviderModalMobile setIsOpenCreateProviderModalLocalMobile={setIsOpenCreateProviderModalLocalMobile}/>}
                    </div>
                    <div className='providersListContainer__providersList'>
                        <div className='providersListContainer__providersList__lengthShifts'>
                            <div className='providersListContainer__providersList__lengthShifts__prop'>Cantidad de proveedores: {objetosFiltrados.length}</div>
                        </div>
                        {
                            objetosFiltrados.length!=0&&
                            <div className='providersListContainer__providersList__headerMobile'>
                                <div className='providersListContainer__providersList__headerMobile__label'>Razon social</div>
                                <div className='providersListContainer__providersList__headerMobile__label'>CUIT-CUIL</div>
                            </div>
                        }
                        <div className='providersListContainer__providersList__header'>
                            <div className='providersListContainer__providersList__header__label'>Razon social</div>
                            <div className='providersListContainer__providersList__header__label'>CUIT-CUIL</div>
                            <div className='providersListContainer__providersList__header__label'>Teléfono</div>
                            <div className='providersListContainer__providersList__header__label'>Email</div>
                        </div>
                        <div className='itemCreateProvider'>
                            {
                                !updateProviderModal?
                                <>
                                    <div className='itemCreateProvider__input'>
                                        <input type='text' className='itemCreateProvider__input__prop' placeholder='-' value={inputBusinessNamePr} onChange={handleInputBusinessNamePr}/>
                                    </div>
                                    <div className='itemCreateProvider__input'>
                                        <input className='itemCreateProvider__input__prop' placeholder='-' maxLength={11} value={inputCuitCuilPr} onChange={handleInputCuitCuilPr}/>
                                    </div>
                                    <div className='itemCreateProvider__input'>
                                        <input className='itemCreateProvider__input__prop' placeholder='-' maxLength={13} value={inputPhonePr} onChange={handleInputPhonePr}/>
                                    </div>
                                    <div className='itemCreateProvider__input'>
                                        <input type='email' className='itemCreateProvider__input__prop' placeholder='-' value={inputEmailPr} onChange={handleInputEmailPr}/>
                                    </div>
                                    <div className='itemCreateProvider__btns'>
                                        <button id='btnCreateProvider' className='itemCreateProvider__btns__btn' onClick={handleBtnCreateProvider}>Registrar proveedor</button>
                                        {showSpinner&&<Spinner/>}
                                    </div>
                                </>
                                :
                                <>
                                    <div className='itemCreateProvider__input'>
                                        <input disabled type='text' className='itemCreateProvider__input__prop' placeholder='-' value={inputBusinessNamePr} onChange={handleInputBusinessNamePr}/>
                                    </div>
                                    <div className='itemCreateProvider__input'>
                                        <input disabled className='itemCreateProvider__input__prop' placeholder='-' value={inputCuitCuilPr} onChange={handleInputCuitCuilPr}/>
                                    </div>
                                    <div className='itemCreateProvider__input'>
                                        <input disabled className='itemCreateProvider__input__prop' placeholder='-' value={inputPhonePr} onChange={handleInputPhonePr}/>
                                    </div>
                                    <div className='itemCreateProvider__input'>
                                        <input disabled type='text' className='itemCreateProvider__input__prop' placeholder='-' value={inputEmailPr} onChange={handleInputEmailPr}/>
                                    </div>
                                    <div className='itemCreateProvider__btns'>
                                        <button disabled style={buttonDisabledStyle} id='btnCreateProvider' className='itemCreateProvider__btns__btn'>Registrar proveedor</button>
                                    </div>
                                </>
                            }
                        </div>
                        {
                                objetosFiltrados.map((provider) => {
                                    return(
                                        <ItemProvider
                                        id={provider._id}
                                        businessName={provider.business_name}
                                        cuitCuil={provider.cuit_cuil}
                                        phone={provider.phone}
                                        email={provider.email}
                                        />
                                    )
                                })
                        }
                    </div>
                    {
                        (objetosFiltrados.length == 0) && 
                        <div className='myShiftsListContainer__withoutItems'>Aún no existen proveedores</div>
                    }
                </div>
                {
                    (objetosFiltrados.length == 0) ?
                    <>
                        <div className='providersListContainer__blackDiv' style={{padding:'12vh 0vh'}}></div>
                        <div className='providersListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 1) ?
                    <>
                        <div className='providersListContainer__blackDiv' style={{padding:'10vh 0vh'}}></div>
                        <div className='providersListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 2) ?
                    <>
                        <div className='providersListContainer__blackDiv' style={{padding:'8vh 0vh'}}></div>
                        <div className='providersListContainer__blackDivMobile' style={{padding:'10vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 3) ?
                    <>
                        <div className='providersListContainer__blackDiv' style={{padding:'4vh 0vh'}}></div>
                        <div className='providersListContainer__blackDivMobile' style={{padding:'5vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 4) ?
                    <div className='providersListContainer__blackDivMobile' style={{padding:'1vh 0vh'}}></div>
                    : (objetosFiltrados.length == 5) &&
                    <div className='providersListContainer__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
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

export default ProvidersList
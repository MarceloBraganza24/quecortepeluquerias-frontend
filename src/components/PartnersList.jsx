import React, { useEffect, useContext, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import {IsLoggedContext} from '../context/IsLoggedContext';
import {InputDataPaLContext} from '../context/InputDataPaLContext';
import HMenu from './HMenu';
import ItemPartner from './ItemPartner';
import { Link } from 'react-router-dom';
import {OpenModalContext} from '../context/OpenModalContext'; 
import Spinner from './Spinner';
import CreatePartnerModalMobile from './CreatePartnerModalMobile';

const PartnersList = () => {
    const { inputFirstNamePaL, handleInputFirstNamePaL, inputLastNamePaL, handleInputLastNamePaL, inputParnerNumberPaL, handleInputPartnerNumberPaL,handleInputPartnerNumberDosPaL,inputParnerNumberDosPaL, inputEmailPaL, handleInputEmailPaL,handleEmptyInputFirstNamePaL,handleEmptyInputLastNamePaL,handleEmptyInputPartnerNumberPaL,handleEmptyInputEmailPaL,selectOptionMembershipNumber,handleSelectOptionMembershipNumberShL,inputPointsPaL,handleInputPointsPaL,handleEmptyInputPointsPaL } = useContext(InputDataPaLContext);
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [inputFilteredPartners, setInputFilteredPartners] = useState('');
    const [partners, setPartners] = useState([]);
    const {menuOptionsModal,handleMenuOptionsModal,updatePartnerModal,payMembershipFeeModal,handleCreatePartnerModalMobile} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isMonted, setIsMonted] = useState(false);
    const [isOpenCreatePartnerModalLocalMobile, setIsOpenCreatePartnerModalLocalMobile] = useState(false);
    const optionsMembershipNumber = [];
    const optionsCompleteMembershipNumber = [];
    const [prices, setPrices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    for (let i = 1; i <= 300; i++) {
        optionsCompleteMembershipNumber.push(i)
    }

    const palabrasABuscar = ["cuota", "socio"];
    const membershipFees = prices.find(objeto => 
        palabrasABuscar.every(palabra => 
        objeto.title.toLowerCase().includes(palabra.toLowerCase())
        )
    );

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    const membershipNumbers = partners.map(partner => partner.partner_number)

    function uniqueElements(arr1, arr2) {
        const combined = arr1.concat(arr2);
        const elementCount = combined.reduce((acc, element) => {
            acc[element] = (acc[element] || 0) + 1;
            return acc;
        }, {});
        const unique = combined.filter(element => elementCount[element] === 1);
        return unique;
    }
    let resultCompleteMembershipNumber = uniqueElements(optionsCompleteMembershipNumber, membershipNumbers);
    resultCompleteMembershipNumber.forEach((element) => {
        optionsMembershipNumber.push(element)
    })

    
    
    partners.sort((a, b) => a.partner_number - b.partner_number);

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchData() {
                const response = await fetch(`${apiUrl}/api/partners`)
                const partnersAll = await response.json();
                setPartners(partnersAll.data)
            }
            fetchData();
            async function fetchPricesData() {
                const response = await fetch(`${apiUrl}/api/prices`)
                const pricesAll = await response.json();
                setPrices(pricesAll.data)
            }
            fetchPricesData();
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

            try {
                const response = await fetch(`${apiUrl}/api/partners`)
                const partnersAll = await response.json();
                if(!response.ok) {
                    toast('No se pudieron obtener los socios, contacte al administrador', {
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
                    setPartners(partnersAll.data)
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            } finally {
                setIsLoading(false);
            }

            /* const response = await fetch(`${apiUrl}/api/partners`)
            const partnersAll = await response.json();
            setPartners(partnersAll.data) */
        }
        fetchData();
        async function fetchPricesData() {
            const response = await fetch(`${apiUrl}/api/prices`)
            const pricesAll = await response.json();
            setPrices(pricesAll.data)
        }
        fetchPricesData();
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

    /* partners.sort((a, b) => {
        return new Date(b.partner_datetime) - new Date(a.partner_datetime);
    }); */

    function filtrarPorApellido(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = partners.filter(objeto => {
            const nombreMinusculas = objeto.last_name.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorApellido(inputFilteredPartners); 

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const cleanPropsCreatePartner = () => {
        handleEmptyInputFirstNamePaL('');
        handleEmptyInputLastNamePaL('');
        handleEmptyInputPointsPaL('');
        handleEmptyInputEmailPaL('');
        handleSelectOptionMembershipNumberShL(optionsMembershipNumber[0]);
    };

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
        } else if (!validateEmail(inputEmailPaL)) {
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
        } else if (!membershipFees) {
            toast('Debes guardar el precio de la cuota de socio desde Configuración', {
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

    const nonPartnerRegister = () => {
        toast('Aún no puedes registrar un socio, comunícate con el administrador!', {
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
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };
    
    const selectDisabledStyle = {
        cursor: 'pointer',
        backgroundColor: 'white'
    };

    const handleBtnCreatePartnerModalMobile = () => {
        setIsOpenCreatePartnerModalLocalMobile(true);
        handleCreatePartnerModalMobile(true);
    };

  return (
    <>
        <NavBar/>
        {
            isLoggedIn && user.role==='admin'?
            <>

                <div className='partnersListContainer'>
                    <div className='partnersListContainer__title'>- Socios -</div>
                    <div className='partnersListContainer__inputFilteredPartners'>
                        {
                            !updatePartnerModal&&!payMembershipFeeModal?
                            <input id='inputFilteredPartners' type='text' className='partnersListContainer__inputFilteredPartners__prop' placeholder='Ingrese un apellido' value={inputFilteredPartners} onChange={(e) => {setInputFilteredPartners(e.target.value)}}/>
                            :
                            <input disabled style={selectDisabledStyle} id='inputFilteredPartners' type='text' className='partnersListContainer__inputFilteredPartners__prop' placeholder='Ingrese un apellido' value={inputFilteredPartners} onChange={(e) => {setInputFilteredPartners(e.target.value)}}/>
                        }
                    </div>
                    <div className='partnersListContainer__createPartnerMobile'>
                        <button onClick={handleBtnCreatePartnerModalMobile} className='partnersListContainer__createPartnerMobile__btnCreatePartner'>Crear socio</button>
                        {isOpenCreatePartnerModalLocalMobile&&<CreatePartnerModalMobile resultCompleteMembershipNumber={resultCompleteMembershipNumber}  setIsOpenCreatePartnerModalLocalMobile={setIsOpenCreatePartnerModalLocalMobile}/>}
                    </div>
                    <div className='partnersListContainer__partnersList__lengthShifts'>
                        <div className='partnersListContainer__partnersList__lengthShifts__prop'>Cantidad de socios: {objetosFiltrados.length}</div>
                    </div>
                    <div className='partnersListContainer__partnersList'>
                        {
                            objetosFiltrados.length!=0&&
                            <div className='partnersListContainer__partnersList__headerMobile'>
                                <div className='partnersListContainer__partnersList__headerMobile__label'>N° socio</div>
                                <div className='partnersListContainer__partnersList__headerMobile__label'>Puntos</div>
                                <div className='partnersListContainer__partnersList__headerMobile__label'>Nombre</div>
                                <div className='partnersListContainer__partnersList__headerMobile__label'>Apellido</div>
                            </div>
                        }
                        <div className='partnersListContainer__partnersList__header'>
                            <div className='partnersListContainer__partnersList__header__label'>N° socio</div>
                            <div className='partnersListContainer__partnersList__header__label'>Puntos</div>
                            <div className='partnersListContainer__partnersList__header__label'>Nombre</div>
                            <div className='partnersListContainer__partnersList__header__label'>Apellido</div>
                            <div className='partnersListContainer__partnersList__header__label'>Email</div>
                        </div>
                        <div className='itemCreatePartner'>
                            {
                                !updatePartnerModal&&!payMembershipFeeModal?
                                <>
                                    <div className='itemCreatePartner__select'>
                                        <select className='itemCreatePartner__select__prop' value={selectOptionMembershipNumber} onChange={(e) => {handleSelectOptionMembershipNumberShL(e.target.value)}}>
                                            {optionsMembershipNumber.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='itemCreatePartner__input'>
                                        <input type='text' className='itemCreatePartner__input__prop' placeholder='-' value={inputPointsPaL} onChange={handleInputPointsPaL}/>
                                    </div>
                                    <div className='itemCreatePartner__input'>
                                        <input type='text' className='itemCreatePartner__input__prop' placeholder='-' value={inputFirstNamePaL} onChange={handleInputFirstNamePaL}/>
                                    </div>
                                    <div className='itemCreatePartner__input'>
                                        <input type='text' className='itemCreatePartner__input__prop' placeholder='-' value={inputLastNamePaL} onChange={handleInputLastNamePaL}/>
                                    </div>
                                    <div className='itemCreatePartner__input'>
                                        <input type='email' className='itemCreatePartner__input__prop' placeholder='-' value={inputEmailPaL} onChange={handleInputEmailPaL}/>
                                    </div>
                                    <div className='itemCreatePartner__btns'>
                                        <button id='btnCreatePartner' className='itemCreatePartner__btns__btn' onClick={handleBtnCreatePartner}>Registrar socio</button>
                                        {/* <button id='btnCreatePartner' className='itemCreatePartner__btns__btn' onClick={nonPartnerRegister}>Registrar socio</button> */}
                                        {showSpinner&&<Spinner/>}
                                    </div>
                                </>
                                :
                                <>
                                    <div className='itemCreatePartner__input'>
                                        <select disabled className='itemCreatePartner__select__prop' value={selectOptionMembershipNumber} onChange={(e) => {handleSelectOptionMembershipNumberShL(e.target.value)}}>
                                            {optionsMembershipNumber.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='itemCreatePartner__input'>
                                        <input disabled type='text' className='itemCreatePartner__input__prop' placeholder='-' value={inputPointsPaL} onChange={handleInputPointsPaL}/>
                                    </div>
                                    <div className='itemCreatePartner__input'>
                                        <input disabled type='text' className='itemCreatePartner__input__prop' placeholder='-' value={inputFirstNamePaL} onChange={handleInputFirstNamePaL}/>
                                    </div>
                                    <div className='itemCreatePartner__input'>
                                        <input disabled type='text' className='itemCreatePartner__input__prop' placeholder='-' value={inputLastNamePaL} onChange={handleInputLastNamePaL}/>
                                    </div>
                                    <div className='itemCreatePartner__input'>
                                        <input disabled type='email' className='itemCreatePartner__input__prop' placeholder='-' value={inputEmailPaL} onChange={handleInputEmailPaL}/>
                                    </div>
                                    <div className='itemCreatePartner__btns'>
                                        <button disabled style={buttonDisabledStyle} id='btnCreatePartner' className='itemCreatePartner__btns__btn'>Registrar socio</button>
                                    </div>
                                </>
                            }
                        </div>
                        {
                            isLoading ?
                            <div className='myShiftsListContainer__withoutItems'>Cargando socios&nbsp;&nbsp;<Spinner/></div>
                            :
                            (partners.length != 0) ?
                            inputFilteredPartners===''?
                                partners.map((partner) => {
                                    return(
                                        <ItemPartner
                                        id={partner._id}
                                        first_name={partner.first_name}
                                        last_name={partner.last_name}
                                        partner_number={partner.partner_number}
                                        email={partner.email} 
                                        points={partner.points} 
                                        resultCompleteMembershipNumber={resultCompleteMembershipNumber} 
                                        />
                                    )
                                })
                            :
                                objetosFiltrados.map((partner) => {
                                    return(
                                        <ItemPartner
                                        id={partner._id}
                                        first_name={partner.first_name}
                                        last_name={partner.last_name}
                                        partner_number={partner.partner_number}
                                        points={partner.points} 
                                        email={partner.email}   
                                        resultCompleteMembershipNumber={resultCompleteMembershipNumber} 
                                        />
                                    )
                                })
                            :
                            <div className='myShiftsListContainer__withoutItems'>Aún no existen socios</div>
                        }
                    </div>
                </div>
                {
                    (objetosFiltrados.length == 0) ?
                    <>
                        <div className='partnersListContainer__blackDiv' style={{padding:'12vh 0vh'}}></div>
                        <div className='partnersListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 1) ?
                    <>
                        <div className='partnersListContainer__blackDiv' style={{padding:'10vh 0vh'}}></div>
                        <div className='partnersListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 2) ?
                    <>
                        <div className='partnersListContainer__blackDiv' style={{padding:'6vh 0vh'}}></div>
                        <div className='partnersListContainer__blackDivMobile' style={{padding:'10vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 3) ?
                    <>
                        <div className='partnersListContainer__blackDiv' style={{padding:'4vh 0vh'}}></div>
                        <div className='partnersListContainer__blackDivMobile' style={{padding:'5vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 4) ?
                    <>
                        <div className='partnersListContainer__blackDivMobile' style={{padding:'1vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 5) &&
                    <>
                        <div className='partnersListContainer__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                    </>
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

export default PartnersList
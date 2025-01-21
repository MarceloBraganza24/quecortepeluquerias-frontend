import React, { useEffect, useContext, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import 'react-datepicker/dist/react-datepicker.css';
import Spinner from './Spinner';
import ItemMyShift from './ItemMyShift';

const MyShifts = () => {
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const {menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
    const [user, setUser] = useState('');
    const [shifts, setShifts] = useState([]);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [holidays, setHolidays] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    let shiftsByEmail = [];
    if(shifts && (shifts.length!=0)) {
        shiftsByEmail = shifts.filter(shift => shift.email == user.email)
    }
    shifts.length!=0&&shiftsByEmail.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchShiftsData() {
                const response = await fetch(`${apiUrl}/api/shifts`)
                const shiftsAll = await response.json();
                if(!response.ok) {
                    toast('No se pudieron obtener los turnos, contacte a la peluquería', {
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
                    setShifts(shiftsAll.data)
                }
            }
            if(shifts.length != 0) {
                fetchShiftsData();
            }
            async function fetchHolidaysData() {
                const response = await fetch(`${apiUrl}/api/holidays`)
                const holidaysAll = await response.json();
                setHolidays(holidaysAll.data)
            }
            fetchHolidaysData();
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
        async function fetchShiftsData() {


            try {
                const response = await fetch(`${apiUrl}/api/shifts`)
                const shiftsAll = await response.json();
                if(!response.ok) {
                    toast('No se pudieron obtener los turnos, contacte al administrador', {
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
                    setShifts(shiftsAll.data)
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchShiftsData();
        async function fetchHolidaysData() {
            const response = await fetch(`${apiUrl}/api/holidays`)
            const holidaysAll = await response.json();
            setHolidays(holidaysAll.data)
        }
        fetchHolidaysData();
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

    return (
        <>
            <NavBar/>
            {
                isLoggedIn && (user.role==='admin' || user.role==='premium' || user.role==='user')?
                <>
                    <div className='myShiftsListContainer'>
                        <div className='myShiftsListContainer__title'>- Mis turnos -</div>
                        {
                            isLoading ?
                            <div className='myShiftsListContainer__withoutItems'>Cargando turnos&nbsp;&nbsp;<Spinner/></div>
                            :
                            (shiftsByEmail.length != 0) ?
                                <>
                                    <div className='myShiftsListContainer__myShiftsList__lengthShifts'>
                                        <div className='myShiftsListContainer__myShiftsList__lengthShifts__prop'>Cantidad de turnos: {shiftsByEmail.length}</div>
                                    </div>
                                    <div className='myShiftsListContainer__myShiftsList'>
                                        <div className='myShiftsListContainer__myShiftsList__headerMobile'>
                                            <div className='myShiftsListContainer__myShiftsList__headerMobile__label'>Fecha</div>
                                            <div className='myShiftsListContainer__myShiftsList__headerMobile__label'>Horario</div>
                                            <div className='myShiftsListContainer__myShiftsList__headerMobile__label'>Nombre</div>
                                            <div className='myShiftsListContainer__myShiftsList__headerMobile__label'>Apellido</div>
                                        </div>
                                        <div className='myShiftsListContainer__myShiftsList__header'>
                                            <div className='myShiftsListContainer__myShiftsList__header__label'>Nombre</div>
                                            <div className='myShiftsListContainer__myShiftsList__header__label'>Apellido</div>
                                            <div className='myShiftsListContainer__myShiftsList__header__label'>Email</div>
                                            <div className='myShiftsListContainer__myShiftsList__header__label'>Peluquero</div>
                                            <div className='myShiftsListContainer__myShiftsList__header__label'>Servicio</div>
                                            <div className='myShiftsListContainer__myShiftsList__header__label'>Fecha</div>
                                            <div className='myShiftsListContainer__myShiftsList__header__label'>Horario</div>
                                        </div>
                                        {

                                            shiftsByEmail.map((shift) => {
                                                    return(
                                                        <ItemMyShift
                                                        id={shift._id}
                                                        hairdresser={shift.hairdresser}
                                                        first_name={shift.first_name}
                                                        last_name={shift.last_name}
                                                        service={shift.service}
                                                        email={shift.email}   
                                                        date={shift.date}
                                                        schedule={shift.schedule}
                                                        shifts={shifts}
                                                        holidaysData={holidays}
                                                        isLoading={isLoading}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                </>
                            :
                            <div className='myShiftsListContainer__withoutItems'>Aún no existen turnos</div>
                        }
                    </div>
                    {
                        (shiftsByEmail.length == 0) ?
                        <>
                            <div className='myShiftsListContainer__blackDiv' style={{padding:'28vh 0vh'}}></div>
                            <div className='myShiftsListContainer__blackDivMobile' style={{padding:'30vh 0vh'}}></div>
                        </>
                        : (shiftsByEmail.length == 1) ?
                        <>
                            <div className='myShiftsListContainer__blackDiv' style={{padding:'22vh 0vh'}}></div>
                            <div className='myShiftsListContainer__blackDivMobile' style={{padding:'20vh 0vh'}}></div>
                        </>
                        : (shiftsByEmail.length == 2) ?
                        <>
                            <div className='myShiftsListContainer__blackDiv' style={{padding:'18vh 0vh'}}></div>
                            <div className='myShiftsListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                        </>
                        : (shiftsByEmail.length == 3) ?
                        <>
                            <div className='myShiftsListContainer__blackDiv' style={{padding:'15vh 0vh'}}></div>
                            <div className='myShiftsListContainer__blackDivMobile' style={{padding:'12vh 0vh'}}></div>
                        </>
                        : (shiftsByEmail.length == 4) ?
                        <>
                            <div className='myShiftsListContainer__blackDiv' style={{padding:'12vh 0vh'}}></div>
                            <div className='myShiftsListContainer__blackDivMobile' style={{padding:'8vh 0vh'}}></div>
                        </>
                        : (shiftsByEmail.length == 5) ?
                        <>
                            <div className='myShiftsListContainer__blackDiv' style={{padding:'8vh 0vh'}}></div>
                            <div className='myShiftsListContainer__blackDivMobile' style={{padding:'4vh 0vh'}}></div>
                        </>
                        : (shiftsByEmail.length == 6) ?
                        <>
                            <div className='myShiftsListContainer__blackDiv' style={{padding:'6vh 0vh'}}></div>
                            <div className='myShiftsListContainer__blackDivMobile' style={{padding:'2vh 0vh'}}></div>
                        </>
                        : (shiftsByEmail.length == 7) &&
                        <>
                            <div className='myShiftsListContainer__blackDiv' style={{padding:'2vh 0vh'}}></div>
                            <div className='myShiftsListContainer__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                        </>
                    }
                    <LogOut/>
                </>
                :
                <div className='blackDiv'><Spinner/></div>
            }
            <Footer/>
        </>
      )

}

export default MyShifts
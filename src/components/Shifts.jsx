import React, { useState, useEffect, useContext } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import {IsLoggedContext} from '../context/IsLoggedContext';
import {InputDataShContext} from '../context/InputDataShContext';
import {BtnMPContext} from '../context/BtnMPContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import { Link } from 'react-router-dom';
import HMenu from './HMenu';
import moment from 'moment-timezone'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
registerLocale('es', es);
setDefaultLocale('es');

import { format } from 'date-fns';
import Spinner from './Spinner';

const Shifts = () => {
    initMercadoPago('APP_USR-c6a80bf1-6064-4d38-85c2-873ae24113ef', {
        locale: 'es-AR'
    });
    const apiUrl = import.meta.env.VITE_API_URL;
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const {handleBtnBuyVisible} = useContext(BtnMPContext);
    const pagarTurnoBtn = document.getElementById('pagarTurnoBtn');
    const {menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
    const [admPremPreferenceId, setAdmPremPreferenceId] = useState(null);
    const [preferenceId, setPreferenceId] = useState(null);
    const { inputFirstNameSh, handleInputFirstNameSh, inputLastNameSh, handleInputLastNameSh, inputEmailSh, handleInputEmailSh, inputDateSh, handleInputDateSh, inputOptionServiceSh, handleInputOptionServiceSh, selectScheduleSh, handleSelectScheduleSh, inputPriceSh,selectOptionHairdresserSh,handleSelectOptionHairdresserSh} = useContext(InputDataShContext);
    const [shifts, setShifts] = useState([]);
    const [hairdressers, setHairdressers] = useState([]);
    const [holidays, setHolidays] = useState([]);
    //const [prices, setPrices] = useState([]);
    const [workDays, setWorkDays] = useState([]);
    const [services, setServices] = useState([]);
    const [saveConfirmationShiftModal, setSaveConfirmationShiftModal] = useState(false);
    const [isWantPay, setIsWantPay] = useState(false);
    const [isMonted, setIsMonted] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isBtnShiftRegisterBlocked, setIsBtnShiftRegisterBlocked] = useState(false);

    const optionsService = ['Elija su servicio'];

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }
    
    if(!user.isMembershipFeePaid) {
        const noPartnersServices = services.filter(service => service.category == 'No socio')
        noPartnersServices.forEach(res => {
            optionsService.push(res.title)
        })
    } else {
        const partnersServices = services.filter(service => service.category == 'Socio')
        partnersServices.forEach(res => {
            optionsService.push(res.title)
        })
    }

    const formatedDate = format(inputDateSh, 'yyyy-MM-dd');

    const dateToCompareHoliday = {
        date: formatedDate,
        hairdresser: selectOptionHairdresserSh
    }
    const existsHoliday = holidays.some(holiday =>
        holiday.date == dateToCompareHoliday.date &&
        holiday.hairdresser == dateToCompareHoliday.hairdresser
    );
    
    const formatedNewDate = moment.tz(formatedDate, 'UTC');
    const dayFormatedNewDate = formatedNewDate.day();
    
    const workDaysByHairdresserWorkDayFiltered = workDays.filter(item => (item.hairdresser == selectOptionHairdresserSh && (item.work_day == (dayFormatedNewDate==6&&'Sabado')))
        || (item.hairdresser == selectOptionHairdresserSh && (item.work_day == (dayFormatedNewDate==1&&'Lunes'))) 
        || (item.hairdresser == selectOptionHairdresserSh && (item.work_day == (dayFormatedNewDate==2&&'Martes'))) 
        || (item.hairdresser == selectOptionHairdresserSh && (item.work_day == (dayFormatedNewDate==3&&'Miercoles'))) 
        || (item.hairdresser == selectOptionHairdresserSh && (item.work_day == (dayFormatedNewDate==4&&'Jueves'))) 
        || (item.hairdresser == selectOptionHairdresserSh && (item.work_day == (dayFormatedNewDate==5&&'Viernes'))) 
        || (item.hairdresser == selectOptionHairdresserSh && (item.work_day == (dayFormatedNewDate==0&&'Domingo'))) 
    )

    const schedulesByHairdresserDate = workDaysByHairdresserWorkDayFiltered.map(item => item.schedule)
    schedulesByHairdresserDate.sort((a, b) => {
        const timeA = a.split(':').map(Number);
        const timeB = b.split(':').map(Number);
        const totalMinutesA = timeA[0] * 60 + timeA[1];
        const totalMinutesB = timeB[0] * 60 + timeB[1];
    
        return totalMinutesA - totalMinutesB;
    });

    const shiftsFiltered = shifts.filter(shift => shift.hairdresser == selectOptionHairdresserSh && shift.date == formatedDate);
    const schedulesHairdressersFilteredByNotCancel = shiftsFiltered.map(item => item.schedule)

    const optionsScheduleSh = [];

    let filteredArray = schedulesByHairdresserDate.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));

    if(filteredArray.length == 0) {
        optionsScheduleSh.push('No hay horarios')
    } else {
        filteredArray.forEach(res => {
            optionsScheduleSh.push(res)
        })
    }
    
    const optionsHairdresser = ['Peluquero'];
    hairdressers.forEach(res => {
        optionsHairdresser.push(res.name)
    })

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchShiftsData() {
                const response = await fetch(`${apiUrl}/api/shifts`)
                const shiftsAll = await response.json();
                if(!response.ok) {
                    toast('No se pudieron obtener los turnos disponibles, contacte a la peluquería', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    setIsBtnShiftRegisterBlocked(true);
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
            async function fetchHairdressersData() {
                const response = await fetch(`${apiUrl}/api/hairdressers`)
                const hairdressersAll = await response.json();
                setHairdressers(hairdressersAll.data)
            }
            fetchHairdressersData();
            async function fetchServicesData() {
                const response = await fetch(`${apiUrl}/api/services`)
                const servicesAll = await response.json();
                setServices(servicesAll.data)
            }
            fetchServicesData();
            async function fetchWorkDaysData() {
                const response = await fetch(`${apiUrl}/api/workDays`)
                const workDaysAll = await response.json();
                setWorkDays(workDaysAll.data)
            }
            fetchWorkDaysData();
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
            const fetchData = async () => {
                try {
                const response = await fetch(`${apiUrl}/api/sessions/current?cookie=${cookieValue}`)
                if(!response.ok) {
                    window.location.href = '/login';
                }
                const data = await response.json();
                if(data.error === 'jwt expired') {
                    logout();
                    window.location.href = '/login';
                } else {
                    const user = data.data
                    if(user) {
                        setUser(user);
                    }
                }
                } catch (error) {
                console.error('Error:', error);
                }
            };
            fetchData();
            if(cookieValue) {
                login()
            } else {
                logout()
            }
        }, 10000);

        return () => {
            handleBtnBuyVisible(false);
            clearInterval(interval);
        };
    }, [isMonted]);
    
    useEffect(() => {
        
        menuOptionsModal&&handleMenuOptionsModal(false);
        async function fetchShiftsData() {
            const response = await fetch(`${apiUrl}/api/shifts`)
            const shiftsAll = await response.json();
            if(!response.ok) {
                toast('No se pudieron obtener los turnos disponibles, contacte a la peluquería', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setIsBtnShiftRegisterBlocked(true);
            } else {
                setShifts(shiftsAll.data)
            }
        }
        fetchShiftsData();

        async function fetchHairdressersData() {
            const response = await fetch(`${apiUrl}/api/hairdressers`)
            const hairdressersAll = await response.json();
            setHairdressers(hairdressersAll.data)
        }
        fetchHairdressersData();
        async function fetchServicesData() {
            const response = await fetch(`${apiUrl}/api/services`)
            const servicesAll = await response.json();
            setServices(servicesAll.data)
        }
        fetchServicesData();
        async function fetchHolidaysData() {
            const response = await fetch(`${apiUrl}/api/holidays`)
            const holidaysAll = await response.json();
            setHolidays(holidaysAll.data)
        }
        fetchHolidaysData();
        async function fetchWorkDaysData() {
            const response = await fetch(`${apiUrl}/api/workDays`)
            const workDaysAll = await response.json();
            setWorkDays(workDaysAll.data)
        }
        fetchWorkDaysData();
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
        const fetchData = async () => {
            try {
            const response = await fetch(`${apiUrl}/api/sessions/current?cookie=${cookieValue}`)
            if(!response.ok) {
                window.location.href = '/login';
            }
            const data = await response.json();
            if(data.error === 'jwt expired') {
                logout();
                window.location.href = '/login';
            } else {
                const user = data.data
                if(user) {
                    setUser(user);
                }
            }
            } catch (error) {
            console.error('Error:', error);
            }
        };
        fetchData();
        if(cookieValue) {
            login()
        } else {
            logout()
        }

        setTimeout(() => {
            setIsMonted(true);
        }, 10000)

        return () => {
            handleBtnBuyVisible(false);
        };
    }, []);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const nonRegisterYet = () => {
        toast('Aún no puedes registrar un turno, contáctate con la peluquería para solicitar el permiso', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const fechaActual = new Date();
    const concat = formatedDate + ' ' + (selectScheduleSh?selectScheduleSh:optionsScheduleSh[0]);
    const newFormatedDate = new Date(concat);

    const fecha15DiasDespues = new Date(fechaActual);
    fecha15DiasDespues.setDate(fechaActual.getDate() + 15);

    const pagarTurno = async () => {
        try {
            const order = {
                title: `Corte ${inputOptionServiceSh}`,
                quantity: 1,
                unit_price: inputPriceSh,
                first_name: inputFirstNameSh,
                last_name: inputLastNameSh,
                email: inputEmailSh,
                date: formatedDate,
                schedule: selectScheduleSh?selectScheduleSh:optionsScheduleSh[0]
            }
            if(!inputFirstNameSh || !inputLastNameSh || !inputEmailSh || !formatedDate || !inputPriceSh) {
                toast('Debes completar todos los campos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!validateEmail(inputEmailSh)) {
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
            } else if (inputDateSh.getDay() == 0 || inputDateSh.getDay() == 1) {
                toast('Elige un dia entre martes y sabado!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if(newFormatedDate < fechaActual) {
                toast('Debes ingresar una fecha a futuro', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if(selectOptionHairdresserSh == 'Peluquero') {
                toast('Debes elegir un peluquero', {
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
                const preference = await fetch(`${apiUrl}/api/payments/create-preference-shift`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(order)
                })
                const response = await preference.json();
                if(response.id) {
                    pagarTurnoBtn.style.display = 'none';
                    const id = response.id;
                    return id;
                } else {
                    toast('Ha ocurrido un error al intentar pagar el turno, intente nuevamente', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });                    
                }
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleBuy = async (evt) => {
        evt.preventDefault();
        const id = await pagarTurno();
        if(id) {
            setPreferenceId(id);
            handleBtnBuyVisible(true);
        }
            
    };

    const handleAdmPremBuy = async (evt) => {
        evt.preventDefault();
        const id = await pagarTurno();
        if(id) {
            setAdmPremPreferenceId(id);
            handleBtnBuyVisible(true);
        }
            
    };

    const handleDateChange = date => {
        handleInputDateSh(date);
    };
    
    const loginToast = async (evt) => {
        evt.preventDefault();
        toast('Debes iniciar sesión para registrar un turno', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const styleDisabledBtns = {
        backgroundColor: 'grey',
        border: 'none'
    }

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnSaveShift = () => {

        if(!inputFirstNameSh || !inputLastNameSh || !inputEmailSh) {
            toast('Debes completar todos los campos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (inputOptionServiceSh=='' || inputOptionServiceSh=='Elija su servicio') {
            toast('Debes elegir el servicio!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!validateEmail(inputEmailSh)) {
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
        } else if (inputDateSh.getDay() == 0 || inputDateSh.getDay() == 1) {
            toast('Elige un dia entre martes y sabado!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(existsHoliday) {
            toast('En la fecha ingresada el peluquero se encuenta de vacaciones', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(newFormatedDate < fechaActual) {
            toast('Debes ingresar una fecha a futuro', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(newFormatedDate > fecha15DiasDespues) {
            toast('Debes ingresar una fecha con 15 dias de anticipacion como máximo', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(selectOptionHairdresserSh == 'Peluquero' || selectOptionHairdresserSh == '') {
            toast('Debes elegir un peluquero', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputFirstNameSh)) {
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
        } else if (!isValidUTF8(inputLastNameSh)) {
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
        } else if (!isValidUTF8(inputEmailSh)) {
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
            setSaveConfirmationShiftModal(true);
        }
    };

    const handleWantPayShift = () => {
        if(!inputFirstNameSh || !inputLastNameSh || !inputEmailSh) {
            toast('Debes completar todos los campos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!validateEmail(inputEmailSh)) {
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
        } else if (inputDateSh.getDay() == 0 || inputDateSh.getDay() == 1) {
            toast('Elige un dia entre martes y sabado!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(newFormatedDate < fechaActual) {
            toast('Debes ingresar una fecha a futuro', {
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
            setIsWantPay(true);
        }
    };

    const SaveConfirmationShiftModal = ({setSaveConfirmationShiftModal}) => {

        const handleBtnSaveShift = async() => {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const shift_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;
                setShowSpinner(true);
                const shiftToCreate = {
                    first_name: cleanString(inputFirstNameSh),
                    last_name: cleanString(inputLastNameSh),
                    hairdresser: selectOptionHairdresserSh,
                    service: inputOptionServiceSh,
                    email: cleanString(inputEmailSh),
                    date: formatedDate,
                    schedule: selectScheduleSh?selectScheduleSh:optionsScheduleSh[0],
                    price: inputPriceSh,
                    shift_datetime: shift_datetime
                }
                const response = await fetch(`${apiUrl}/api/shifts/register`, {
                    method: 'POST',         
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(shiftToCreate)
                })
                const data = await response.json();
                if(response.ok) {
                    toast('Has creado el turno correctamente!', {
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
                        window.location.reload();
                    }, 2000);
                }
                if(data.error === 'There is already a shift with that date and time') {
                    toast('Ya existe un turno con esa fecha y horario!', {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    document.getElementById('btnCreateShift').style.display = 'block';
                    setShowSpinner(false);
                } else if(data.error === 'The entered time does not exist') {
                    toast('Ha ocurrido un error, intente nuevamente o refresque la página!', {
                        position: "top-right",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    document.getElementById('btnCreateShift').style.display = 'block';
                    setShowSpinner(false);
                }
        };

        const handleBtnConfirmationDeleteBtnNo = () => {
            setSaveConfirmationShiftModal(false);
        }


        return (
            <div className='confirmationSaveBtnSaveShiftModalContainer'>
                <div className='confirmationSaveBtnSaveShiftModalContainer__ask'>¿Estás seguro que deseas registrar el turno?</div>
                <div className='confirmationSaveBtnSaveShiftModalContainer__askMobile'>
                    <div className='confirmationSaveBtnSaveShiftModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                    <div className='confirmationSaveBtnSaveShiftModalContainer__askMobile__ask'> registrar el turno?</div>
                </div>
                <div className='confirmationSaveBtnSaveShiftModalContainer__btnsContainer'>
                    <div className='confirmationSaveBtnSaveShiftModalContainer__btnsContainer__btns'>
                        <div></div>
                    </div>
                    <div className='confirmationSaveBtnSaveShiftModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnSaveShift} className='confirmationSaveBtnSaveShiftModalContainer__btnsContainer__btns__prop'>Si</button>
                    </div>
                    <div className='confirmationSaveBtnSaveShiftModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationSaveBtnSaveShiftModalContainer__btnsContainer__btns__prop'>No</button>
                    </div>
                    {showSpinner&&<Spinner/>}
                </div>
            </div>
        )

    }

    const inputDisabledStyle = {
        backgroundColor: 'grey'
    };

    /* const handleNonRegister = () => {
        if(isBtnShiftRegisterBlocked) {
            setIsBtnShiftRegisterBlocked(false)        
        } else {
            setIsBtnShiftRegisterBlocked(true)        
        }
    }; */

  return (
    <>
        <NavBar/>
        {
            isLoggedIn && (user.role=='admin' || user.role=='premium')?
            <>
                <div className='shiftsContainerIsLoggedIn'>
                    <div className='shiftsContainerIsLoggedIn__form'>
                        <h2 className='shiftsContainerIsLoggedIn__form__phrase'>Registra tu turno</h2>
                        <div className='shiftsContainerIsLoggedIn__form__credentials'>
                            {
                                !isBtnShiftRegisterBlocked ?
                                <>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Nombre:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <input className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' placeholder='Nombre' value={inputFirstNameSh} onChange={handleInputFirstNameSh}/>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Apellido:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <input className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' placeholder='Apellido' value={inputLastNameSh} onChange={handleInputLastNameSh}/>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Email:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <input className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' type='email' placeholder='Email' value={inputEmailSh} onChange={handleInputEmailSh}/>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Peluquero:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <select className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={selectOptionHairdresserSh} onChange={(e) => {handleSelectOptionHairdresserSh(e.target.value)}}>
                                                {optionsHairdresser.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Servicio:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <select className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={inputOptionServiceSh} onChange={(e) => {handleInputOptionServiceSh(e.target.value)}}>
                                                {optionsService.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Fecha:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <DatePicker
                                                className="react-datepicker-wrapper"
                                                selected={inputDateSh}
                                                onChange={handleDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Seleccione una fecha"
                                                locale="es"
                                            />
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Horario:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <select className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={selectScheduleSh} onChange={(e) => {handleSelectScheduleSh(e.target.value)}}>
                                                {optionsScheduleSh.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Precio:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__price'>{inputPriceSh?`$ ${inputPriceSh}`:'-'}</div>
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Nombre:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <input disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' placeholder='Nombre' value={inputFirstNameSh} onChange={handleInputFirstNameSh}/>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Apellido:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <input disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' placeholder='Apellido' value={inputLastNameSh} onChange={handleInputLastNameSh}/>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Peluquero:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <select disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={selectOptionHairdresserSh} onChange={(e) => {handleSelectOptionHairdresserSh(e.target.value)}}>
                                                {optionsHairdresser.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Servicio:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <select disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={inputOptionServiceSh} onChange={(e) => {handleInputOptionServiceSh(e.target.value)}}>
                                                {optionsService.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Email:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <input disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' type='email' placeholder='Email' value={inputEmailSh} onChange={handleInputEmailSh}/>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Fecha:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <DatePicker
                                                disabled
                                                className="react-datepicker-wrapper-disabled"
                                                selected={inputDateSh}
                                                onChange={handleDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Seleccione una fecha"
                                                locale="es"
                                            />
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Horario:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <select disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={selectScheduleSh} onChange={(e) => {handleSelectScheduleSh(e.target.value)}}>
                                                {optionsScheduleSh.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                            <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Precio:</h2>
                                        </div>
                                        <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__price'>{inputPriceSh?`$ ${inputPriceSh}`:'-'}</div>
                                        </div>
                                    </div>
                                </>
                            }
                            
                            {
                                
                                isWantPay ?
                                <>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__btn'>
                                        <button id='pagarTurnoBtn' className='shiftsContainerIsLoggedIn__form__credentials__btn__prop' onClick={handleAdmPremBuy}>Pagar</button>
                                    </div>
                                    {admPremPreferenceId && <Wallet initialization={{ preferenceId: admPremPreferenceId }} />} 
                                </>
                                :
                                <>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__btn'>
                                        {
                                            !isBtnShiftRegisterBlocked ?
                                            <button className='shiftsContainerIsLoggedIn__form__credentials__btn__prop' onClick={handleBtnSaveShift}>Registrar turno</button>
                                            :
                                            <button disabled className='shiftsContainerIsLoggedIn__form__credentials__btn__prop'>Registrar turno</button>
                                        }
                                        {/* <button className='shiftsContainerIsLoggedIn__form__credentials__btn__propWantBuy' onClick={handleWantPayShift}>Deseas pagar el turno? Has click aquí</button> */}
                                    </div>
                                    {/* <div className='shiftsContainerIsLoggedIn__form__credentials__btn'>
                                        <button onClick={()=>setIsBtnShiftRegisterBlocked(true)} className='shiftsContainerIsLoggedIn__form__credentials__btn__prop'>Quitar permiso de sacar turnos</button>
                                        <button onClick={handleNonRegister} className='shiftsContainerIsLoggedIn__form__credentials__btn__prop'>Quitar permiso de sacar turnos</button>
                                    </div> */}
                                </>
                            }
                            {saveConfirmationShiftModal && <SaveConfirmationShiftModal setSaveConfirmationShiftModal={setSaveConfirmationShiftModal}/>}
                        </div>
                    </div>
                </div>
                <LogOut/> 
            </>
            : isLoggedIn?
            <>
                <div className='shiftsContainerIsLoggedIn'>
                    <div className='shiftsContainerIsLoggedIn__form'>
                        <h2 className='shiftsContainerIsLoggedIn__form__phrase'>Registra tu turno</h2>
                        <div className='shiftsContainerIsLoggedIn__form__credentials'>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Nombre:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <input disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' placeholder='Nombre' value={inputFirstNameSh} onChange={handleInputFirstNameSh}/>
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Apellido:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <input disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' placeholder='Apellido' value={inputLastNameSh} onChange={handleInputLastNameSh}/>
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Peluquero:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <select style={{backgroundColor:'grey'}} disabled className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={selectOptionHairdresserSh} onChange={(e) => {handleSelectOptionHairdresserSh(e.target.value)}}>
                                        {optionsHairdresser.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Servicio:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <select style={{backgroundColor:'grey'}} disabled className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={inputOptionServiceSh} onChange={(e) => {handleInputOptionServiceSh(e.target.value)}}>
                                        {optionsService.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Email:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <input disabled style={inputDisabledStyle} className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' type='email' placeholder='Email' value={inputEmailSh} onChange={handleInputEmailSh}/>
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Fecha:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <DatePicker
                                        className="react-datepicker-wrapper-disabled"
                                        selected={inputDateSh}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Seleccione una fecha"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Horario:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <select style={{backgroundColor:'grey'}} disabled className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={selectScheduleSh} onChange={(e) => {handleSelectScheduleSh(e.target.value)}}>
                                        {optionsScheduleSh.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Precio:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__price'>{inputPriceSh?`$ ${inputPriceSh}`:'-'}</div>
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__btn'>
                                {/* <button id='pagarTurnoBtn' className='shiftsContainerIsLoggedIn__form__credentials__btn__prop' onClick={handleBuy}>Pagar</button> */}
                                <button id='pagarTurnoBtn' onClick={nonRegisterYet} className='shiftsContainerIsLoggedIn__form__credentials__btn__propNonRegister'>Aún no puedes registrar un turno</button>
                            </div>
                        </div>
                        {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />} 
                    </div>
                </div>
                <LogOut/> 
            </>
            :
            <>
                <div className='warningLogin'>
                <p className='warningLogin__prop'>Si aún no has iniciado sesión, <Link to={"/login"} className='warningLogin__link'>has click aquí</Link></p>
                </div>
                <div className='shiftsContainer'>
                    <div className='shiftsContainer__form'>
                        <h2 className='shiftsContainer__form__phrase'>Registra tu turno</h2>
                        <div className='shiftsContainer__form__credentials'>
                            <div className='shiftsContainer__form__credentials__label-input'>
                                <div className='shiftsContainer__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainer__form__credentials__label-input__label__prop'>Nombre:</h2>
                                </div>
                                <div className='shiftsContainer__form__credentials__label-input__input'>
                                    <input disabled className='shiftsContainer__form__credentials__label-input__input__prop' placeholder='Nombre' value={inputFirstNameSh} onChange={handleInputFirstNameSh}/>
                                </div>
                            </div>
                            <div className='shiftsContainer__form__credentials__label-input'>
                                <div className='shiftsContainer__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainer__form__credentials__label-input__label__prop'>Apellido:</h2>
                                </div>
                                <div className='shiftsContainer__form__credentials__label-input__input'>
                                    <input disabled className='shiftsContainer__form__credentials__label-input__input__prop' placeholder='Apellido' value={inputLastNameSh} onChange={handleInputLastNameSh}/>
                                </div>
                            </div>
                            <div className='shiftsContainerIsLoggedIn__form__credentials__label-input'>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainerIsLoggedIn__form__credentials__label-input__label__prop'>Servicio:</h2>
                                </div>
                                <div className='shiftsContainerIsLoggedIn__form__credentials__label-input__input'>
                                    <select style={styleDisabledBtns} disabled className='shiftsContainerIsLoggedIn__form__credentials__label-input__input__prop' value={inputOptionServiceSh} onChange={(e) => {handleInputOptionServiceSh(e.target.value)}}>
                                        {optionsService.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='shiftsContainer__form__credentials__label-input'>
                                <div className='shiftsContainer__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainer__form__credentials__label-input__label__prop'>Email:</h2>
                                </div>
                                <div className='shiftsContainer__form__credentials__label-input__input'>
                                    <input disabled className='shiftsContainer__form__credentials__label-input__input__prop' placeholder='Email' value={inputEmailSh} onChange={handleInputEmailSh}/>
                                </div>
                            </div>
                            <div className='shiftsContainer__form__credentials__label-input'>
                                <div className='shiftsContainer__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainer__form__credentials__label-input__label__prop'>Fecha:</h2>
                                </div>
                                <div className='shiftsContainer__form__credentials__label-input__input'>
                                    <DatePicker
                                        className="react-datepicker-wrapper"
                                        disabled
                                        selected={inputDateSh}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Seleccione una fecha"
                                    />
                                </div>
                            </div>
                            <div className='shiftsContainer__form__credentials__label-input'>
                                <div className='shiftsContainer__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainer__form__credentials__label-input__label__prop'>Horario:</h2>
                                </div>
                                <div className='shiftsContainer__form__credentials__label-input__input'>
                                    <select style={styleDisabledBtns} disabled className='shiftsContainer__form__credentials__label-input__input__prop' value={selectScheduleSh} onChange={(e) => {handleSelectScheduleSh(e.target.value)}}>
                                        {optionsScheduleSh.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* <div className='shiftsContainer__form__credentials__label-input'>
                                <div className='shiftsContainer__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainer__form__credentials__label-input__label__prop'>Turno:</h2>
                                </div>
                                <div className='shiftsContainer__form__credentials__label-input__input'>
                                    <select style={styleDisabledBtns} disabled className='shiftsContainer__form__credentials__label-input__input__prop' value={inputOptionServiceSh} onChange={(e) => {handleInputOptionServiceSh(e.target.value)}}>
                                        {optionsService.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div> */}
                            <div className='shiftsContainer__form__credentials__label-input'>
                                <div className='shiftsContainer__form__credentials__label-input__label'>
                                    <h2 className='shiftsContainer__form__credentials__label-input__label__prop'>Precio:</h2>
                                </div>
                                <div className='shiftsContainer__form__credentials__label-input__input'>
                                    <div className='shiftsContainer__form__credentials__label-input__input__price'>{inputPriceSh?`$ ${inputPriceSh}`:'-'}</div>
                                </div>
                            </div>
                            <div className='shiftsContainer__form__credentials__btn'>
                                <button id='pagarTurnoBtn' className='shiftsContainer__form__credentials__btn__prop' onClick={loginToast}>Pagar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }
        <Footer/>
    </>
  )
}

export default Shifts
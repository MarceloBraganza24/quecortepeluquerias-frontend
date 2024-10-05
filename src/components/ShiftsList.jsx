import React, { useEffect, useContext, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import {IsLoggedContext} from '../context/IsLoggedContext';
import {InputDataShLContext} from '../context/InputDataShLContext';
import HMenu from './HMenu';
import ItemShift from './ItemShift';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link } from 'react-router-dom';
import {OpenModalContext} from '../context/OpenModalContext'; 
import Spinner from './Spinner';
import moment from 'moment-timezone'

import { format } from 'date-fns';
import CreateShiftModalMobile from './CreateShiftModalMobile';
import CancelDaysModal from './CancelDaysModal';

const ShiftsList = () => {
    const currentDate = new Date()
    const { inputAddScheduleHShL,handleInputAddScheduleHShL,handleOnBlurInputAddScheduleMShLM,handleOnBlurInputAddScheduleHShLM,inputAddScheduleMShL,handleInputAddScheduleMShL,inputFirstNameShL, handleInputFirstNameShL,handleEmptyInputFirstNameShL,handleEmptyInputLastNameShL, inputLastNameShL, handleInputLastNameShL, inputEmailShL, handleInputEmailShL,handleEmptyInputAddScheduleHShL,handleEmptyInputAddScheduleMShL,handleEmptyInputEmailShL, inputDateShL, handleInputDateShL, selectScheduleOptionShL, handleSelectScheduleOptionShL,inputOptionServiceShL,handleInputOptionServiceShL,selectOptionHairdresserShL,handleSelectOptionHairdresserShL,selectOptionHeaderHairdresserShL,handleSelectOptionHeaderHairdresserShL } = useContext(InputDataShLContext);
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [isAddSchedule, setIsAddSchedule] = useState(false);
    const [isOpenCreateShiftModalLocalMobile, setIsOpenCreateShiftModalLocalMobile] = useState(false);
    const [shifts, setShifts] = useState([]);
    const {menuOptionsModal,handleMenuOptionsModal,updateShiftModal,handleCreateShiftModalMobile,recoverShiftModal,cancelShiftModal,handleCancelShiftModal,cancelDayModal,handleCancelDayModal,cancelDaysListModal,handleCancelDaysListModal} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [cancelShiftModalLocal, handleCancelShiftModalLocal] = useState(false);
    const [cancelDayModalLocal, handleCancelDayModalLocal] = useState(false);
    const [cancelDaysModalLocal, handleCancelDaysListModalLocal] = useState(false);
    const [holidays, setHolidays] = useState([]);
    const [workDays, setWorkDays] = useState([]);
    const [hairdressers, setHairdressers] = useState([]);
    const [services, setServices] = useState([]);
    let formattedDate;
    inputDateShL&&(formattedDate = format(inputDateShL, 'yyyy-MM-dd'));

    const formatedNewDate = moment.tz(formattedDate, 'UTC');
    const dayFormatedNewDate = formatedNewDate.day();
    
    const optionsService = ['Servicio'];
    const servicesNonPartners = services.filter(item => item.category == 'No socio')
    servicesNonPartners.forEach(item => {
        optionsService.push(`${item.title}`)
    })
    const optionsHairdresser = ['Peluquero'];
    hairdressers.forEach(item => {
        optionsHairdresser.push(`${item.name}`)
    })
    
    const optionsScheduleSh = [];
    
    const [showSpinner, setShowSpinner] = useState(false);
    
    const [selectedYearValue, setSelectedYearsValue] = useState(`${new Date().getFullYear()}`);
    
    let currentMonth = currentDate.getMonth();
    currentMonth += 1;
    const [selectedMonthValue, setSelectedMonthsValue] = useState(`${currentMonth}`);
    
    const currentDay = currentDate.getDate();
    const [selectedDayValue, setSelectedDayValue] = useState(`${currentDay}`);
    
    function compararFechas(objeto1, objeto2) {
        var fechaHora1 = new Date(objeto1.date + " " + objeto1.schedule);
        var fechaHora2 = new Date(objeto2.date + " " + objeto2.schedule);
        return fechaHora1 - fechaHora2;
    }
    const shiftsOrganized = shifts.sort(compararFechas);
    
    function filtrarPorFecha(shiftsOrganized, fecha) {
        return shiftsOrganized.filter(objeto => objeto.date == fecha);
    }
    
    const dateDesired = selectedYearValue + '-' + (selectedMonthValue=='1'?'01':selectedMonthValue=='2'?'02':selectedMonthValue=='3'?'03':selectedMonthValue=='4'?'04':selectedMonthValue=='5'?'05':selectedMonthValue=='6'?'06':selectedMonthValue=='7'?'07':selectedMonthValue=='8'?'08':selectedMonthValue=='9'?'09':selectedMonthValue=='10'?'10':selectedMonthValue=='11'?'11':selectedMonthValue=='12'?'12':selectedMonthValue=='') + '-' + (selectedDayValue=='1'?'01':selectedDayValue=='2'?'02':selectedDayValue=='3'?'03':selectedDayValue=='4'?'04':selectedDayValue=='5'?'05':selectedDayValue=='6'?'06':selectedDayValue=='7'?'07':selectedDayValue=='8'?'08':selectedDayValue=='9'?'09':selectedDayValue)
    const objetosFiltrados = filtrarPorFecha(shiftsOrganized, dateDesired);

    const dateDesiredMasUno = new Date(dateDesired)
    dateDesiredMasUno.setDate(dateDesiredMasUno.getDate() + 2);
    const dayDateDesiredMasUno = dateDesiredMasUno.getDate();
    const monthDateDesiredMasUno = dateDesiredMasUno.getMonth() + 1;
    const yearDateDesiredMasUno = dateDesiredMasUno.getFullYear();

    const dateDesiredMenosUno = new Date(dateDesired)
    dateDesiredMenosUno.setDate(dateDesiredMenosUno.getDate());
    const dayDateDesiredMenosUno = dateDesiredMenosUno.getDate();
    const monthDateDesiredMenosUno = dateDesiredMenosUno.getMonth() + 1;
    const yearDateDesiredMenosUno = dateDesiredMenosUno.getFullYear();

    const goFormerDay = () => {
        setSelectedDayValue(`${dayDateDesiredMenosUno}`)
        setSelectedMonthsValue(`${monthDateDesiredMenosUno}`)
        setSelectedYearsValue(`${yearDateDesiredMenosUno}`)
    }
    
    const goNextDay = () => {
        setSelectedDayValue(`${dayDateDesiredMasUno}`)
        setSelectedMonthsValue(`${monthDateDesiredMasUno}`)
        setSelectedYearsValue(`${yearDateDesiredMasUno}`)
    }

    const hairdressersFiltered = objetosFiltrados.filter(shift => shift.hairdresser == selectOptionHeaderHairdresserShL);
    const hairdressersFilteredByNotCancel = hairdressersFiltered.filter(shift => shift.cancelled != true);

    const workDaysByHairdresserWorkDayFiltered = workDays.filter(item => (item.hairdresser == selectOptionHairdresserShL && (item.work_day == (dayFormatedNewDate==6&&'Sabado')))
        || (item.hairdresser == selectOptionHairdresserShL && (item.work_day == (dayFormatedNewDate==0&&'Domingo'))) 
        || (item.hairdresser == selectOptionHairdresserShL && (item.work_day == (dayFormatedNewDate==1&&'Lunes'))) 
        || (item.hairdresser == selectOptionHairdresserShL && (item.work_day == (dayFormatedNewDate==2&&'Martes'))) 
        || (item.hairdresser == selectOptionHairdresserShL && (item.work_day == (dayFormatedNewDate==3&&'Miercoles'))) 
        || (item.hairdresser == selectOptionHairdresserShL && (item.work_day == (dayFormatedNewDate==4&&'Jueves'))) 
        || (item.hairdresser == selectOptionHairdresserShL && (item.work_day == (dayFormatedNewDate==5&&'Viernes'))) 
    )

    const schedulesByHairdresserDate = workDaysByHairdresserWorkDayFiltered.map(item => item.schedule)
    schedulesByHairdresserDate.sort((a, b) => {
        const timeA = a.split(':').map(Number);
        const timeB = b.split(':').map(Number);
        const totalMinutesA = timeA[0] * 60 + timeA[1];
        const totalMinutesB = timeB[0] * 60 + timeB[1];
    
        return totalMinutesA - totalMinutesB;
    });
    
    const shiftsFiltered = shifts.filter(shift => shift.hairdresser == selectOptionHairdresserShL && shift.date == formattedDate);
    const schedulesHairdressersFilteredByNotCancel = shiftsFiltered.map(item => item.schedule)

    let filteredArray = schedulesByHairdresserDate.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));

    filteredArray.forEach(res => {
        optionsScheduleSh.push(res)
    })
    
    const [isMonted, setIsMonted] = useState(false);

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
            async function fetchWorkDaysData() {
                const response = await fetch(`${apiUrl}/api/workDays`)
                const workDaysAll = await response.json();
                setWorkDays(workDaysAll.data)
            }
            fetchWorkDaysData();
            async function fetchServicesData() {
                const response = await fetch(`${apiUrl}/api/services`)
                const servicesAll = await response.json();
                setServices(servicesAll.data)
            }
            fetchServicesData();
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
        }
        fetchData();
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
        async function fetchWorkDaysData() {
            const response = await fetch(`${apiUrl}/api/workDays`)
            const workDaysAll = await response.json();
            setWorkDays(workDaysAll.data)
        }
        fetchWorkDaysData();
        async function fetchServicesData() {
            const response = await fetch(`${apiUrl}/api/services`)
            const servicesAll = await response.json();
            setServices(servicesAll.data)
        }
        fetchServicesData();
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

    const handleSelectYears = (event) => {
        setSelectedYearsValue(event.target.value);
    };

    const handleSelectMonths = (event) => {
        setSelectedMonthsValue(event.target.value);
    };

    const handleSelectDay = (event) => {
        setSelectedDayValue(event.target.value);
    };

    const handleDateChange = date => {
        handleInputDateShL(date);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const cleanPropsCreateShift = () => {
        handleSelectOptionHairdresserShL(optionsHairdresser[0]);
        handleEmptyInputFirstNameShL('')
        handleEmptyInputLastNameShL('')
        handleEmptyInputEmailShL('')
        handleEmptyInputAddScheduleHShL('')
        handleEmptyInputAddScheduleMShL('')
        setIsAddSchedule(false)
        handleInputOptionServiceShL(optionsService[0]);
        handleInputDateShL(new Date())
    };
    
    const concatAddSchedules = inputAddScheduleHShL + ':' + inputAddScheduleMShL
    const fechaActual = new Date();
    const concat = formattedDate + ' ' + (!isAddSchedule?(selectScheduleOptionShL?selectScheduleOptionShL:optionsScheduleSh[0]):concatAddSchedules);
    const inputDateShLFormated = new Date(concat);

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnCreateShift = async() => {
        if(!inputFirstNameShL || !inputLastNameShL || !inputDateShL) {
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
        } else if (!isValidUTF8(inputFirstNameShL)) {
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
        } else if (!isValidUTF8(inputLastNameShL)) {
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
        } else if (!isValidUTF8(inputEmailShL)) {
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
        } else if (isAddSchedule && (!inputAddScheduleHShL || !inputAddScheduleMShL)) {
            toast('Debes ingresar un horario!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (inputEmailShL && !validateEmail(inputEmailShL)) {
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
        } else if (inputDateShL.getDay() == 0 || inputDateShL.getDay() == 1) {
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
        }/*  else if(inputDateShLFormated < fechaActual) {
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
        } */ else if(selectOptionHairdresserShL == 'Peluquero' || selectOptionHairdresserShL == '') {
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
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
            const shift_datetime = currentDate;
            document.getElementById('btnCreateShift').style.display = 'none';
            setShowSpinner(true);
            const shiftToCreate = {
                hairdresser: selectOptionHairdresserShL,
                first_name: inputFirstNameShL,
                last_name: inputLastNameShL,
                service: inputOptionServiceShL=='Servicio'?'-':inputOptionServiceShL,
                email: inputEmailShL,
                date: formattedDate,
                schedule: !isAddSchedule?(selectScheduleOptionShL?selectScheduleOptionShL:optionsScheduleSh[0]):concatAddSchedules,
                shift_datetime: shift_datetime,
                currentUser: user
            }
            const response = await fetch(`${apiUrl}/api/shifts/register`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
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
                    document.getElementById('btnCreateShift').style.display = 'block';
                    setShowSpinner(false);
                    cleanPropsCreateShift();
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
        }
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer'
    };

    const selectDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        //backgroundColor: 'white'
    };

    const handleBtnCreateShiftModalMobile = () => {
        setIsOpenCreateShiftModalLocalMobile(true);
        handleCreateShiftModalMobile(true);
    };

    const handleBtnCancelDayModal = () => {
        if (inputDateShL.getDay() == 0 || inputDateShL.getDay() == 1) {
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
        } else if(selectOptionHairdresserShL == 'Peluquero' || selectOptionHairdresserShL == '') {
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
            handleCancelDayModalLocal(true)
            handleCancelDayModal(true)
        }
    }

    const handleBtnCancelShiftModal = () => {
        /* if(!inputFirstNameShL || !inputLastNameShL || !inputDateShL) {
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
        } else  */if (isAddSchedule && (!inputAddScheduleHShL || !inputAddScheduleMShL)) {
            toast('Debes ingresar un horario!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (optionsScheduleSh.length == 0) {
            toast('Debes seleccionar un horario!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }/*  else if (inputEmailShL && !validateEmail(inputEmailShL)) {
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
        } */ else if (inputDateShL.getDay() == 0 || inputDateShL.getDay() == 1) {
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
        } /* else if(inputDateShLFormated < fechaActual) {
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
        } */ else if(selectOptionHairdresserShL == 'Peluquero' || selectOptionHairdresserShL == '') {
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
            handleCancelShiftModalLocal(true)
            handleCancelShiftModal(true)
        }
    };

    const addSchedule = () => {
        if(isAddSchedule){
            setIsAddSchedule(false)
        } else {
            setIsAddSchedule(true)
        }
    };


    const CancelShiftModal = ({hairdresser,date,schedule}) => {

        const handleBtnCancelShift = async() => {
            
                document.getElementById('btnCreateShift').style.display = 'none';
                setShowSpinner(true);
                const shiftToCreate = {
                    hairdresser: selectOptionHairdresserShL,
                    first_name: '-',
                    last_name: '-',
                    service: inputOptionServiceShL=='Servicio'?'-':inputOptionServiceShL,
                    email: '-',
                    date: formattedDate,
                    schedule: !isAddSchedule?(selectScheduleOptionShL?selectScheduleOptionShL:optionsScheduleSh[0]):concatAddSchedules,
                    shift_datetime: currentDate,
                    cancelled: true
                }
                const response = await fetch(`${apiUrl}/api/shifts/register`, {
                    method: 'POST',         
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(shiftToCreate)
                })
                const data = await response.json();
                if(response.ok) {
                    toast('Has anulado el turno correctamente!', {
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
                        document.getElementById('btnCreateShift').style.display = 'block';
                        setShowSpinner(false);
                        handleCancelShiftModalLocal(false)
                        handleCancelShiftModal(false)
                    }, 1500);
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
                }
        }

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleCancelShiftModalLocal(false)
            handleCancelShiftModal(false)
        }

      return (
        <>
                <div className='confirmationDeleteBtnShiftListModalContainer'>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>¿Estás seguro que deseas anular el turno</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>con fecha {date} {schedule} de {hairdresser}?</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>anular el turno?</div>
                    </div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnCancelShift} className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
      )
    }

    const CancelDayModal = ({date,hairdresser}) => {

        const handleBtnCancelShift = async() => {
            
            document.getElementById('btnCancelDay').style.display = 'none';
            setShowSpinner(true);
            const holiday = {
                date: formattedDate,
                hairdresser: selectOptionHairdresserShL
            }
            const response = await fetch(`${apiUrl}/api/holidays/register`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(holiday)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has anulado el día seleccionado correctamente!', {
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
                    document.getElementById('btnCancelDay').style.display = 'block';
                    setShowSpinner(false);
                    handleCancelDayModalLocal(false)
                    handleCancelDayModal(false)
                }, 1500);
            }
            if(data.error === 'There is already a holiday with that date and hairdresser') {
                toast('La fecha ingresada del peluquero elegido ya esta guardada!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnCancelDay').style.display = 'block';
                setShowSpinner(false);
            }
        }

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleCancelDayModalLocal(false)
            handleCancelDayModal(false)
        }

      return (
        <>
                <div className='confirmationDeleteBtnShiftListModalContainer'>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>¿Estás seguro que deseas anular el día</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>{date} de {hairdresser}?</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>anular el día?</div>
                    </div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnCancelShift} className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
      )
    }

    const handleBtnCancelDaysModal = () => {
        handleCancelDaysListModalLocal(true)
        handleCancelDaysListModal(true)
    }

    

    
  return (
    <>
        <NavBar/>
        {
            isLoggedIn && user.role==='admin'?
            <>
                <div className='shiftsListContainer'>
                    <div className='shiftsListContainer__selectHairdresser-title'>
                        <div className='shiftsListContainer__selectHairdresser-title__selectHairdresser'>
                            <div className='shiftsListContainer__selectHairdresser-title__selectHairdresser__label'>Peluquero:</div>
                            {
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <div className='shiftsListContainer__selectHairdresser-title__selectHairdresser__label__select'>
                                    <select className='shiftsListContainer__selectHairdresser-title__selectHairdresser__select__prop' value={selectOptionHeaderHairdresserShL} onChange={(e) => {handleSelectOptionHeaderHairdresserShL(e.target.value)}}>
                                        {optionsHairdresser.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                :
                                <div className='shiftsListContainer__selectHairdresser-title__selectHairdresser__label__select'>
                                    <select disabled style={selectDisabledStyle} className='shiftsListContainer__selectHairdresser-title__selectHairdresser__select__prop' value={selectOptionHeaderHairdresserShL} onChange={(e) => {handleSelectOptionHeaderHairdresserShL(e.target.value)}}>
                                        {optionsHairdresser.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            }
                        </div>
                        <div className='shiftsListContainer__selectHairdresser-title__title'>- Turnos -</div>
                    </div>
                    <div className='shiftsListContainer__selectHairdresser-titleMobile'>
                        <div className='shiftsListContainer__selectHairdresser-titleMobile__selectHairdresser'>
                            <div className='shiftsListContainer__selectHairdresser-titleMobile__selectHairdresser__label'>Peluquero:</div>
                            <select className='shiftsListContainer__selectHairdresser-titleMobile__selectHairdresser__select' value={selectOptionHeaderHairdresserShL} onChange={(e) => {handleSelectOptionHeaderHairdresserShL(e.target.value)}}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='shiftsListContainer__selectHairdresser-titleMobile__title'>- Turnos -</div>
                    </div>
                    <div className='shiftsListContainer__selects'>
                        <div className='shiftsListContainer__selects__labelSelect'>
                            <div className='shiftsListContainer__selects__labelSelect__label'>Año:</div>
                            {       
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <select value={selectedYearValue} className='shiftsListContainer__selects__labelSelect__select' onChange={handleSelectYears}>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                    <option value="2030">2030</option>
                                </select>
                                :
                                <select disabled style={buttonDisabledStyle} value={selectedYearValue} className='shiftsListContainer__selects__labelSelect__select' onChange={handleSelectYears}>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                    <option value="2030">2030</option>
                                </select>
                            }
                        </div>
                        <div className='shiftsListContainer__selects__labelSelect'>
                            <div className='shiftsListContainer__selects__labelSelect__label'>Mes:</div>
                            {       
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <select value={selectedMonthValue} className='shiftsListContainer__selects__labelSelect__selectDays' onChange={handleSelectMonths}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                                :
                                <select disabled style={buttonDisabledStyle} value={selectedMonthValue} className='shiftsListContainer__selects__labelSelect__selectDays' onChange={handleSelectMonths}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                </select>
                            }
                        </div>
                        <div className='shiftsListContainer__selects__labelSelect'>
                            <div className='shiftsListContainer__selects__labelSelect__label'>Día:</div>
                            {       
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <select className='shiftsListContainer__selects__labelSelect__selectDays' onChange={handleSelectDay} value={selectedDayValue}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option id='day29' value="29">29</option>
                                    <option id='day30' value="30">30</option>
                                    <option id='day31' value="31">31</option>
                                </select>
                                :
                                <select disabled style={buttonDisabledStyle} className='shiftsListContainer__selects__labelSelect__selectDays' onChange={handleSelectDay} value={selectedDayValue}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    <option value="24">24</option>
                                    <option value="25">25</option>
                                    <option value="26">26</option>
                                    <option value="27">27</option>
                                    <option value="28">28</option>
                                    <option id='day29' value="29">29</option>
                                    <option id='day30' value="30">30</option>
                                    <option id='day31' value="31">31</option>
                                </select>
                            }
                        </div>
                    </div>
                    <div style={{borderBottom: 'none'}} className='shiftsListContainer__createShiftMobile'>
                        {       
                            !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <>
                                    <button className='shiftsListContainer__createShiftMobile__btnMobile' onClick={goFormerDay}>Día anterior</button>
                                    <button className='shiftsListContainer__createShiftMobile__btnMobile' onClick={goNextDay}>Día siguiente</button>
                                </>
                            :
                                <>
                                    <button disabled className='shiftsListContainer__createShiftMobile__btnMobile'>Día anterior</button>
                                    <button disabled className='shiftsListContainer__createShiftMobile__btnMobile'>Día siguiente</button>
                                </>
                        }
                        
                    </div>
                    <div className='shiftsListContainer__cancelDayMobile'>
                        <button onClick={handleBtnCancelDaysModal} className='shiftsListContainer__cancelDayMobile__btnCancelDay'>Días anulados</button>
                    </div>
                    <div className='shiftsListContainer__createShiftMobile'>
                        <button onClick={handleBtnCreateShiftModalMobile} className='shiftsListContainer__createShiftMobile__btnCreateShift'>Crear turno</button>
                        {isOpenCreateShiftModalLocalMobile&&<CreateShiftModalMobile setIsOpenCreateShiftModalLocalMobile={setIsOpenCreateShiftModalLocalMobile} user={user}/>}
                    </div>

                    <div className='shiftsListContainer__shiftsList__lengthShiftsMobile'>
                        <div className='shiftsListContainer__shiftsList__lengthShiftsMobile__prop'>Cantidad de turnos: -</div>
                        {/* {
                            selectOptionHeaderHairdresserShL=='Ayrton'?
                                <div className='shiftsListContainer__shiftsList__lengthShiftsMobile__prop'>Cantidad de turnos: {ayrtonObjetosFiltradosByNotCancel.length}</div>
                            : selectOptionHeaderHairdresserShL=='Mirko'?
                                <div className='shiftsListContainer__shiftsList__lengthShiftsMobile__prop'>Cantidad de turnos: {mirkoObjetosFiltradosByNotCancel.length}</div>
                            : selectOptionHeaderHairdresserShL=='Ale'&&
                                <div className='shiftsListContainer__shiftsList__lengthShiftsMobile__prop'>Cantidad de turnos: {aleObjetosFiltradosByNotCancel.length}</div>
                        } */}
                    </div>

                    {cancelDaysModalLocal&&<CancelDaysModal handleCancelDaysListModalLocal={handleCancelDaysListModalLocal} holidaysData={holidays} hairdressers={hairdressers}/>}
                    <div className='shiftsListContainer__shiftsList__lengthShifts'>
                        <div className='shiftsListContainer__shiftsList__lengthShifts__cancelDaysList'>
                            {
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <button className='shiftsListContainer__shiftsList__lengthShifts__cancelDaysList__btn' onClick={handleBtnCancelDaysModal}>Días anulados</button>
                                :
                                <button style={buttonDisabledStyle} disabled className='shiftsListContainer__shiftsList__lengthShifts__cancelDaysList__btn'>Días anulados</button>
                            }
                        </div>
                        <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength'>
                            {
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__prop'>Cantidad de turnos: {hairdressersFilteredByNotCancel.length}</div>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                                :
                                <>
                                    <button disabled className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__prop'>Cantidad de turnos: {hairdressersFilteredByNotCancel.length}</div>
                                    <button disabled className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                            }
                            
                        {/* {
                            selectOptionHeaderHairdresserShL=='Ayrton'?
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__prop'>Cantidad de turnos: {ayrtonObjetosFiltradosByNotCancel.length}</div>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                                :
                                <>
                                    <button disabled className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__prop'>Cantidad de turnos: {ayrtonObjetosFiltradosByNotCancel.length}</div>
                                    <button disabled className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                            : selectOptionHeaderHairdresserShL=='Mirko'?
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__prop'>Cantidad de turnos: {mirkoObjetosFiltradosByNotCancel.length}</div>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                                :
                                <>
                                    <button disabled style={buttonDisabledStyle} className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__prop'>Cantidad de turnos: {mirkoObjetosFiltradosByNotCancel.length}</div>
                                    <button disabled style={buttonDisabledStyle} className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                            : selectOptionHeaderHairdresserShL=='Ale'?
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__prop'>Cantidad de turnos: {aleObjetosFiltradosByNotCancel.length}</div>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                                :
                                <>
                                    <button disabled style={buttonDisabledStyle} className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <div className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__prop'>Cantidad de turnos: {aleObjetosFiltradosByNotCancel.length}</div>
                                    <button disabled style={buttonDisabledStyle} className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                            :
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <button className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                                :
                                <>
                                    <button disabled style={buttonDisabledStyle} className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goFormerDay}>Día anterior</button>
                                    <button disabled style={buttonDisabledStyle} className='shiftsListContainer__shiftsList__lengthShifts__btnsShiftsLength__btn' onClick={goNextDay}>Día siguiente</button>
                                </>
                            } */}
                        </div>
                        {/* <button onClick={handleBtnCancelDaysModal}>Días anulados</button> */}
                    </div>
                    <div className='shiftsListContainer__shiftsList'>
                        {
                            (selectOptionHeaderHairdresserShL!='Peluquero' && selectOptionHeaderHairdresserShL!='')&&
                            <div className='shiftsListContainer__shiftsList__headerMobile'>
                                <div className='shiftsListContainer__shiftsList__headerMobile__label'>Fecha</div>
                                <div className='shiftsListContainer__shiftsList__headerMobile__label'>Horario</div>
                                <div className='shiftsListContainer__shiftsList__headerMobile__label'>Nombre</div>
                                <div className='shiftsListContainer__shiftsList__headerMobile__label'>Apellido</div>
                            </div>
                        }
                        <div className='shiftsListContainer__shiftsList__header'>
                            <div className='shiftsListContainer__shiftsList__header__label'>Peluquero</div>
                            <div className='shiftsListContainer__shiftsList__header__label'>Fecha</div>
                            <div className='shiftsListContainer__shiftsList__header__label'>Horario</div>
                            <div className='shiftsListContainer__shiftsList__header__label'>Nombre</div>
                            <div className='shiftsListContainer__shiftsList__header__label'>Apellido</div>
                            <div className='shiftsListContainer__shiftsList__header__label'>Servicio</div>
                            <div className='shiftsListContainer__shiftsList__header__label'>Email</div>
                        </div>
                        <div className='itemCreateShift'>
                            {
                                !updateShiftModal&&!recoverShiftModal&&!cancelShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                                <>
                                    <div className='itemCreateShift__selectService'>
                                        <select className='itemCreateShift__selectService__select' value={selectOptionHairdresserShL} onChange={(e) => {handleSelectOptionHairdresserShL(e.target.value)}}>
                                            {optionsHairdresser.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='itemCreateShift__datePiker'>
                                        <DatePicker className='itemCreateShift__datePiker__prop'
                                            selected={inputDateShL}
                                            onChange={handleDateChange}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText='-'
                                        />
                                    </div>
                                    <div className='itemCreateShift__selectSchedule'>
                                        {
                                            !isAddSchedule?
                                            <select className='itemCreateShift__selectSchedule__select' value={selectScheduleOptionShL} onChange={(e) => {handleSelectScheduleOptionShL(e.target.value)}}>
                                                {optionsScheduleSh.map((option, index) => (
                                                <option key={index} value={option}>{option}</option>
                                                ))}
                                            </select>
                                            :
                                            <>
                                                <input maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleHShL} onBlur={handleOnBlurInputAddScheduleHShLM} onChange={handleInputAddScheduleHShL} />
                                                :
                                                <input maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleMShL} onBlur={handleOnBlurInputAddScheduleMShLM} onChange={handleInputAddScheduleMShL} />
                                            </>
                                        }
                                        <button className='itemCreateShift__selectSchedule__btn' onClick={addSchedule}>+</button>
                                    </div>
                                    <div className='itemCreateShift__input'>
                                        <input type='text' className='itemCreateShift__input__prop' placeholder='-' value={inputFirstNameShL} onChange={handleInputFirstNameShL}/>
                                    </div>
                                    <div className='itemCreateShift__input'>
                                        <input type='text' className='itemCreateShift__input__prop' placeholder='-' value={inputLastNameShL} onChange={handleInputLastNameShL}/>
                                    </div>
                                    <div className='itemCreateShift__selectService'>
                                        <select className='itemCreateShift__selectService__select' value={inputOptionServiceShL} onChange={(e) => {handleInputOptionServiceShL(e.target.value)}}>
                                            {optionsService.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='itemCreateShift__input'>
                                        <input type='email' className='itemCreateShift__input__prop' placeholder='-' value={inputEmailShL} onChange={handleInputEmailShL}/>
                                    </div>
                                    <div className='itemCreateShift__btns'>
                                        <div className='itemCreateShift__btns__btnCreateShift'> 
                                            <button id='btnCreateShift' className='itemCreateShift__btns__btnCreateShift__prop' onClick={handleBtnCreateShift}>Crear turno</button>
                                        </div>
                                        <div className='itemCreateShift__btns__createCancelShift'>
                                            <button className='itemCreateShift__btns__createCancelShift__btn' onClick={handleBtnCancelShiftModal}>Anular turno</button>
                                        </div>
                                        <div className='itemCreateShift__btns__cancelDay'>
                                            <button id='btnCancelDay' className='itemCreateShift__btns__cancelDay__btn' onClick={handleBtnCancelDayModal}>Anular día</button>
                                        </div>
                                        {showSpinner&&<Spinner/>}
                                    </div>
                                </>
                                :
                                <>
                                    <div className='itemCreateShift__selectService'>
                                        <select disabled className='itemCreateShift__selectService__select' value={selectOptionHairdresserShL} onChange={(e) => {handleSelectOptionHairdresserShL(e.target.value)}}>
                                            {optionsHairdresser.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='itemCreateShift__datePiker'>
                                        <DatePicker className='itemCreateShift__datePiker__prop'
                                            selected={inputDateShL}
                                            onChange={handleDateChange}
                                            dateFormat="yyyy-MM-dd"
                                            placeholderText='-'
                                            disabled
                                        />
                                    </div>
                                    <div className='itemCreateShift__selectSchedule'>
                                        <select style={selectDisabledStyle} disabled className='itemCreateShift__selectSchedule__select' value={selectScheduleOptionShL} onChange={(e) => {handleSelectScheduleOptionShL(e.target.value)}}>
                                            {optionsScheduleSh.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='itemCreateShift__input'>
                                        <input disabled type='text' className='itemCreateShift__input__prop' placeholder='-' value={inputFirstNameShL} onChange={handleInputFirstNameShL}/>
                                    </div>
                                    <div className='itemCreateShift__input'>
                                        <input disabled type='text' className='itemCreateShift__input__prop' placeholder='-' value={inputLastNameShL} onChange={handleInputLastNameShL}/>
                                    </div>
                                    <div className='itemCreateShift__selectService'>
                                        <select disabled className='itemCreateShift__selectService__select' value={inputOptionServiceShL} onChange={(e) => {handleInputOptionServiceShL(e.target.value)}}>
                                            {optionsService.map((option, index) => (
                                            <option key={index} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='itemCreateShift__input'>
                                        <input disabled type='text' className='itemCreateShift__input__prop' placeholder='-' value={inputEmailShL} onChange={handleInputEmailShL}/>
                                    </div>
                                    <div className='itemCreateShift__btns'>
                                        <div className='itemCreateShift__btns__btnCreateShift'> 
                                            <button style={buttonDisabledStyle} disabled id='btnCreateShift' className='itemCreateShift__btns__btnCreateShift__prop' onClick={handleBtnCreateShift}>Crear turno</button>
                                        </div>
                                        <div className='itemCreateShift__btns__createCancelShift'>
                                            <button style={buttonDisabledStyle} disabled className='itemCreateShift__btns__createCancelShift__btn' onClick={handleBtnCancelShiftModal}>Anular turno</button>
                                        </div>
                                        <div className='itemCreateShift__btns__cancelDay'>
                                            <button style={buttonDisabledStyle} disabled id='btnCancelDay' className='itemCreateShift__btns__cancelDay__btn' onClick={handleBtnCancelDayModal}>Anular día</button>
                                        </div>
                                        {showSpinner&&<Spinner/>}
                                    </div>
                                </>
                            }
                        </div>
                        {
                            hairdressersFiltered.length!=0&&

                            hairdressersFiltered.map((shift) => {
                                return(
                                    <ItemShift
                                    id={shift._id}
                                    hairdresser={shift.hairdresser}
                                    first_name={shift.first_name}
                                    last_name={shift.last_name}
                                    service={shift.service}
                                    email={shift.email}
                                    date={shift.date}
                                    schedule={shift.schedule}
                                    shifts={shifts}
                                    hairdressers={hairdressers}
                                    workDays={workDays}
                                    services={services}
                                    />
                                )
                            })
                        }
                        {/* {
                            selectOptionHeaderHairdresserShL=='Ayrton'&&ayrtonObjetosFiltrados.length!=0?
                                ayrtonObjetosFiltrados.map((shift) => {
                                    return(
                                        <ItemShift
                                        id={shift._id}
                                        hairdresser={shift.hairdresser}
                                        first_name={shift.first_name}
                                        last_name={shift.last_name}
                                        service={shift.service}
                                        email={shift.email}
                                        date={shift.date}
                                        schedule={shift.schedule}
                                        shifts={shifts}
                                        />
                                    )
                                })
                            : selectOptionHeaderHairdresserShL=='Mirko'&&mirkoObjetosFiltrados.length!=0?
                                mirkoObjetosFiltrados.map((shift) => {
                                    return(
                                        <ItemShift
                                        id={shift._id}
                                        hairdresser={shift.hairdresser}
                                        first_name={shift.first_name}
                                        last_name={shift.last_name}
                                        service={shift.service}
                                        email={shift.email}
                                        date={shift.date}
                                        schedule={shift.schedule}
                                        shifts={shifts}
                                        />
                                    )
                                })
                            : selectOptionHeaderHairdresserShL=='Ale'&&aleObjetosFiltrados.length!=0?
                                aleObjetosFiltrados.map((shift) => {
                                    return(
                                        <ItemShift
                                        id={shift._id}
                                        hairdresser={shift.hairdresser}
                                        first_name={shift.first_name}
                                        last_name={shift.last_name}
                                        service={shift.service}
                                        email={shift.email}
                                        date={shift.date}
                                        schedule={shift.schedule}
                                        shifts={shifts}
                                        />
                                    )
                                })
                            : (selectOptionHeaderHairdresserShL=='' || selectOptionHeaderHairdresserShL=='Peluquero') ?
                            <div className='myShiftsListContainer__withoutItems'>Elige un peluquero</div>
                            : (selectOptionHeaderHairdresserShL=='Ayrton' || selectOptionHeaderHairdresserShL=='Mirko' || selectOptionHeaderHairdresserShL=='Ale')&&
                            <div className='myShiftsListContainer__withoutItems'>Aún no existen turnos</div>
                        } */}
                    </div>
                </div>
                {cancelShiftModalLocal&&<CancelShiftModal hairdresser={selectOptionHairdresserShL} date={formattedDate} schedule={!isAddSchedule?(selectScheduleOptionShL?selectScheduleOptionShL:optionsScheduleSh[0]):concatAddSchedules}/>}
                {cancelDayModalLocal&&<CancelDayModal hairdresser={selectOptionHairdresserShL} handleCancelDayModalLocal={handleCancelDayModalLocal} date={formattedDate}/>}
                {/* {
                    (ayrtonObjetosFiltrados.length==0||mirkoObjetosFiltrados.length==0||aleObjetosFiltrados.length==0||selectOptionHeaderHairdresserShL=='Peluquero') ?
                    <>
                        <div className='shiftsListContainer__blackDiv' style={{padding:'10vh 0vh'}}></div>
                        <div className='shiftsListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (ayrtonObjetosFiltrados.length==1||mirkoObjetosFiltrados.length==1||aleObjetosFiltrados.length==1||selectOptionHeaderHairdresserShL=='Peluquero') ?
                    <>
                        <div className='shiftsListContainer__blackDiv' style={{padding:'8vh 0vh'}}></div>
                        <div className='shiftsListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (ayrtonObjetosFiltrados.length==2||mirkoObjetosFiltrados.length==2||aleObjetosFiltrados.length==2||selectOptionHeaderHairdresserShL=='Peluquero') ?
                    <>
                        <div className='shiftsListContainer__blackDiv' style={{padding:'5vh 0vh'}}></div>
                        <div className='shiftsListContainer__blackDivMobile' style={{padding:'10vh 0vh'}}></div>
                    </>
                    : (ayrtonObjetosFiltrados.length==3||mirkoObjetosFiltrados.length==3||aleObjetosFiltrados.length==3||selectOptionHeaderHairdresserShL=='Peluquero') ?
                    <>
                        <div className='shiftsListContainer__blackDiv' style={{padding:'2vh 0vh'}}></div>
                        <div className='shiftsListContainer__blackDivMobile' style={{padding:'5vh 0vh'}}></div>
                    </>
                    : (ayrtonObjetosFiltrados.length==4||mirkoObjetosFiltrados.length==4||aleObjetosFiltrados.length==4||selectOptionHeaderHairdresserShL=='Peluquero') ?
                    <>
                        <div className='shiftsListContainer__blackDivMobile' style={{padding:'1vh 0vh'}}></div>
                    </>
                    : (ayrtonObjetosFiltrados.length==5||mirkoObjetosFiltrados.length==5||aleObjetosFiltrados.length==5||selectOptionHeaderHairdresserShL=='Peluquero') &&
                    <>
                        <div className='shiftsListContainer__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                    </>
            } */}
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

export default ShiftsList
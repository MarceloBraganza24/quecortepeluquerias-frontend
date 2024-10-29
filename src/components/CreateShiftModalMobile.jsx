import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import moment from 'moment-timezone'
import {OpenModalContext} from '../context/OpenModalContext'; 

const CreateShiftModalMobile = ({setIsOpenCreateShiftModalLocalMobile,user}) => {
    const {handleCreateShiftModalMobile,cancelShiftModal,handleCancelShiftModal} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [inputFirstNameShL, setInputFirstNameShL] = useState('');
    const [inputLastNameShL, setInputLastNameShL] = useState('');
    const [inputEmailShL, setInputEmailShL] = useState('');
    const [inputDateShL, setInputDateShL] = useState(new Date);
    const [inputAddScheduleHShLM, setInputAddScheduleHShLM] = useState('');
    const [inputAddScheduleMShLM, setInputAddScheduleMShLM] = useState('');
    const [selectScheduleOptionShL, setSelectScheduleOptionShL] = useState('');
    const [inputOptionServiceShL, setInputOptionServiceShL] = useState('');
    const [selectOptionHairdresserShL, setInputOptionHairdresserShL] = useState('');
    const [shifts, setShifts] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isAddSchedule, setIsAddSchedule] = useState(false);
    const [cancelShiftModalLocal, handleCancelShiftModalLocal] = useState(false);
    const [cancelDayModalLocal, handleCancelDayModalLocal] = useState(false);
    const [workDays, setWorkDays] = useState([]);
    const [hairdressers, setHairdressers] = useState([]);
    const [services, setServices] = useState([]);

    let formattedDate;
    inputDateShL&&(formattedDate = format(inputDateShL, 'yyyy-MM-dd'));

    const formatedNewDate = moment.tz(formattedDate, 'UTC');
    const dayFormatedNewDate = formatedNewDate.day();

    const optionsService = ['Servicio'];
    services.forEach(item => {
        optionsService.push(`${item.title}`)
    })

    const optionsHairdresser = ['Peluquero'];
    hairdressers.forEach(item => {
        optionsHairdresser.push(`${item.name}`)
    })

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

    const optionsScheduleSh = [];
    optionsScheduleSh.push('Horario')

    filteredArray.forEach(res => {
        optionsScheduleSh.push(res)
    })

    const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            async function fetchShiftsData() {
                const response = await fetch(`${apiUrl}/api/shifts`)
                const shiftsAll = await response.json();
                setShifts(shiftsAll.data)
            }
            fetchShiftsData();
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
        }, 10000);
        return () => clearInterval(interval); 
    }, [isMonted]);

    useEffect(() => {
        async function fetchShiftsData() {
            const response = await fetch(`${apiUrl}/api/shifts`)
            const shiftsAll = await response.json();
            setShifts(shiftsAll.data)
        }
        fetchShiftsData();
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
        setTimeout(() => {
            setIsMonted(true);
        }, 10000)
    }, []);

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
            //handleCancelDayModal(true)
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
        } else  */if (isAddSchedule && (!inputAddScheduleHShLM || !inputAddScheduleMShLM)) {
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
        } else if(inputDateShLFormated < fechaActual) {
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

    const handleInputFirstNameShL = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputFirstNameShL(textToSaved)
        }
    };

    const handleInputLastNameShL = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputLastNameShL(textToSaved)
        }
    };

    const handleInputEmailShL = (e) => {
        const texto = e.target.value;
        const textCleaned = cleanString(texto);
        const textToSaved = cleanText(textCleaned);
        setInputEmailShL(textToSaved)
    };

    const handleInputAddScheduleHShLM = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputAddScheduleHShLM(inputValue);
        }
    };

    const handleInputAddScheduleMShLM = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputAddScheduleMShLM(inputValue);
        }
    };

    const handleOnBlurInputAddScheduleHShLM = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            if(inputValue.length == 1){
                setInputAddScheduleHShLM(`0${inputValue}`);
            } else {
                setInputAddScheduleHShLM(inputValue);
            }
        }
    };

    const handleOnBlurInputAddScheduleMShLM = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            if(inputValue.length == 1){
                setInputAddScheduleMShLM(`0${inputValue}`);
            } else {
                setInputAddScheduleMShLM(inputValue);
            }
        }
    };

    const handleDateChange = (e) => {
    setInputDateShL(e);
    };

    const handleSelectScheduleOptionShL = (e) => {
    setSelectScheduleOptionShL(e);
    };

    const handleInputOptionServiceShL = (e) => {
    setInputOptionServiceShL(e);
    };

    const handleSelectOptionHairdresserShL = (e) => {
    setInputOptionHairdresserShL(e);
    };

    const closeM = () => {
        setIsOpenCreateShiftModalLocalMobile(false);
        handleCreateShiftModalMobile(false);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const cleanPropsCreateShift = () => {
        //handleSelectOptionHairdresserShL(optionsHairdresser[0]);
        setInputFirstNameShL('')
        setInputLastNameShL('')
        setInputEmailShL('')
        setInputAddScheduleHShLM('')
        setInputAddScheduleMShLM('')
        setIsAddSchedule(false)
        handleInputOptionServiceShL(optionsService[0]);
        //setInputDateShL(new Date());
        handleSelectScheduleOptionShL(optionsScheduleSh[0]);
    };

    const concatAddSchedules = inputAddScheduleHShLM + ':' + inputAddScheduleMShLM
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
        } else if (isAddSchedule && (!inputAddScheduleHShLM || !inputAddScheduleMShLM)) {
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
        } else if (!isAddSchedule && (selectScheduleOptionShL == '' || selectScheduleOptionShL == 'Horario')) {
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
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const shift_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;
            document.getElementById('btnCreateShift').style.display = 'none';
            setShowSpinner(true);
            const shiftToCreate = {
                hairdresser: selectOptionHairdresserShL,
                first_name: cleanString(inputFirstNameShL),
                last_name: cleanString(inputLastNameShL),
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
            }
        }
    };

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
        }

      return (
        <>
                <div className='confirmationDeleteBtnShiftListModalContainer'>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>¿Estás seguro que deseas anular el día</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>{date} del peluquero {hairdresser}?</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas anular el día {date} del peluquero {hairdresser}?</div>
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
                shift_datetime: fechaActual,
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
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas anular el turno con fecha {date} {schedule} de {hairdresser}?</div>
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

    return (
        <>
            <div className='createShiftModalContainerMobile'>
                {
                    !cancelShiftModal&&!cancelDayModalLocal?
                    <>
                        <div className='createShiftModalContainerMobile__btnCloseModal'>
                            <Link onClick={closeM} className='createShiftModalContainerMobile__btnCloseModal__prop'>
                                Cerrar
                            </Link>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Peluquero:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__selectService'>
                                <select className='createShiftModalContainerMobile__labelInput__selectService__select' value={selectOptionHairdresserShL} onChange={(e) => {handleSelectOptionHairdresserShL(e.target.value)}}>
                                    {optionsHairdresser.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Nombre:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__input'>
                                <input type='text' className='createShiftModalContainerMobile__labelInput__input__prop' value={inputFirstNameShL} onChange={handleInputFirstNameShL}/>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Apellido:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__input'>
                            <input type='text' className='createShiftModalContainerMobile__labelInput__input__prop' value={inputLastNameShL} onChange={handleInputLastNameShL}/>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Fecha:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__datePiker'>
                                <DatePicker className='createShiftModalContainerMobile__labelInput__datePiker__prop'
                                    selected={inputDateShL}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText='-'
                                    />
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Horario:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__selectService'>
                                {
                                    !isAddSchedule?
                                    <select className='createShiftModalContainerMobile__labelInput__selectService__select' value={selectScheduleOptionShL} onChange={(e) => {handleSelectScheduleOptionShL(e.target.value)}}>
                                        {optionsScheduleSh.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    :
                                    <>
                                        <input maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleHShLM} onBlur={handleOnBlurInputAddScheduleHShLM} onChange={handleInputAddScheduleHShLM} />
                                        <div style={{color: 'white'}}>:</div>
                                        <input maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleMShLM} onBlur={handleOnBlurInputAddScheduleMShLM} onChange={handleInputAddScheduleMShLM} />
                                    </>
                                }
                                <button className='itemCreateShift__selectSchedule__btn' onClick={addSchedule}>+</button>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Servicio:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__selectService'>
                                <select className='createShiftModalContainerMobile__labelInput__selectService__select' value={inputOptionServiceShL} onChange={(e) => {handleInputOptionServiceShL(e.target.value)}}>
                                    {optionsService.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Email:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__input'>
                            <input type='email' className='createShiftModalContainerMobile__labelInput__input__prop' value={inputEmailShL} onChange={handleInputEmailShL}/>
                            </div>
                        </div>
                        <div style={{paddingTop:'2vh'}} className='createShiftModalContainerMobile__btns'>
                            <button id='btnCreateShift' className='createShiftModalContainerMobile__btns__btn' onClick={handleBtnCreateShift}>Crear turno</button>
                            <button className='createShiftModalContainerMobile__btns__btn' onClick={handleBtnCancelShiftModal}>Anular turno</button>
                            <button id='btnCreateHoliday' className='createShiftModalContainerMobile__btns__btn' onClick={handleBtnCancelDayModal}>Anular día</button>
                        </div>
                    </>
                    :
                    <>
                        <div className='createShiftModalContainerMobile__btnCloseModal'>
                            <Link className='createShiftModalContainerMobile__btnCloseModal__prop'>
                                Cerrar
                            </Link>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Peluquero:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__selectService'>
                                <select disabled className='createShiftModalContainerMobile__labelInput__selectService__select' value={selectOptionHairdresserShL} onChange={(e) => {handleSelectOptionHairdresserShL(e.target.value)}}>
                                    {optionsHairdresser.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Nombre:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__input'>
                                <input disabled type='text' className='createShiftModalContainerMobile__labelInput__input__prop' value={inputFirstNameShL} onChange={handleInputFirstNameShL}/>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Apellido:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__input'>
                            <input disabled type='text' className='createShiftModalContainerMobile__labelInput__input__prop' value={inputLastNameShL} onChange={handleInputLastNameShL}/>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Fecha:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__input'>
                                <DatePicker className='createShiftModalContainerMobile__labelInput__input__datePikerCreateShift'
                                    selected={inputDateShL}
                                    onChange={handleDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText='-'
                                    disabled
                                    />
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Horario:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__selectService'>
                                {
                                    !isAddSchedule?
                                    <select disabled className='createShiftModalContainerMobile__labelInput__selectService__select' value={selectScheduleOptionShL} onChange={(e) => {handleSelectScheduleOptionShL(e.target.value)}}>
                                        {optionsScheduleSh.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                        ))}
                                    </select>
                                    :
                                    <>
                                        <input disabled maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleHShLM} onBlur={handleOnBlurInputAddScheduleHShLM} onChange={handleInputAddScheduleHShLM} />
                                        <div style={{color: 'white'}}>:</div>
                                        <input disabled maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleMShLM} onBlur={handleOnBlurInputAddScheduleMShLM} onChange={handleInputAddScheduleMShLM} />
                                    </>
                                }
                                <button disabled className='itemCreateShift__selectSchedule__btn' onClick={addSchedule}>+</button>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Servicio:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__selectService'>
                                <select disabled className='createShiftModalContainerMobile__labelInput__selectService__select' value={inputOptionServiceShL} onChange={(e) => {handleInputOptionServiceShL(e.target.value)}}>
                                    {optionsService.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createShiftModalContainerMobile__labelInput'>
                            <div className='createShiftModalContainerMobile__labelInput__label'>
                                <div className='createShiftModalContainerMobile__labelInput__label__prop'>Email:</div>
                            </div>
                            <div className='createShiftModalContainerMobile__labelInput__input'>
                            <input disabled type='email' className='createShiftModalContainerMobile__labelInput__input__prop' value={inputEmailShL} onChange={handleInputEmailShL}/>
                            </div>
                        </div>
                        <div style={{paddingTop:'2vh'}} className='createShiftModalContainerMobile__btns'>
                            <button disabled id='btnCreateShift' className='createShiftModalContainerMobile__btns__btn'>Crear turno</button>
                            <button disabled className='createShiftModalContainerMobile__btns__btn' onClick={handleBtnCancelShiftModal}>Anular turno</button>
                            <button disabled id='btnCreateHoliday' className='createShiftModalContainerMobile__btns__btn' onClick={handleBtnCancelDayModal}>Anular día</button>
                        </div>
                    </>
                }
                {cancelDayModalLocal&&<CancelDayModal hairdresser={selectOptionHairdresserShL} handleCancelDayModalLocal={handleCancelDayModalLocal} date={formattedDate}/>}
                {cancelShiftModalLocal&&<CancelShiftModal hairdresser={selectOptionHairdresserShL} date={formattedDate} schedule={!isAddSchedule?(selectScheduleOptionShL?selectScheduleOptionShL:optionsScheduleSh[0]):concatAddSchedules}/>}
                {showSpinner&&<Spinner/>}
            </div>
        </>
    )
}

export default CreateShiftModalMobile
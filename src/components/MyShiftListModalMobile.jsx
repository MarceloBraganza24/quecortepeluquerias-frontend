import React, { useState, useEffect, useContext } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext'; 
import moment from 'moment-timezone'

const MyShiftListModalMobile = ({id,hairdresser,first_name,last_name,service,email,date,schedule,handleUpdateMyShiftModalMobileLocal,shifts,holidaysData}) => {
    const adjustedDate = moment.tz(date, 'America/Argentina/Buenos_Aires').startOf('day').toDate();
    const formatAdjustedDate = moment(adjustedDate).format('YYYY-MM-DD')
    const adjustedNewDatee = new Date(adjustedDate);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [confirmationDelShiftsModal, handleConfirmationDelShiftsModal] = useState(false);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const {handleUpdateMyShiftModalMobile} = useContext(OpenModalContext);
    const [hairdressers, setHairdressers] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [workDays, setWorkDays] = useState([]);
    const [services, setServices] = useState([]);
    
    const optionsHairdresser = ['Peluquero'];
    hairdressers.forEach(res => {
        optionsHairdresser.push(res.name)
    })
    
    const [expiredDate, setExpiredDate] = useState(false);
    
    const [selectHairdresserISh, setSelectHairdresserISh] = useState(`${hairdresser}`);
    const [inputFirstNameISh, setInputFirstNameISh] = useState('');
    const [inputLastNameISh, setInputLastNameISh] = useState('');
    const [inputServiceISh, setInputServiceISh] = useState(`${service}`);
    const [inputEmailISh, setInputEmailISh] = useState('');
    const [inputDateISh, setInputDateISh] = useState(`${adjustedDate}`);
    const [selectScheduleOptionISh, setSelectScheduleOptionISh] = useState('');

    const formatInputDate = moment(inputDateISh).format('YYYY-MM-DD')
    const concatDateSchedule = (formatInputDate) + ' ' + (selectScheduleOptionISh?selectScheduleOptionISh:schedule)
    const dateMShLFormated = new Date(concatDateSchedule);

    let fechaActual = new Date();

    const servicesWithOutService = services.filter(item => item.title != service)
    const optionsService = [];
    optionsService.push(service)
    servicesWithOutService.forEach(item => {
        optionsService.push(item.title)
    })

    useEffect(() => {
        if(dateMShLFormated < fechaActual) {
            setExpiredDate(true);
        }
        setHolidays(holidaysData)
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
    },[])

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
    
    const handleInputFirstNameISh = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputFirstNameISh(textToSaved)
        }
        texto===first_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleInputLastNameISh = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputLastNameISh(textToSaved)
        }
        texto===last_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleSelectServiceISh = (e) => {
        setInputServiceISh(e);
        e===service?setInputChanges(false):setInputChanges(true);
        e===''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleSelectHairdresserISh = (e) => {
        setSelectHairdresserISh(e.target.value);
        e.target.value===hairdresser?setInputChanges(false):setInputChanges(true);
        e.target.value===''&&setInputChanges(false);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleInputEmailISh = (e) => {
        const texto = e.target.value;
        setInputEmailISh(texto);
        texto===email?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };
    
    const handleSelectScheduleOptionISh = (e) => {
        const texto = e.target.value;
        setSelectScheduleOptionISh(texto);
        texto==schedule?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
    };

    const handleDateChange = date => {
        date&&setInputDateISh(date);
        const newDate = new Date(date)
        if(newDate.getTime() == adjustedNewDatee.getTime()) {
            setInputChanges(false)
        } else {
            setInputChanges(true);
        }
        if(selectHairdresserISh!==hairdresser && selectHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleBtnDelShift = async() => {
        handleConfirmationDelShiftsModal(true);
    };

    const fecha15DiasDespues = new Date(fechaActual);
    fecha15DiasDespues.setDate(fechaActual.getDate() + 15);

    const dateToCompareHoliday = {
        date: formatInputDate?formatInputDate:adjustedDate,
        hairdresser: selectHairdresserISh
    }
    const existsHoliday = holidays.some(holiday =>
        holiday.date == dateToCompareHoliday.date &&
        holiday.hairdresser == dateToCompareHoliday.hairdresser
    );

    const workDaysByHairdresserWorkDayFiltered = workDays.filter(item => (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==6&&'Sabado')))
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==0&&'Domingo'))) 
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==1&&'Lunes'))) 
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==2&&'Martes'))) 
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==3&&'Miercoles'))) 
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==4&&'Jueves'))) 
        || (item.hairdresser == selectHairdresserISh && (item.work_day == (dateMShLFormated.getDay()==5&&'Viernes'))) 
    )

    const schedulesByHairdresserDate = workDaysByHairdresserWorkDayFiltered.map(item => item.schedule)
    schedulesByHairdresserDate.sort((a, b) => {
        const timeA = a.split(':').map(Number);
        const timeB = b.split(':').map(Number);
        const totalMinutesA = timeA[0] * 60 + timeA[1];
        const totalMinutesB = timeB[0] * 60 + timeB[1];
        
        return totalMinutesA - totalMinutesB;
    });

    const existsUniqueHairdresserSchedules = schedulesByHairdresserDate.includes(selectScheduleOptionISh?selectScheduleOptionISh:schedule);


    const shiftsFiltered = shifts.filter(shift => shift.hairdresser == selectHairdresserISh && shift.date == formatInputDate);
    const schedulesHairdressersFilteredByNotCancel = shiftsFiltered.map(item => item.schedule)

    const optionsScheduleISh = [];
    optionsScheduleISh.push(`${schedule}`);

    const ahora = new Date();
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes();

    let filteredArray = schedulesByHairdresserDate.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));
    const generalFilteredArray = filteredArray.filter(horario => {
        const [horas, minutos] = horario.split(":").map(Number); // Convierte HH:MM a números
        const minutosTotales = horas * 60 + minutos; // Convierte HH:MM a minutos totales
        return minutosTotales > horaActual; // Compara con la hora actual
    });

    const chrismasMondaySchedules = ['09:00','09:20','09:40','10:00','10:20','10:40','11:00','11:30','12:00','12:20','12:40','16:40','17:00','17:30','18:00','18:20','18:40','19:00','19:20','19:40','20:00','20:30']
    const existsUniqueMondayHairdresserSchedules = chrismasMondaySchedules.includes(selectScheduleOptionISh?selectScheduleOptionISh:schedule);
    let filteredArrayMonday = chrismasMondaySchedules.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));
    const generalFilteredArrayMonday = filteredArrayMonday.filter(horario => {
        const [horas, minutos] = horario.split(":").map(Number); // Convierte HH:MM a números
        const minutosTotales = horas * 60 + minutos; // Convierte HH:MM a minutos totales
        return minutosTotales > horaActual; // Compara con la hora actual
    });

    const chrismasTuesdaySchedules = ['09:00','09:20','09:40','10:00','10:20','10:40','11:00','11:30','12:00','12:20','12:40','13:00','13:20','13:40']
    const existsUniqueTuesdayHairdresserSchedules = chrismasTuesdaySchedules.includes(selectScheduleOptionISh?selectScheduleOptionISh:schedule);
    let filteredArrayTuesday = chrismasTuesdaySchedules.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));
    const generalFilteredArrayTuesday = filteredArrayTuesday.filter(horario => {
        const [horas, minutos] = horario.split(":").map(Number); // Convierte HH:MM a números
        const minutosTotales = horas * 60 + minutos; // Convierte HH:MM a minutos totales
        return minutosTotales > horaActual; // Compara con la hora actual
    });

    const hoy = new Date();
    const fechaSeleccionada = new Date(inputDateISh);

    if(selectHairdresserISh == '' || selectHairdresserISh == 'Peluquero') {
        optionsScheduleISh.push('Selecciona un peluquero')
    } else if(existsHoliday) {
        optionsScheduleISh.push('Peluquero de vacaciones')
    } else if(formatInputDate == '2024-12-23' || formatInputDate == '2024-12-30') {
        if(hoy.toDateString() == fechaSeleccionada.toDateString()) {
            if(generalFilteredArrayMonday.length != 0) {
                generalFilteredArrayMonday.forEach(res => {
                    optionsScheduleISh.push(res)
                })
            } else {
                optionsScheduleISh.push('No hay horarios')
            }
        } else {
            if(filteredArrayMonday.length != 0) {
                filteredArrayMonday.forEach(res => {
                    optionsScheduleISh.push(res)
                })
            } else {
                optionsScheduleISh.push('No hay horarios')
            }
        }
    } else if(formatInputDate == '2024-12-24' || formatInputDate == '2024-12-31') {
        if(hoy.toDateString() == fechaSeleccionada.toDateString()) {
            if(generalFilteredArrayTuesday.length != 0) {
                generalFilteredArrayTuesday.forEach(res => {
                    optionsScheduleISh.push(res)
                })
            } else {
                optionsScheduleISh.push('No hay horarios')
            }
        } else {
            if(filteredArrayTuesday.length != 0) {
                filteredArrayTuesday.forEach(res => {
                    optionsScheduleISh.push(res)
                })
            } else {
                optionsScheduleISh.push('No hay horarios')
            }
        }
    } else {
        if(hoy.toDateString() == fechaSeleccionada.toDateString()) {
            if(generalFilteredArray.length != 0) {
                generalFilteredArray.forEach(res => {
                    optionsScheduleISh.push(res)
                })
            } else {
                optionsScheduleISh.push('No hay horarios')
            }
        } else {
            if(filteredArray.length != 0) {
                filteredArray.forEach(res => {
                    optionsScheduleISh.push(res)
                })
            } else {
                optionsScheduleISh.push('No hay horarios')
            }
        }
    }

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdShift = async() => {

        if((selectHairdresserISh == hairdresser || selectHairdresserISh == '') && (inputFirstNameISh == first_name || inputFirstNameISh == '') && (inputLastNameISh == last_name || inputLastNameISh == '') && (inputServiceISh == service || inputServiceISh == '') && (inputEmailISh == email || inputEmailISh == '') && (formatAdjustedDate == formatInputDate) && (selectScheduleOptionISh == schedule || selectScheduleOptionISh == '')) {
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
        } /* else if (dateMShLFormated.getDay() == 0 || dateMShLFormated.getDay() == 1) {
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
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } */ else if(existsHoliday) {
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
        } else if(!existsUniqueHairdresserSchedules && formatInputDate!='2024-12-23' && formatInputDate!='2024-12-30' && formatInputDate!='2024-12-24' && formatInputDate!='2024-12-31'){
            toast('El horario no esta permitido para el día de semana seleccionado del peluquero elegido', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(!existsUniqueMondayHairdresserSchedules && (formatInputDate=='2024-12-23' || formatInputDate=='2024-12-30')){
            toast('El horario no esta permitido para el día de semana seleccionado del peluquero elegido', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(!existsUniqueTuesdayHairdresserSchedules && (formatInputDate=='2024-12-24' || formatInputDate=='2024-12-31')){
            toast('El horario no esta permitido para el día de semana seleccionado del peluquero elegido', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(dateMShLFormated < fechaActual) {
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
        } else if(selectHairdresserISh == 'Peluquero' || selectHairdresserISh == '') {
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
        }/*  else if(dateMShLFormated > fecha15DiasDespues) {
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
        } */ else if (!isValidUTF8(inputFirstNameISh?inputFirstNameISh:first_name)) {
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
        } else if (!isValidUTF8(inputLastNameISh?inputLastNameISh:last_name)) {
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
        } else if (!isValidUTF8(inputEmailISh?inputEmailISh:email)) {
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
            document.getElementById('btnUpdateShift').style.display = 'none';
            setShowSpinner(true);
             const shiftToUpdate = {
                hairdresser: selectHairdresserISh,
                first_name: inputFirstNameISh?inputFirstNameISh:first_name,
                last_name: inputLastNameISh?inputLastNameISh:last_name,
                service: inputServiceISh?inputServiceISh:service,
                email: email,
                date: formatInputDate?formatInputDate:adjustedDate,
                schedule: selectScheduleOptionISh?selectScheduleOptionISh:schedule
            }
            const response = await fetch(`${apiUrl}/api/shifts/${id}`, {
                method: 'PUT',         
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(shiftToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has actualizado el turno correctamente!', {
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
                    handleUpdateMyShiftModalMobileLocal(false);
                    handleUpdateMyShiftModalMobile(false);
                    setInputChanges(false)
                }, 1500);
            } else if(data.error === 'There is already a shift with that date and time') {
                toast('Ya existe un turno con esa fecha y horario del peluquero elegido!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnUpdateShift').style.display = 'block';
                setShowSpinner(false);
            } else {
                toast('Ha ocurrido un error, intente nuevamente!', {
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
                    handleUpdateMyShiftModalMobileLocal(false);
                    handleUpdateMyShiftModalMobile(false);
                    setInputChanges(false)
                }, 1500);
            }
        }
    };

    const ConfirmationDeleteModal = ({formatInputDate,schedule}) => {
        const handleBtnDelShift = async() => {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/shifts/${id}`, {
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(response.ok) {
                toast('Has eliminado el turno correctamente!', {
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
                    handleConfirmationDelShiftsModal(false);
                    handleUpdateMyShiftModalMobile(false);
                    handleUpdateMyShiftModalMobileLocal(false);
                }, 2000);
            } else {
                toast('Has ocurrido un error al querer eliminar el turno!', {
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
            handleConfirmationDelShiftsModal(false)
        }

        return (
            <>
                <div className='confirmationDeleteBtnMyShiftListModalContainer'>
                    <div className='confirmationDeleteBtnMyShiftListModalContainer__ask'>¿Estás seguro que deseas borrar el turno con fecha {formatInputDate} {schedule}?</div>
                    <div className='confirmationDeleteBtnMyShiftListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnMyShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar el turno con fecha {formatInputDate} {schedule}?</div>
                    </div>
                    <div className='confirmationDeleteBtnMyShiftListModalContainer__btns'>
                        <button onClick={handleBtnDelShift} className='confirmationDeleteBtnMyShiftListModalContainer__btns__btn'>Si</button>
                        <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnMyShiftListModalContainer__btns__btn'>No</button>
                        {showSpinner&&<Spinner/>}
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdateMyShiftModalMobile(false);
        handleUpdateMyShiftModalMobileLocal(false);
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

    const inputSelectDisabledStyle = {
        color: 'black',
        backgroundColor: 'white'
    };

    return (
    <>
        <div className='myShiftModalContainerMobile'>
            <div className='myShiftModalContainerMobile__btnCloseModal'>
                {
                    !confirmationDelShiftsModal&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='myShiftModalContainerMobile__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='myShiftModalContainerMobile__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            {
                !confirmationDelShiftsModal&&!expiredDate?
                <>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Nombre</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input /* style={inputSelectDisabledStyle} disabled */ className='myShiftModalContainerMobile__labelInput__input__prop' value={!inputFirstNameISh?first_name:inputFirstNameISh}onChange={handleInputFirstNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Apellido</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input /* style={inputSelectDisabledStyle} disabled */ className='myShiftModalContainerMobile__labelInput__input__prop' value={!inputLastNameISh?last_name:inputLastNameISh}onChange={handleInputLastNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Email</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input disabled style={{backgroundColor:'white',color:'black'}} className='myShiftModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailISh?email:inputEmailISh}onChange={handleInputEmailISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Peluquero</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectSchedule'>
                            <select className='myShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectHairdresserISh} onChange={handleSelectHairdresserISh}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Servicio</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectService'>
                            <select className='myShiftModalContainerMobile__labelInput__selectService__select' value={inputServiceISh} onChange={(e) => {handleSelectServiceISh(e.target.value)}}>
                                {optionsService.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Fecha</div>
                        <DatePicker className='myShiftModalContainerMobile__datePikerShiftsListMobile'
                            selected={!inputDateISh?formatInputDate:inputDateISh}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Horario</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectSchedule'>
                            <select className='myShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectScheduleOptionISh} onChange={handleSelectScheduleOptionISh}>
                                {optionsScheduleISh.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__btns'>
                        <button className='myShiftModalContainerMobile__btns__btn' onClick={handleBtnDelShift}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__btns'>
                        <button id='btnUpdateShift' className='myShiftModalContainerMobile__btns__btn' onClick={handleBtnUpdShift}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
                :
                <>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Nombre</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__input__prop' value={!inputFirstNameISh?first_name:inputFirstNameISh}onChange={handleInputFirstNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Apellido</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__input__prop' value={!inputLastNameISh?last_name:inputLastNameISh}onChange={handleInputLastNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Email</div>
                        <div className='myShiftModalContainerMobile__labelInput__input'>
                            <input style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailISh?email:inputEmailISh}onChange={handleInputEmailISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Peluquero</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectSchedule'>
                            <select style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectHairdresserISh} onChange={handleSelectHairdresserISh}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Servicio</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectService'>
                            <select style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__selectService__select' value={inputServiceISh} onChange={(e) => {handleSelectServiceISh(e.target.value)}}>
                                {optionsService.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Fecha</div>
                        <DatePicker className='myShiftModalContainerMobile__datePikerShiftsListMobile'
                            selected={!inputDateISh?formatInputDate:inputDateISh}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            disabled
                        />
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__labelInput'>
                        <div className='myShiftModalContainerMobile__labelInput__label'>Horario</div>
                        <div className='myShiftModalContainerMobile__labelInput__selectSchedule'>
                            <select style={inputSelectDisabledStyle} disabled className='myShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectScheduleOptionISh} onChange={handleSelectScheduleOptionISh}>
                                {optionsScheduleISh.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='myShiftModalContainerMobile__btns'>
                        <button className='myShiftModalContainerMobile__btns__btn' onClick={handleBtnDelShift}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__btns'>
                        <button disabled id='btnUpdateShift' className='myShiftModalContainerMobile__btns__btn'>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='myShiftModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
            }
            
            {
                confirmationDelShiftsModal&&<ConfirmationDeleteModal formatInputDate={formatInputDate} schedule={schedule}/>
            }
        </div>
    </>
    )
}

export default MyShiftListModalMobile
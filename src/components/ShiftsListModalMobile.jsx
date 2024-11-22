import React, { useState, useEffect, useContext } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext'; 
import moment from 'moment-timezone'

const ShiftsListModalMobile = ({id,hairdresser,first_name,last_name,service,email,date,schedule,handleUpdateShiftModalMobileLocal,shifts,services,workDays,hairdressers,holidays}) => {
    const adjustedItemDate = moment.tz(date, 'America/Argentina/Buenos_Aires').startOf('day').toDate();
    
    const [confirmationDelShiftsModalMobile, handleConfirmationDelShiftsModalMobile] = useState(false);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const {handleUpdateShiftModalMobile} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [inputFirstNameISh, setInputFirstNameISh] = useState('');
    const [inputLastNameISh, setInputLastNameISh] = useState('');
    const [inputServiceISh, setInputServiceISh] = useState(`${service}`);
    const [inputEmailISh, setInputEmailISh] = useState('');
    const [inputDateISh, setInputDateISh] = useState(`${adjustedItemDate}`);
    const [selectScheduleOptionISh, setSelectScheduleOptionISh] = useState(`${schedule}`);
    const [inputAddScheduleHShLM, setInputAddScheduleHShLM] = useState('');
    const [inputAddScheduleMShLM, setInputAddScheduleMShLM] = useState('');
    const [selectOptionHairdresserISh, setSelectOptionHairdresserISh] = useState(`${hairdresser}`);
    const [isAddSchedule, setIsAddSchedule] = useState(false);
    
    const concatAddSchedules = inputAddScheduleHShLM + ':' + inputAddScheduleMShLM
    const formatInputDate = moment(inputDateISh).format('YYYY-MM-DD')
    const concatDateSchedule = (formatInputDate) + ' ' + (!isAddSchedule?(selectScheduleOptionISh?selectScheduleOptionISh:schedule):concatAddSchedules)
    let concatNewDateSchedule = new Date(concatDateSchedule);
    
    const servicesWithOutService = services.filter(item => item.title != service)
    const optionsService = [];
    optionsService.push(service)
    servicesWithOutService.forEach(item => {
        optionsService.push(item.title)
    }) 

    const workDaysByHairdresserWorkDayFiltered = workDays.filter(item => (item.hairdresser == selectOptionHairdresserISh && (item.work_day == (concatNewDateSchedule.getDay()==6&&'Sabado')))
        || (item.hairdresser == selectOptionHairdresserISh && (item.work_day == (concatNewDateSchedule.getDay()==0&&'Domingo'))) 
        || (item.hairdresser == selectOptionHairdresserISh && (item.work_day == (concatNewDateSchedule.getDay()==1&&'Lunes'))) 
        || (item.hairdresser == selectOptionHairdresserISh && (item.work_day == (concatNewDateSchedule.getDay()==2&&'Martes'))) 
        || (item.hairdresser == selectOptionHairdresserISh && (item.work_day == (concatNewDateSchedule.getDay()==3&&'Miercoles'))) 
        || (item.hairdresser == selectOptionHairdresserISh && (item.work_day == (concatNewDateSchedule.getDay()==4&&'Jueves'))) 
        || (item.hairdresser == selectOptionHairdresserISh && (item.work_day == (concatNewDateSchedule.getDay()==5&&'Viernes'))) 
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
    
    const shiftsFiltered = shifts.filter(shift => shift.hairdresser == selectOptionHairdresserISh && shift.date == formatInputDate);
    const schedulesHairdressersFilteredByNotCancel = shiftsFiltered.map(item => item.schedule)
    
    const optionsScheduleSh = [];
    optionsScheduleSh.push(`${schedule}`);
    
    let filteredArray = schedulesByHairdresserDate.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));
    
    const chrismasMondaySchedules = ['09:00','09:20','09:40','10:00','10:20','10:40','11:00','11:30','12:00','12:20','12:40','16:40','17:00','17:30','18:00','18:20','18:40','19:00','19:20','19:40','20:00','20:30']
    const existsUniqueMondayHairdresserSchedules = chrismasMondaySchedules.includes(selectScheduleOptionISh?selectScheduleOptionISh:schedule);
    let filteredArrayMonday = chrismasMondaySchedules.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));
    
    const chrismasTuesdaySchedules = ['09:00','09:20','09:40','10:00','10:20','10:40','11:00','11:30','12:00','12:20','12:40','13:00','13:20','13:40']
    const existsUniqueTuesdayHairdresserSchedules = chrismasTuesdaySchedules.includes(selectScheduleOptionISh?selectScheduleOptionISh:schedule);
    let filteredArrayTuesday = chrismasTuesdaySchedules.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));

    const dateToCompareHoliday = {
        date: formatInputDate,
        hairdresser: selectOptionHairdresserISh
    }
    const existsHoliday = holidays.some(holiday =>
        holiday.date == dateToCompareHoliday.date &&
        holiday.hairdresser == dateToCompareHoliday.hairdresser
    );

    if(existsHoliday) {
        optionsScheduleSh.push('Peluquero de vacaciones')
    } else if(selectOptionHairdresserISh == '' || selectOptionHairdresserISh == 'Peluquero') {
        optionsScheduleSh.push('Selecciona un peluquero')
    } else if(formatInputDate == '2024-12-23' || formatInputDate == '2024-12-30') {
        filteredArrayMonday.forEach((item)=>{
            optionsScheduleSh.push(item)
        })
    } else if(formatInputDate == '2024-12-24' || formatInputDate == '2024-12-31') {
        filteredArrayTuesday.forEach((item)=>{
            optionsScheduleSh.push(item)
        })
    } else if(filteredArray.length == 0) {
        optionsScheduleSh.push('No hay horarios')
    } else {
        filteredArray.forEach(res => {
            optionsScheduleSh.push(res)
        })
    }

    /* filteredArray.forEach(res => {
        optionsScheduleSh.push(res)
    }) */

    const optionsHairdresser = ['Peluquero'];
    hairdressers.forEach(res => {
        optionsHairdresser.push(res.name)
    })

    const addSchedule = () => {
        if(isAddSchedule){
            setIsAddSchedule(false)
            setInputChanges(false)
        } else {
            setIsAddSchedule(true)
            setInputChanges(true)
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

    const adjustedNewDatee = new Date(adjustedItemDate)

    const handleSelectOptionHairdresserISh = (e) => {
        setSelectOptionHairdresserISh(e);
        e===hairdresser?setInputChanges(false):setInputChanges(true);
        e===''&&setInputChanges(false);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleInputFirstNameISh = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            const textToSaved = cleanText(texto);
            setInputFirstNameISh(textToSaved)
        }
        texto===first_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
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
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleSelectServiceISh = (e) => {
        setInputServiceISh(e);
        e===service?setInputChanges(false):setInputChanges(true);
        e===''&&setInputChanges(false);
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleInputEmailISh = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputEmailISh(textToSaved)
        texto===email?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };
    
    const handleSelectScheduleOptionISh = (e) => {
        const texto = e.target.value;
        setSelectScheduleOptionISh(texto);
        texto===schedule?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(formatInputDate!=date)setInputChanges(true);
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

    const handleDateChange = date => {
        setInputDateISh(date);
        const newDate = new Date(date)
        if(newDate.getTime() == adjustedNewDatee.getTime()) {
            setInputChanges(false)
        } else {
            setInputChanges(true);
        }
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleBtnDelShift = async() => {
        handleConfirmationDelShiftsModalMobile(true);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdShift = async() => {
        if( !isAddSchedule && (inputFirstNameISh == '' || inputFirstNameISh == first_name) && (selectOptionHairdresserISh == '' || selectOptionHairdresserISh == hairdresser) && (inputLastNameISh == '' || inputLastNameISh == last_name) && (inputServiceISh == '' || inputServiceISh == service) && (inputEmailISh == '' || inputEmailISh == email) && (formatInputDate == '' || formatInputDate == date) && (!isAddSchedule && (selectScheduleOptionISh == '' || selectScheduleOptionISh == schedule) ) ) {
            toast('No tienes cambios para actualizar', {
                position: "top-right",
                autoClose: 1000,
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
        } else if(!isAddSchedule && !existsUniqueHairdresserSchedules && formatInputDate!='2024-12-23' && formatInputDate!='2024-12-30' && formatInputDate!='2024-12-24' && formatInputDate!='2024-12-31'){
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
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if(!isAddSchedule && !existsUniqueMondayHairdresserSchedules && (formatInputDate=='2024-12-23' || formatInputDate=='2024-12-30')){
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
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if(!isAddSchedule && !existsUniqueTuesdayHairdresserSchedules && (formatInputDate=='2024-12-24' || formatInputDate=='2024-12-31')){
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
            setShowSpinner(false);
            document.getElementById('btnUpdateShift').style.display = 'block';
        } else if(selectOptionHairdresserISh == 'Peluquero' || selectOptionHairdresserISh == '') {
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
        } else if (!isValidUTF8(inputFirstNameISh)) {
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
        } else if (!isValidUTF8(inputLastNameISh)) {
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
        } else if (!isValidUTF8(inputEmailISh)) {
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
                hairdresser: selectOptionHairdresserISh,
                first_name: inputFirstNameISh?cleanString(inputFirstNameISh):first_name,
                last_name: inputLastNameISh?cleanString(inputLastNameISh):last_name,
                service: (inputServiceISh=='Servicio'||inputServiceISh=='-')?'-':inputServiceISh,
                email: inputEmailISh?cleanString(inputEmailISh):email,
                date: formatInputDate?formatInputDate:adjustedItemDate,
                schedule: !isAddSchedule?(selectScheduleOptionISh?selectScheduleOptionISh:schedule):concatAddSchedules
            }
            const response = await fetch(`${apiUrl}/api/shifts/${id}`, {
                method: 'PUT',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shiftToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has actualizado el turno correctamente!', {
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
                    handleUpdateShiftModalMobileLocal(false);
                    handleUpdateShiftModalMobile(false);
                    setInputChanges(false);
                }, 2000);
            }
            if(data.error === 'There is already a shift with that date and time') {
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
            }
        }
    };

    const ConfirmationDeleteModal = () => {
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
                    handleConfirmationDelShiftsModalMobile(false);
                    handleUpdateShiftModalMobile(false);
                    handleUpdateShiftModalMobileLocal(false);
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
            handleConfirmationDelShiftsModalMobile(false)
        }

        return (
            <>
                <div className='confirmationDeleteBtnShiftListModalContainer'>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>¿Estás seguro que deseas borrar el turno?</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>borrar el turno?</div>
                    </div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__btns'>
                        <button onClick={handleBtnDelShift} className='confirmationDeleteBtnShiftListModalContainer__btns__btn'>Si</button>
                        <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnShiftListModalContainer__btns__btn'>No</button>
                        {showSpinner&&<Spinner/>}
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdateShiftModalMobile(false);
        handleUpdateShiftModalMobileLocal(false);
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

    const tagDisabled = {
        backgroundColor: 'white',
        color: 'black'
    };

    return (
    <>
        <div className='updateShiftModalContainerMobile'>
            <div className='updateShiftModalContainerMobile__btnCloseModal'>
                {
                    !confirmationDelShiftsModalMobile&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='updateShiftModalContainerMobile__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='updateShiftModalContainerMobile__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            {
                !confirmationDelShiftsModalMobile?
                <>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Peluquero:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__selectService'>
                            <select className='updateShiftModalContainerMobile__labelInput__selectService__select' value={selectOptionHairdresserISh} onChange={(e) => {handleSelectOptionHairdresserISh(e.target.value)}}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Nombre:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__input'>
                            <input /* style={tagDisabled} disabled */ className='updateShiftModalContainerMobile__labelInput__input__prop' value={!inputFirstNameISh?first_name:inputFirstNameISh}onChange={handleInputFirstNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Apellido:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__input'>
                            <input /* style={tagDisabled} disabled */ className='updateShiftModalContainerMobile__labelInput__input__prop' value={!inputLastNameISh?last_name:inputLastNameISh}onChange={handleInputLastNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Fecha:</div>
                        <DatePicker className='updateShiftModalContainerMobile__labelInput__datePikerShiftsListMobile'
                            selected={!inputDateISh?formatInputDate:inputDateISh}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Horario:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__selectSchedule'>
                            {
                                !isAddSchedule?
                                <select className='updateShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectScheduleOptionISh} onChange={handleSelectScheduleOptionISh}>
                                    {optionsScheduleSh.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                :
                                <>
                                    <input style={{width: '10vh'}} maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleHShLM} onBlur={handleOnBlurInputAddScheduleHShLM} onChange={handleInputAddScheduleHShLM} />
                                    <div style={{color: 'white'}}>:</div>
                                    <input style={{width: '10vh'}} maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleMShLM} onBlur={handleOnBlurInputAddScheduleMShLM} onChange={handleInputAddScheduleMShLM} />
                                </>
                            }
                            <button className='itemCreateShift__selectSchedule__btn' style={{width: '5vh'}} onClick={addSchedule}>+</button>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Servicio:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__selectService'>
                            <select className='updateShiftModalContainerMobile__labelInput__selectService__select' value={inputServiceISh} onChange={(e) => {handleSelectServiceISh(e.target.value)}}>
                                {optionsService.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Email:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled /* style={{backgroundColor:'white',color:'black'}} */ className='updateShiftModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailISh?email:inputEmailISh}onChange={handleInputEmailISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__btns'>
                        <button className='updateShiftModalContainerMobile__btns__btn' onClick={handleBtnDelShift}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateShiftModalContainerMobile__btns'>
                        <button id='btnUpdateShift' className='updateShiftModalContainerMobile__btns__btn' onClick={handleBtnUpdShift}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateShiftModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
                :
                <>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Peluquero:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__selectService'>
                            <select disabled className='updateShiftModalContainerMobile__labelInput__selectService__select' value={selectOptionHairdresserISh} onChange={(e) => {handleSelectOptionHairdresserISh(e.target.value)}}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Nombre:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled className='updateShiftModalContainerMobile__labelInput__input__prop' value={!inputFirstNameISh?first_name:inputFirstNameISh}onChange={handleInputFirstNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Apellido:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled className='updateShiftModalContainerMobile__labelInput__input__prop' value={!inputLastNameISh?last_name:inputLastNameISh}onChange={handleInputLastNameISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Fecha:</div>
                        <DatePicker className='updateShiftModalContainerMobile__labelInput__datePikerShiftsListMobile'
                            selected={!inputDateISh?formatInputDate:inputDateISh}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            disabled
                        />
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Horario:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__selectSchedule'>
                            {
                                !isAddSchedule?
                                <select disabled className='updateShiftModalContainerMobile__labelInput__selectSchedule__select' value={selectScheduleOptionISh} onChange={handleSelectScheduleOptionISh}>
                                    {optionsScheduleSh.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                :
                                <>
                                    <input disabled style={{width: '10vh', backgroundColor:'grey'}} maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleHShLM} onChange={handleInputAddScheduleHShLM} />
                                    <div style={{color: 'white'}}>:</div>
                                    <input disabled style={{width: '10vh', backgroundColor:'grey'}} maxLength={2} className='itemCreateShift__selectSchedule__input' type="text" value={inputAddScheduleMShLM} onChange={handleInputAddScheduleMShLM} />
                                </>
                            }
                            <button disabled className='itemCreateShift__selectSchedule__btn' style={{width: '5vh'}} onClick={addSchedule}>+</button>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Servicio:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__selectService'>
                            <select disabled className='updateShiftModalContainerMobile__labelInput__selectService__select' value={inputServiceISh} onChange={(e) => {handleSelectServiceISh(e.target.value)}}>
                                {optionsService.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__labelInput'>
                        <div className='updateShiftModalContainerMobile__labelInput__label'>Email:</div>
                        <div className='updateShiftModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled className='updateShiftModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailISh?email:inputEmailISh}onChange={handleInputEmailISh}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateShiftModalContainerMobile__btns'>
                        <button disabled className='updateShiftModalContainerMobile__btns__btn' onClick={handleBtnDelShift}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateShiftModalContainerMobile__btns'>
                        <button disabled id='btnUpdateShift' className='updateShiftModalContainerMobile__btns__btn' onClick={handleBtnUpdShift}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateShiftModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
            }
            {
                confirmationDelShiftsModalMobile&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
    )
}

export default ShiftsListModalMobile
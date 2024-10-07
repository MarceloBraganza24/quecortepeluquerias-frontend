import React, { useState, useEffect, useContext } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext'; 
import moment from 'moment-timezone'

const ShiftsListModal = ({id,hairdresser,first_name,last_name,service,email,date,schedule,handleUpdateShiftModalLocal,workDays,shifts,hairdressers,services}) => {
    const adjustedItemDate = moment.tz(date, 'America/Argentina/Buenos_Aires').startOf('day').toDate();
    
    const [confirmationDelShiftsModal, handleConfirmationDelShiftsModal] = useState(false);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const {handleUpdateShiftModal} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [inputFirstNameISh, setInputFirstNameISh] = useState('');
    const [inputLastNameISh, setInputLastNameISh] = useState('');
    const [inputServiceISh, setInputServiceISh] = useState('');
    const [inputEmailISh, setInputEmailISh] = useState('');
    const [inputDateISh, setInputDateISh] = useState(`${adjustedItemDate}`);
    const [selectScheduleOptionISh, setSelectScheduleOptionISh] = useState(`${schedule}`);

    const [inputAddScheduleHISh, setInputAddScheduleHISh] = useState(``);
    const [inputAddScheduleMISh, setInputAddScheduleMISh] = useState(``);
    const [isAddScheduleISh, setIsAddScheduleISh] = useState(false);
    
    const [selectOptionHairdresserISh, setSelectOptionHairdresserISh] = useState(`${hairdresser}`);

    const concatAddSchedules = inputAddScheduleHISh + ':' + inputAddScheduleMISh
    const formatInputDate = moment(inputDateISh).format('YYYY-MM-DD')
    const concatDateSchedule = (formatInputDate) + ' ' + (!isAddScheduleISh?(selectScheduleOptionISh?selectScheduleOptionISh:schedule):concatAddSchedules)
    let concatNewDateSchedule = new Date(concatDateSchedule);
    
    let fechaActual = new Date();
    
    const servicesByCaegory = services.filter(item => item.category == 'No socio')
    const servicesWithOutService = servicesByCaegory.filter(item => item.title != service)
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

    const optionsScheduleISh = [];
    
    let filteredArray = schedulesByHairdresserDate.filter(time => !schedulesHairdressersFilteredByNotCancel.includes(time));

    optionsScheduleISh.push(`${schedule}`);
    filteredArray.forEach(res => {
        optionsScheduleISh.push(res)
    })

    const optionsHairdresser = ['Peluquero'];
    hairdressers.forEach(res => {
        optionsHairdresser.push(res.name)
    })

    const adjustedNewDatee = new Date(adjustedItemDate)

    const handleSelectOptionHairdresserISh = (e) => {
        setSelectOptionHairdresserISh(e);
        e===hairdresser?setInputChanges(false):setInputChanges(true);
        e===''&&setInputChanges(false);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(adjustedItemDate.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
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

    const handleInputFirstNameISh = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputFirstNameISh(textToSaved)
        }
        texto===first_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(adjustedItemDate.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleInputLastNameISh = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputLastNameISh(textToSaved)
        }
        texto===last_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(inputEmailISh!==email && inputEmailISh!=='')setInputChanges(true);
        if(adjustedItemDate.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
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
        if(adjustedItemDate.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
        if(selectScheduleOptionISh!==schedule && selectScheduleOptionISh!=='')setInputChanges(true);
    };

    const handleInputEmailISh = (e) => {
        const texto = e.target.value;
        //const textCleaned = cleanString(texto);
        const textToSaved = cleanText(texto);
        setInputEmailISh(textToSaved)
        texto===email?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(selectOptionHairdresserISh!==hairdresser && selectOptionHairdresserISh!=='')setInputChanges(true);
        if(inputFirstNameISh!==first_name && inputFirstNameISh!=='')setInputChanges(true);
        if(inputLastNameISh!==last_name && inputLastNameISh!=='')setInputChanges(true);
        if(inputServiceISh!==service && inputServiceISh!=='')setInputChanges(true);
        if(adjustedItemDate.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
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
        if(adjustedItemDate.getTime() != adjustedNewDatee.getTime()) {
            setInputChanges(true);
        }
    };

    const handleInputAddScheduleHISh = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputAddScheduleHISh(inputValue);
        }
    };

    const handleInputAddScheduleMISh = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputAddScheduleMISh(inputValue);
        }
    };

    const handleOnBlurInputAddScheduleHShLM = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            if(inputValue.length == 1){
                setInputAddScheduleHISh(`0${inputValue}`);
            } else {
                setInputAddScheduleHISh(inputValue);
            }
        }
    };

    const handleOnBlurInputAddScheduleMShLM = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            if(inputValue.length == 1){
                setInputAddScheduleMISh(`0${inputValue}`);
            } else {
                setInputAddScheduleMISh(inputValue);
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
        handleConfirmationDelShiftsModal(true);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdShift = async() => {
        if( (inputFirstNameISh == '' || inputFirstNameISh == first_name) && (selectOptionHairdresserISh == '' || selectOptionHairdresserISh == hairdresser) && (inputLastNameISh == '' || inputLastNameISh == last_name) && (inputServiceISh == '' || inputServiceISh == service) && (inputEmailISh == '' || inputEmailISh == email) && (formatInputDate == '' || formatInputDate == date) && (selectScheduleOptionISh == '' || selectScheduleOptionISh == schedule) ) {
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
        } else if(isAddScheduleISh && (!inputAddScheduleHISh || !inputAddScheduleMISh)) {
            toast('Debes ingresar un horario!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(!existsUniqueHairdresserSchedules){
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
        } else if (concatNewDateSchedule.getDay() == 0 || concatNewDateSchedule.getDay() == 1) {
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
                schedule: !isAddScheduleISh?(selectScheduleOptionISh?selectScheduleOptionISh:schedule):concatAddSchedules
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
                    handleUpdateShiftModalLocal(false);
                    handleUpdateShiftModal(false);
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
                    handleConfirmationDelShiftsModal(false);
                    handleUpdateShiftModal(false);
                    handleUpdateShiftModalLocal(false);
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
                <div className='confirmationDeleteBtnShiftListModalContainer'>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>¿Estás seguro que deseas borrar el turno?</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>borrar el turno?</div>
                    </div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelShift} className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns__prop'>Si</button>
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

    const closeM = () => {
        handleUpdateShiftModal(false);
        handleUpdateShiftModalLocal(false);
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

    const addSchedule = () => {
        if(isAddScheduleISh){
            setIsAddScheduleISh(false)
            if(selectScheduleOptionISh == optionsScheduleSh[0]) {
                setInputChanges(false)
            }
        } else {
            setIsAddScheduleISh(true)
            setInputChanges(true)
        }
    };

    return (
    <>
        <div className='shiftModalContainer'>
            <div className='shiftModalContainer__btnCloseModal'>
                {
                    !confirmationDelShiftsModal&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='shiftModalContainer__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='shiftModalContainer__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div> 
            <div className='shiftModalContainer__header'>
                <div className='shiftModalContainer__header__label'>Peluquero</div>
                <div className='shiftModalContainer__header__label'>Fecha</div>
                <div className='shiftModalContainer__header__label'>Horario</div>
                <div className='shiftModalContainer__header__label'>Nombre</div>
                <div className='shiftModalContainer__header__label'>Apellido</div>
                <div className='shiftModalContainer__header__label'>Servicio</div>
                <div className='shiftModalContainer__header__label'>Email</div>
            </div>
            <div className='shiftModalContainer__itemShift'>
                {
                    !confirmationDelShiftsModal?
                    <>
                        <div className='shiftModalContainer__itemShift__selectService'>
                            <select className='shiftModalContainer__itemShift__selectService__select' value={selectOptionHairdresserISh} onChange={(e) => {handleSelectOptionHairdresserISh(e.target.value)}}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='shiftModalContainer__itemShift__input'>
                            <DatePicker className='datePikerShiftsList'
                                selected={inputDateISh}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>
                        <div className='shiftModalContainer__itemShift__selectSchedule'>
                            {
                                !isAddScheduleISh?
                                <select className='shiftModalContainer__itemShift__selectSchedule__select' value={selectScheduleOptionISh} onChange={handleSelectScheduleOptionISh}>
                                    {optionsScheduleISh.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                :
                                <>
                                    <input maxLength={2} className='shiftModalContainer__itemShift__selectSchedule__inputAddSchedule' type="text" value={inputAddScheduleHISh} onBlur={handleOnBlurInputAddScheduleHShLM} onChange={handleInputAddScheduleHISh} />
                                    :
                                    <input maxLength={2} className='shiftModalContainer__itemShift__selectSchedule__inputAddSchedule' type="text" value={inputAddScheduleMISh} onBlur={handleOnBlurInputAddScheduleMShLM} onChange={handleInputAddScheduleMISh} />
                                </>
                            }
                            <button className='shiftModalContainer__itemShift__selectSchedule__btn' onClick={addSchedule}>+</button>
                        </div>
                        <div className='shiftModalContainer__itemShift__input'>
                            <input className='shiftModalContainer__itemShift__input__prop' value={!inputFirstNameISh?first_name:inputFirstNameISh}onChange={handleInputFirstNameISh}/>
                        </div>
                        <div className='shiftModalContainer__itemShift__input'>
                            <input className='shiftModalContainer__itemShift__input__prop' value={!inputLastNameISh?last_name:inputLastNameISh}onChange={handleInputLastNameISh}/>
                        </div>
                        <div className='shiftModalContainer__itemShift__selectService'>
                            <select className='shiftModalContainer__itemShift__selectService__select' value={inputServiceISh} onChange={(e) => {handleSelectServiceISh(e.target.value)}}>
                                {optionsService.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='shiftModalContainer__itemShift__input'>
                            <input className='shiftModalContainer__itemShift__input__prop' type='email' value={!inputEmailISh?(email?email:'-'):inputEmailISh}onChange={handleInputEmailISh}/>
                        </div>
                        <div className='shiftModalContainer__itemShift__btns'>
                            <button className='shiftModalContainer__itemShift__btns__btn' onClick={handleBtnDelShift}>Borrar</button>
                            <button id='btnUpdateShift' className='shiftModalContainer__itemShift__btns__btn' onClick={handleBtnUpdShift}>Actualizar</button>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </>
                    :
                    <>
                        <div className='shiftModalContainer__itemShift__selectService'>
                            <select disabled className='shiftModalContainer__itemShift__selectService__select' value={selectOptionHairdresserISh} onChange={(e) => {handleSelectOptionHairdresserISh(e.target.value)}}>
                                {optionsHairdresser.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='shiftModalContainer__itemShift__input'>
                            <DatePicker className='datePikerShiftsList'
                                selected={inputDateISh}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                                disabled
                            />
                        </div>
                        <div className='shiftModalContainer__itemShift__selectSchedule'>
                                <select disabled className='shiftModalContainer__itemShift__selectSchedule__select' value={selectScheduleOptionISh} onChange={(e) => {handleSelectScheduleOptionISh(e.target.value)}}>
                                {optionsScheduleISh.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='shiftModalContainer__itemShift__input'>
                            <input disabled className='shiftModalContainer__itemShift__input__prop' value={!inputFirstNameISh?first_name:inputFirstNameISh}onChange={handleInputFirstNameISh}/>
                        </div>
                        <div className='shiftModalContainer__itemShift__input'>
                            <input disabled className='shiftModalContainer__itemShift__input__prop' value={!inputLastNameISh?last_name:inputLastNameISh}onChange={handleInputLastNameISh}/>
                        </div>
                        <div className='shiftModalContainer__itemShift__selectService'>
                            <select disabled className='shiftModalContainer__itemShift__selectService__select' value={inputServiceISh} onChange={(e) => {handleSelectServiceISh(e.target.value)}}>
                                {optionsService.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className='shiftModalContainer__itemShift__input'>
                            <input disabled className='shiftModalContainer__itemShift__input__prop' value={!inputEmailISh?(email?email:'-'):inputEmailISh}onChange={handleInputEmailISh}/>
                        </div>
                        <div className='shiftModalContainer__itemShift__btns'>
                            <button onClick={handleBtnDelShift} className='shiftModalContainer__itemShift__btns__btn'>Borrar</button>
                            <button disabled id='btnUpdateShift' style={buttonDisabledStyle} className='shiftModalContainer__itemShift__btns__btn'>Actualizar</button>
                        </div>
                    </>
                }
            </div>
            {
                confirmationDelShiftsModal&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
    )
}

export default ShiftsListModal
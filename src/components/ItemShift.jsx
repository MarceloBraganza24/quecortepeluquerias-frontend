import React, { useContext, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import ShiftsListModal from './ShiftsListModal';
import {OpenModalContext} from '../context/OpenModalContext'; 
import ShiftsListModalMobile from './ShiftsListModalMobile';
import Spinner from './Spinner';
import { toast } from "react-toastify";

const ItemShift = ({id,hairdresser,first_name,last_name,service,email,date,schedule,shifts,hairdressers,services,workDays,holidays}) => {

    const scheduleArray = schedule.split(':')
    let scheduleH = scheduleArray[0];
    let scheduleM = scheduleArray[1];

    const {updateShiftModal,handleUpdateShiftModal,createShiftModalMobile,updateShiftModalMobile,handleUpdateShiftModalMobile,cancelShiftModal,cancelDayModal,recoverShiftModal,handleRecoverShiftModal,cancelDaysListModal} = useContext(OpenModalContext);
    const [updateShiftModalLocal, handleUpdateShiftModalLocal] = useState(false);
    const [recoverShiftModalLocal, handleRecoverShiftModalLocal] = useState(false);
    const [updateShiftModalMobileLocal, handleUpdateShiftModalMobileLocal] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleBtnUpdShift = () => {
        handleUpdateShiftModal(true);
        handleUpdateShiftModalLocal(true);
    };
    
    const handleBtnUpdShiftMobile = () => {
        handleUpdateShiftModalMobile(true);
        handleUpdateShiftModalMobileLocal(true);
    };

    const handleBtnRecoverShift = () => {
        handleRecoverShiftModal(true);
        handleRecoverShiftModalLocal(true);
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer'
    };

    const RecoverShiftModal = ({date,schedule}) => {

        const handleBtnRecoverShift = async() => {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/shifts/${id}`, {
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(response.ok) {
                toast('Has recuperado el turno correctamente!', {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    handleRecoverShiftModal(false);
                    handleRecoverShiftModalLocal(false);
                    setShowSpinner(false)
                }, 1000);
            } else {
                toast('Has ocurrido un error al querer recuperar el turno!', {
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
        }

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleRecoverShiftModalLocal(false)
            handleRecoverShiftModal(false)
        }

      return (
        <>
                <div className='confirmationDeleteBtnShiftListModalContainer'>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>¿Estás seguro que deseas recuperar el turno</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__ask'>con fecha {date} {schedule} de {hairdresser}?</div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'>¿Estás seguro que deseas recuperar el turno con fecha {date} {schedule} de {hairdresser}?</div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__askMobile__ask'></div>
                    </div>
                    <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnRecoverShift} className='confirmationDeleteBtnShiftListModalContainer__btnsContainer__btns__prop'>Si</button>
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
        <div className='itemShiftMobile'>
            <div className='itemShiftMobile__input no-scroll'>
                <div className='itemShiftMobile__input__propDate'>{date}</div>
            </div>
            <div className='itemShiftMobile__inputSchedule'>
                <div className='itemShiftMobile__inputSchedule__prop'>{`${scheduleH}:${scheduleM}`}</div>
            </div>
            <div className='itemShiftMobile__input no-scroll'>
                <div className='itemShiftMobile__input__prop'>{first_name}</div>
            </div>
            <div className='itemShiftMobile__input no-scroll'>
                <div className='itemShiftMobile__input__prop'>{last_name}</div>
            </div>
            {
                !updateShiftModalMobile&&!createShiftModalMobile&&!cancelDayModal&&!cancelDaysListModal?
                <>
                    <div className='itemShiftMobile__btns'>
                        {
                            first_name=='-' && last_name=='-' && email=='-' ?
                            <button className='itemShiftMobile__btns__btn' onClick={handleBtnRecoverShift}>←</button>
                            :
                            <button className='itemShiftMobile__btns__btn' onClick={handleBtnUpdShiftMobile}>+</button>
                        }
                    </div>
                </>
                :
                <div className='itemShiftMobile__btns'>
                    {
                        first_name=='-' && last_name=='-' && email=='-' ?
                        <button className='itemShiftMobile__btns__btn'>←</button>
                        :
                        <button disabled style={buttonDisabledStyle} className='itemShiftMobile__btns__btn'>+</button>
                    }
                </div>
            }
            {
                updateShiftModalMobileLocal&&
                    <ShiftsListModalMobile
                    handleUpdateShiftModalMobileLocal={handleUpdateShiftModalMobileLocal}
                    updateShiftModalMobileLocal={updateShiftModalMobileLocal}
                    id={id}
                    first_name={first_name}
                    hairdresser={hairdresser}
                    last_name={last_name}
                    service={service}
                    email={email}
                    date={date}
                    schedule={schedule}
                    shifts={shifts}
                    hairdressers={hairdressers}
                    services={services}
                    workDays={workDays}
                    holidays={holidays}
                    />
            }
        </div>
        <div className='itemShift'>
            <div className='itemShift__input'>
                <div className='itemShift__input__prop'>-</div>
            </div>
            <div className='itemShift__input'>
                <div className='itemShift__input__prop'>{date}</div>
            </div>
            <div className='itemShift__inputSchedule'>
                <div className='itemShift__inputSchedule__prop'>{scheduleH}</div>
                <div>:</div>
                <div className='itemShift__inputSchedule__prop'>{scheduleM}</div>
            </div>
            <div className='itemShift__input no-scroll'>
                <div className='itemShift__input__prop'>{first_name}</div>
            </div>
            <div className='itemShift__input no-scroll'>
                <div className='itemShift__input__prop'>{last_name}</div>
            </div>
            <div className='itemShift__input no-scroll'>
                <div className='itemShift__input__prop'>{service?service:'-'}</div>
            </div>
            <div className='itemShift__input no-scroll'>
                <div className='itemShift__input__prop'>{email?email:'-'}</div>
            </div>
            {
                !updateShiftModal&&!cancelShiftModal&&!recoverShiftModal&&!cancelDayModal&&!cancelDaysListModal?
                    first_name=='-' && last_name=='-' && email=='-' ?
                        <div className='itemShift__btns'>
                            <button className='itemShift__btns__btn' onClick={handleBtnRecoverShift}>Recuperar</button>
                        </div>
                    :
                        <div className='itemShift__btns'>
                            <button className='itemShift__btns__btn' onClick={handleBtnUpdShift}>Editar</button>
                        </div>

                :
                    first_name=='-' && last_name=='-' && email=='-' ?
                        <div className='itemShift__btns'>
                            <button disabled style={buttonDisabledStyle} className='itemShift__btns__btn'>Recuperar</button>
                        </div>
                    :
                        <div className='itemShift__btns'>
                            <button disabled style={buttonDisabledStyle} className='itemShift__btns__btn'>Editar</button>
                        </div>
            }
        </div>
        {recoverShiftModalLocal&&<RecoverShiftModal date={date} schedule={schedule}/>}
        {
            updateShiftModalLocal&&
                <ShiftsListModal
                handleUpdateShiftModalLocal={handleUpdateShiftModalLocal}
                updateShiftModalLocal={updateShiftModalLocal}
                id={id}
                first_name={first_name}
                hairdresser={hairdresser}
                last_name={last_name}
                service={service}
                email={email}
                date={date}
                schedule={schedule}
                shifts={shifts}
                hairdressers={hairdressers}
                services={services}
                workDays={workDays}
                holidays={holidays}
                />
        }
    </>
  )
}

export default ItemShift

     
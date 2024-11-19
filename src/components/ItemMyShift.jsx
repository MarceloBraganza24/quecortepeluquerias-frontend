import React, { useContext, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css';
import MyShiftListModal from './MyShiftListModal';
import {OpenModalContext} from '../context/OpenModalContext'; 
import MyShiftListModalMobile from './MyShiftListModalMobile';

const ItemMyShift = ({id,hairdresser,first_name,last_name,service,email,date,schedule,shifts,holidaysData}) => {
    
    const scheduleArray = schedule.split(':')
    let scheduleH = scheduleArray[0];
    let scheduleM = scheduleArray[1];

    const {updateMyShiftModal,handleUpdateMyShiftModal,updateMyShiftModalMobile,handleUpdateMyShiftModalMobile} = useContext(OpenModalContext);
    const [updateMyShiftModalLocal, handleUpdateMyShiftModalLocal] = useState(false);
    const [updateMyShiftModalMobileLocal, handleUpdateMyShiftModalMobileLocal] = useState(false);

    const handleBtnUpdShift = () => {
        handleUpdateMyShiftModal(true);
        handleUpdateMyShiftModalLocal(true);
    };

    const handleBtnUpdMyShiftMobile = () => {
        handleUpdateMyShiftModalMobile(true);
        handleUpdateMyShiftModalMobileLocal(true);
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };

  return (
    <>
        <div className='itemMyShiftMobile'>
            <div className='itemMyShiftMobile__input no-scroll'>
                <div className='itemMyShiftMobile__input__propDate'>{date}</div>
            </div>
            <div className='itemMyShiftMobile__inputSchedule'>
                <div className='itemMyShiftMobile__inputSchedule__prop'>{`${scheduleH}:${scheduleM}`}</div>
            </div>
            <div className='itemMyShiftMobile__input no-scroll'>
                <div className='itemMyShiftMobile__input__prop'>{first_name}</div>
            </div>
            <div className='itemMyShiftMobile__input no-scroll'>
                <div className='itemMyShiftMobile__input__prop'>{last_name}</div>
            </div>
            {
                !updateMyShiftModalMobile?
                <div className='itemMyShiftMobile__btns'>
                    <button className='itemMyShiftMobile__btns__btn' onClick={handleBtnUpdMyShiftMobile}>+</button>
                </div>
                :
                <div className='itemMyShiftMobile__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemMyShiftMobile__btns__btn'>+</button>
                </div>
            }
            {
                updateMyShiftModalMobileLocal&&
                    <MyShiftListModalMobile
                    handleUpdateMyShiftModalMobileLocal={handleUpdateMyShiftModalMobileLocal}
                    id={id}
                    first_name={first_name}
                    hairdresser={hairdresser}
                    last_name={last_name}
                    service={service}
                    email={email}
                    date={date}
                    schedule={schedule}
                    shifts={shifts}
                    holidaysData={holidaysData}
                    />
                }
        </div>
        <div className='itemMyShift'>
            <div className='itemMyShift__input no-scroll'>
                <div className='itemMyShift__input__prop'>{first_name}</div>
            </div>
            <div className='itemMyShift__input no-scroll'>
                <div className='itemMyShift__input__prop'>{last_name}</div>
            </div>
            <div className='itemMyShift__input no-scroll'>
                <div className='itemMyShift__input__prop'>{email}</div>
            </div>
            <div className='itemMyShift__input no-scroll'>
                <div className='itemMyShift__input__prop'>{hairdresser}</div>
            </div>
            <div className='itemMyShift__input no-scroll'>
                <div className='itemMyShift__input__prop'>{service?service:'-'}</div>
            </div>
            <div className='itemMyShift__input'>
                <div className='itemMyShift__input__prop'>{date}</div>
            </div>
            <div className='itemMyShift__inputSchedule'>
                <div className='itemMyShift__inputSchedule__prop'>{scheduleH}</div>
                <div>:</div>
                <div className='itemMyShift__inputSchedule__prop'>{scheduleM}</div>
            </div>
            {
                !updateMyShiftModal?
                <div className='itemMyShift__btns'>
                    <button className='itemMyShift__btns__btn' onClick={handleBtnUpdShift}>Editar</button>
                </div>
                :
                <div className='itemMyShift__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemMyShift__btns__btn'>Editar</button>
                </div>
            }
        </div>
        {
            updateMyShiftModalLocal&&
            <MyShiftListModal
                handleUpdateMyShiftModalLocal={handleUpdateMyShiftModalLocal}
                id={id}
                hairdresser={hairdresser}
                first_name={first_name}
                last_name={last_name}
                service={service}
                email={email}
                date={date}
                schedule={schedule}
                shifts={shifts}
                holidaysData={holidaysData}
                />
        }
    </>
  )
}

export default ItemMyShift

     
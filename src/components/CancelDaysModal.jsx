import React, { useState,useContext } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext';

const CancelDaysModal = ({handleCancelDaysListModalLocal,holidaysData,hairdressers}) => {
    const [deleteCancelDaysModalLocal, handleDeleteCancelDaysModalLocal] = useState(false);
    const {handleCancelDaysListModal} = useContext(OpenModalContext);
    const [id, setId] = useState('');
    const [hairdresser, setHairdresser] = useState('');
    const [date, setDate] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    const closeM = () => {
        handleCancelDaysListModalLocal(false);
        handleCancelDaysListModal(false);
    }
    
    const DeleteCancelDaysModal = ({id,handleDeleteCancelDaysModalLocal,hairdresser,date}) => {

        const handleBtnDeleteCancelDayYes = async() => {
            setShowSpinner(true)
            const response = await fetch(`${apiUrl}/api/holidays/${id}`, {
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if(response.ok) {
                toast('Has eliminado el día anulado correctamente!', {
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
                    handleDeleteCancelDaysModalLocal(false);
                    setShowSpinner(false)
                }, 2000);
            } else {
                toast('Has ocurrido un error al querer eliminar el día anulado!', {
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

        const handleBtnDeleteCancelDayNo = () => {
            handleDeleteCancelDaysModalLocal(false);
        }
      return (
          <>
            <div className='confirmationDeleteBtnCancelDaysModalContainer'>
                <div className='confirmationDeleteBtnCancelDaysModalContainer__ask'>¿Estás seguro que deseas borrar el día anulado {date} de {hairdresser}</div>
                <div className='confirmationDeleteBtnCancelDaysModalContainer__askMobile'>
                    <div className='confirmationDeleteBtnCancelDaysModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar el día anulado</div>
                </div>
                <div className='confirmationDeleteBtnCancelDaysModalContainer__btnsContainer'>
                    <div className='confirmationDeleteBtnCancelDaysModalContainer__btnsContainer__btns'>
                        <div></div>
                    </div>
                    <div className='confirmationDeleteBtnCancelDaysModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnDeleteCancelDayYes} className='confirmationDeleteBtnCancelDaysModalContainer__btnsContainer__btns__prop'>Si</button>
                    </div>
                    <div className='confirmationDeleteBtnCancelDaysModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnDeleteCancelDayNo} className='confirmationDeleteBtnCancelDaysModalContainer__btnsContainer__btns__prop'>No</button>
                    </div>
                    <div className='confirmationDeleteBtnCancelDaysModalContainer__btnsContainer__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </div>
            </div>
        </>
      )
    }
    
    const handleBtnDeleteCancelDay = (id,hairdresser,date) => {
        handleDeleteCancelDaysModalLocal(true);
        setId(id)
        setHairdresser(hairdresser)
        setDate(date)
    }

    return (
        <>
                <div className='cancelDaysModalContainer'>
                    <div className='cancelDaysModalContainer__btnCloseModal'>
                        <Link onClick={closeM} className='cancelDaysModalContainer__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </div>
                    <div className='cancelDaysModalContainer__title'>- Días anulados -</div>
                    <div className='cancelDaysModalContainer__cancelDaysList__header'>
                        <div className='cancelDaysModalContainer__cancelDaysList__header__prop'>Peluquero</div>
                        <div className='cancelDaysModalContainer__cancelDaysList__header__prop'>Fecha anulada</div>
                    </div>
                    <div className='cancelDaysModalContainer__cancelDaysList'>
                        {
                            hairdressers.length != 0?
                            hairdressers.map((hairdresser) => {
                                const holidayByHairdresser = holidaysData.filter(holiday => holiday.hairdresser == hairdresser.name)
                                holidayByHairdresser.sort((a, b) => {
                                    return new Date(b.date) - new Date(a.date);
                                });
                                return(
                                    <>
                                        <div className='cancelDaysModalContainer__cancelDaysList__hairdresser'>{hairdresser.name}</div>

                                        {
                                            holidayByHairdresser.length != 0?
                                                holidayByHairdresser.map((holiday) => {
                                                    return(
                                                        <>
                                                            <div className='cancelDaysModalContainer__cancelDaysList__itemCancelDay'>
                                                                <div className='cancelDaysModalContainer__cancelDaysList__itemCancelDay__prop'>{holiday.hairdresser}</div>
                                                                <div className='cancelDaysModalContainer__cancelDaysList__itemCancelDay__prop'>{holiday.date}</div>
                                                                <div className='cancelDaysModalContainer__cancelDaysList__itemCancelDay__btn'>
                                                                    {
                                                                        !deleteCancelDaysModalLocal?
                                                                        <button onClick={()=>handleBtnDeleteCancelDay(holiday._id,holiday.hairdresser,holiday.date)} className='cancelDaysModalContainer__cancelDaysList__itemCancelDay__btn__prop'>Eliminar</button>
                                                                        :
                                                                        <button className='cancelDaysModalContainer__cancelDaysList__itemCancelDay__btn__prop'>Eliminar</button>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                })
                                            :
                                                <div className='cancelDaysModalContainer__cancelDaysList__nonDates'>Aún no hay fechas guardadas</div>
                                        }
                                    </>
                                )
                            })
                            :
                            <div className='cancelDaysModalContainer__cancelDaysList__nonDates'>Aún no hay fechas guardadas</div>
                        }
                    </div>
                </div>
                    {deleteCancelDaysModalLocal&&<DeleteCancelDaysModal handleDeleteCancelDaysModalLocal={handleDeleteCancelDaysModalLocal} id={id} hairdresser={hairdresser} date={date}/>}
            </>
      )
}

export default CancelDaysModal
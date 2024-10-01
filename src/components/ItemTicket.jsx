import React, { useState,useEffect, useContext } from 'react'
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import {OpenModalContext} from '../context/OpenModalContext';

import { format } from 'date-fns';

const ItemTicket = ({id,title,payMethod,unit_price,first_name,last_name,email,ticket_datetime}) => {
    const {deleteTicketModal,handleDeleteTicketModal} = useContext(OpenModalContext);
    const [showSpinner, setShowSpinner] = useState(false);
    const [confirmationDelTicketModal, handleConfirmationDelTicketModal] = useState(false);
    const [confirmationDelTicketModalMobile, handleConfirmationDelTicketModalMobile] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [month, setMonth] = useState('');

    const ticket_datetime_formated = format(ticket_datetime, 'yyyy-MM-dd');

    const fechaActual = new Date();
    const anoActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth()+1;
    const diaActual = fechaActual.getDate();
    
    const date_ticket = new Date(ticket_datetime);
    const anoActualTicket = date_ticket.getFullYear();
    const mesActualTicket = date_ticket.getMonth()+1;

    // console.log(mesActualTicket)
    // console.log(ticketsByTypeByEmail.map(ticket => ticket.ticket_datetime))
    

    useEffect(() => {
        
        // const ticketRepetidos = ticketsByTypeByEmail.map(ticket => ticket.ticket_datetime)
        // console.log(ticketRepetidos)

        /* mesActualTicket&&ticketsByTypeByEmail.forEach(ticket => {
            const ticketDate = new Date(ticket.ticket_datetime);
            const yearTicket = ticketDate.getFullYear();
            const monthTicket = ticketDate.getMonth()+1;
            const dayTicket = ticketDate.getDate();
            const horasTicket = ticketDate.getHours();
            const minutosTicket = ticketDate.getMinutes();
            const segundosTicket = ticketDate.getSeconds();

            const exists = ticketsByTypeByEmail.find(ticket => {
                const ticketDate = new Date(ticket.ticket_datetime);
            })
            if(ticketDate > fechaActual) {
                //console.log(ticketDate)
            }
            //const fechaCompletaTicket = `${yearTicket}${monthTicket}+dayTicket+horasTicket+minutosTicket+segundosTicket`
            //const fechaCompletaTicket = `${yearTicket} ${monthTicket} ${dayTicket} ${horasTicket} ${minutosTicket} ${segundosTicket}`
            // console.log(ticketDate)
            // console.log(' ')
            // console.log(fechaActual)
            // console.log(yearTicket,monthTicket,dayTicket,horasTicket,minutosTicket,segundosTicket)
        }) */

        /* const ticket_datetime_array = ticketsByTypeByEmail.map(ticket => {
            const ticketDate = new Date(ticket.ticket_datetime);
            const yearTicket = ticketDate.getFullYear();
            const monthTicket = ticketDate.getMonth()+1;
            if(monthTicket==mesActual)return ticketDate
        })
        //console.log(ticket_datetime_array)
        
        //console.log(ticket_datetime)
        
        const fechaMasBaja = ticket_datetime_array.reduce((fechaMenor, fechaActual) => {
            return fechaActual < fechaMenor ? fechaActual : fechaMenor;
        });
        
        //const fechaMasBaja_formated = format(fechaMasBaja, 'yyyy-MM-dd HH:MM');
        ticket_datetime_array.sort((a, b) => a.ticket_datetime - b.ticket_datetime);
        if(mesActualTicket == mesActual) {
            //console.log(fechaMasBaja.getMonth()+1)
            console.log(ticket_datetime_array)
        } */
        


            
        

        //mesActualTicket&&(mesActualTicket==mesActual)&&handleBtnPayMembershipFee(false);
        //mesActualTicket&&(anoActualTicket==anoActual && mesActualTicket==mesActual)&&handleBtnPayMembershipFee(false);
        /* if(mesActualTicket && anoActualTicket==anoActual && mesActualTicket==mesActual) {
            handleBtnPayMembershipFee(false);
        } */
        //console.log(añoActual,mesActual,diaActual)

        
        //mesActualTicket&&mesActualTicket==mesActual&&handleBtnPayMembershipFee(false);
        mesActualTicket&&mesActualTicket=='1'&&setMonth('Enero');
        mesActualTicket&&mesActualTicket=='2'&&setMonth('Febrero');
        mesActualTicket&&mesActualTicket=='3'&&setMonth('Marzo');
        mesActualTicket&&mesActualTicket=='4'&&setMonth('Abril');
        mesActualTicket&&mesActualTicket=='5'&&setMonth('Mayo');
        mesActualTicket&&mesActualTicket=='6'&&setMonth('Junio');
        mesActualTicket&&mesActualTicket=='7'&&setMonth('Julio');
        mesActualTicket&&mesActualTicket=='8'&&setMonth('Agosto');
        mesActualTicket&&mesActualTicket=='9'&&setMonth('Septiembre');
        mesActualTicket&&mesActualTicket=='10'&&setMonth('Octubre');
        mesActualTicket&&mesActualTicket=='11'&&setMonth('Noviembre');
        mesActualTicket&&mesActualTicket=='12'&&setMonth('Diciembre');
    },[mesActualTicket])

    // console.log(mesActual + 1)

    // console.log(date_ticket)
    // console.log(mesActualTicket + 1)
    //console.log(mesActual + 1)

    const handleBtnDeleteTicket = () => {
        handleConfirmationDelTicketModal(true);
        handleDeleteTicketModal(true);
    };

    const handleBtnDeleteTicketMobile = () => {
        handleConfirmationDelTicketModalMobile(true);
        handleDeleteTicketModal(true);
    };

    const handleBtnCannotDelete = () => {
        toast(`No se puede borrar el ticket con el mes actual`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    const ConfirmationDeleteModal = ({ticket_datetime_formated}) => {

        const handleBtnDelTicket = async() => {
        setShowSpinner(true);
        const response = await fetch(`${apiUrl}/api/tickets/${id}`, {
            method: 'DELETE'
        })
        if(response.ok) {
            toast(`Has borrado el ticket de ${title} de ${email} correctamente!`, {
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
                handleConfirmationDelTicketModal(false);
                handleDeleteTicketModal(false);
            }, 1500);
        }
    };
    

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelTicketModal(false);
            handleDeleteTicketModal(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnMyPaymentsListModalContainer'>
                    <div className='confirmationDeleteBtnMyPaymentsListModalContainer__ask'>¿Estás seguro que deseas borrar el ticket</div>
                    <div className='confirmationDeleteBtnMyPaymentsListModalContainer__ask'>con fecha de pago {ticket_datetime_formated}?</div>
                    <div className='confirmationDeleteBtnMyPaymentsListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnMyPaymentsListModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar</div>
                        <div className='confirmationDeleteBtnMyPaymentsListModalContainer__askMobile__ask'>el ticket con fecha de pago</div>
                        <div className='confirmationDeleteBtnMyPaymentsListModalContainer__askMobile__ask'>{ticket_datetime_formated}?</div>
                    </div>
                    <div className='confirmationDeleteBtnMyPaymentsListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnMyPaymentsListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnMyPaymentsListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelTicket} className='confirmationDeleteBtnMyPaymentsListModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnMyPaymentsListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnMyPaymentsListModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnMyPaymentsListModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const ConfirmationDeleteModalMobile = ({ticket_datetime_formated}) => {

        const handleBtnDelTicket = async() => {
        setShowSpinner(true);
        const response = await fetch(`${apiUrl}/api/tickets/${id}`, {
            method: 'DELETE'
        })
        if(response.ok) {
            toast(`Has borrado el ticket de ${title} de ${email} correctamente!`, {
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
                handleConfirmationDelTicketModalMobile(false);
                handleDeleteTicketModal(false);
            }, 1500);
        }
    };
    

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelTicketModalMobile(false);
            handleDeleteTicketModal(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnTicketsListModalContainerMobile'>
                    <div className='confirmationDeleteBtnTicketsListModalContainerMobile__ask'>¿Estás seguro que deseas borrar el ticket</div>
                    <div className='confirmationDeleteBtnTicketsListModalContainerMobile__ask'>con fecha de pago {ticket_datetime_formated}?</div>
                    <div className='confirmationDeleteBtnTicketsListModalContainerMobile__askMobile'>
                        <div className='confirmationDeleteBtnTicketsListModalContainerMobile__askMobile__ask'>¿Estás seguro que deseas borrar</div>
                        <div className='confirmationDeleteBtnTicketsListModalContainerMobile__askMobile__ask'>el ticket con fecha de pago</div>
                        <div className='confirmationDeleteBtnTicketsListModalContainerMobile__askMobile__ask'>{ticket_datetime_formated}?</div>
                    </div>
                    <div className='confirmationDeleteBtnTicketsListModalContainerMobile__btnsContainer'>
                        <div className='confirmationDeleteBtnTicketsListModalContainerMobile__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnTicketsListModalContainerMobile__btnsContainer__btns'>
                            <button onClick={handleBtnDelTicket} className='confirmationDeleteBtnTicketsListModalContainerMobile__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnTicketsListModalContainerMobile__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnTicketsListModalContainerMobile__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnTicketsListModalContainerMobile__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };

  return (
    <>
    
    <div className='itemMyPaymentMobile'>
            <div className='itemMyPaymentMobile__input no-scroll'>
                <div className='itemMyPaymentMobile__input__prop'>{title}</div>
            </div>
            <div className='itemMyPaymentMobile__input no-scroll'>
                <div className='itemMyPaymentMobile__input__prop'>{payMethod}</div>
            </div>
            <div className='itemMyPaymentMobile__input no-scroll'>
                <div className='itemMyPaymentMobile__input__prop'>$ {unit_price}</div>
            </div>
            <div className='itemMyPaymentMobile__input no-scroll'>
                <div className='itemMyPaymentMobile__input__prop'>{ticket_datetime_formated}</div>
            </div>
            {
                !deleteTicketModal&&(mesActual!=mesActualTicket)?
                <div className='itemMyPaymentMobile__btns'>
                    <button className='itemMyPaymentMobile__btns__btn' onClick={handleBtnDeleteTicketMobile}>Borrar</button>
                </div>
                :
                deleteTicketModal?
                <div className='itemMyPaymentMobile__btns'>
                    <button style={buttonDisabledStyle} className='itemMyPaymentMobile__btns__btn'>Borrar</button>
                </div>
                :
                <div className='itemMyPaymentMobile__btns'>
                    <button style={buttonDisabledStyle} className='itemMyPaymentMobile__btns__btn' onClick={handleBtnCannotDelete}>Borrar</button>
                </div>
            }
            {
                confirmationDelTicketModalMobile&&<ConfirmationDeleteModalMobile ticket_datetime_formated={ticket_datetime_formated}/>
            }
        </div>


        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment'>
            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input no-scroll'>
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input__prop'>{title}</div>
            </div>
            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input no-scroll'>
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input__prop'>{payMethod}</div>
            </div>
            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input'>
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input__prop'>$ {unit_price}</div>
            </div>
            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input no-scroll'>
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input__prop'>{first_name}</div>
            </div>
            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input no-scroll'>
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input__prop'>{last_name}</div>
            </div>
            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input no-scroll'>
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input__prop'>{email}</div>
            </div>
            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input no-scroll'>
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__input__prop'>{ticket_datetime_formated}</div>
            </div>
            {
                !deleteTicketModal&&(mesActual!=mesActualTicket)?
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__btnLabels'>
                    <button className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__btnLabels__prop' onClick={handleBtnDeleteTicket}>Borrar</button>
                </div>
                :
                deleteTicketModal?
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__btnLabels'>
                    <button style={buttonDisabledStyle} className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__btnLabels__prop'>Borrar</button>
                </div>
                :
                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__btnLabels'>
                    <button style={buttonDisabledStyle} onClick={handleBtnCannotDelete} className='myPaymentsContainerIsLoggedIn__myPaymentsList__itemMyPayment__btnLabels__prop'>Borrar</button>
                </div>
            }
            {
                confirmationDelTicketModal&&<ConfirmationDeleteModal ticket_datetime_formated={ticket_datetime_formated}/>
            }
        </div>
    </>
  )
}

export default ItemTicket
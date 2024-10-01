import React, { useContext,useEffect, useState } from 'react'
import PartnersListModal from './PartnersListModal';
import {OpenModalContext} from '../context/OpenModalContext';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import PartnersListModalMobile from './PartnersListModalMobile';

const ItemPartner = ({id,first_name,last_name,partner_number,email,resultCompleteMembershipNumber}) => {

    const {updatePartnerModal,payMembershipFeeModal,handleUpdatePartnerModal,handlePayMembershipFeeModal,createPartnerModalMobile,updatePartnerModalMobile,handleUpdatePartnerModalMobile} = useContext(OpenModalContext);
    const [updatePartnerModalLocal, handleUpdatePartnerModalLocal] = useState(false);
    const [updatePartnerModalMobileLocal, handleUpdatePartnerModalMobileLocal] = useState(false);
    const [payMembershipFeeModalLocal, handlePayMembershipFeeModalLocal] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isMembershipFeePaid, setIsMembershipFeePaid] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const currentDate = new Date();
    const yearCurrentDate = currentDate.getFullYear();
    const monthCurrentDate = currentDate.getMonth() + 1;

    const handleBtnUpdPartner = () => {
        handleUpdatePartnerModal(true);
        handleUpdatePartnerModalLocal(true);
    };

    const handleBtnUpdPartnerMobile = () => {
        handleUpdatePartnerModalMobile(true);
        handleUpdatePartnerModalMobileLocal(true);
    };

    const handleBtnPayMembershipFee = () => {
        handlePayMembershipFeeModal(true);
        handlePayMembershipFeeModalLocal(true);
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };

    const [membershipFeePriceOf, setMembershipFeePriceOf] = useState('');
    const [membershipFeeValuePriceOf, setMembershipFeeValuePriceOf] = useState('');
    const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            async function fetchPricesData() {
                const response = await fetch(`${apiUrl}/api/prices`)
                const pricesAll = await response.json();
                const palabrasABuscar = ["cuota", "socio"];
                const membershipFees = pricesAll.data.find(objeto => 
                    palabrasABuscar.every(palabra => 
                    objeto.title.toLowerCase().includes(palabra.toLowerCase())
                    )
                );
                setMembershipFeePriceOf(membershipFees.title)
                setMembershipFeeValuePriceOf(membershipFees.value)
            }
            fetchPricesData();
            async function fetchTicketsData() {
                const response = await fetch(`${apiUrl}/api/tickets`);
                const ticketsAll = await response.json();
                const ticketsByEmail = ticketsAll.data.filter(ticket => ticket.email == email);
                const tickets_date_time = ticketsByEmail.map(ticket => ticket.ticket_datetime)
                let fechasDate = tickets_date_time.map(fecha => new Date(fecha));
                let fechaMasGrande = new Date(Math.max.apply(null, fechasDate));
                const yearLastTicket = fechaMasGrande.getFullYear();
                const monthLastTicket = String(fechaMasGrande.getMonth() + 1); 
                if(monthLastTicket == monthCurrentDate){
                    setIsMembershipFeePaid(true)
                } else if(yearLastTicket < yearCurrentDate || monthLastTicket < monthCurrentDate){
                    setIsMembershipFeePaid(false)
                } else {
                    setIsMembershipFeePaid(false)
                }
            }
            fetchTicketsData();
        }, 10000);
        return () => {
            clearInterval(interval);
        };
    }, [isMonted]);

    useEffect(() => {
        async function fetchPricesData() {
            const response = await fetch(`${apiUrl}/api/prices`)
            const pricesAll = await response.json();
            const palabrasABuscar = ["cuota", "socio"];
            const membershipFees = pricesAll.data.find(objeto => 
                palabrasABuscar.every(palabra => 
                objeto.title.toLowerCase().includes(palabra.toLowerCase())
                )
            );
            setMembershipFeePriceOf(membershipFees.title)
            setMembershipFeeValuePriceOf(membershipFees.value)
        }
        fetchPricesData();
        async function fetchTicketsData() {
            const response = await fetch(`${apiUrl}/api/tickets`);
            const ticketsAll = await response.json();
            const ticketsByEmail = ticketsAll.data.filter(ticket => ticket.email == email);
            const tickets_date_time = ticketsByEmail.map(ticket => ticket.ticket_datetime)
            let fechasDate = tickets_date_time.map(fecha => new Date(fecha));
            let fechaMasGrande = new Date(Math.max.apply(null, fechasDate));
            const yearLastTicket = fechaMasGrande.getFullYear();
            const monthLastTicket = String(fechaMasGrande.getMonth() + 1); 
            if(monthLastTicket == monthCurrentDate){
                setIsMembershipFeePaid(true)
            } else if(yearLastTicket < yearCurrentDate || monthLastTicket < monthCurrentDate){
                setIsMembershipFeePaid(false)
            } else {
                setIsMembershipFeePaid(false)
            }
        }
        fetchTicketsData();
        setTimeout(() => {
            setIsMonted(true);
        }, 2500)
    }, []);

    const ConfirmationPayMembershipFeeModal = ({email,handlePayMembershipFeeModalLocal}) => {

        const handleConfirmBtnPayMembershipFee = async () => {
            setShowSpinner(true);
            const ticket = {
                type: membershipFeePriceOf,
                unit_price: membershipFeeValuePriceOf,
                payMethod: 'Efectivo/Transferencia',
                first_name: first_name,
                last_name: last_name,
                email: email,
            }
            const response = await fetch(`${apiUrl}/api/tickets`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ticket)
            })
            if(response.ok) {
                toast('Cuota de socio pagada correctamente!', {
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
                    handlePayMembershipFeeModalLocal(false);
                    handlePayMembershipFeeModal(false);
                }, 1500);
            }
        }

        const handleBtnConfirmationPayMembershipFeeBtnNo = () => {
            handlePayMembershipFeeModalLocal(false);
            handlePayMembershipFeeModal(false);
        }

      return (
            <>
                <div className='confirmationPayMembershipFeeModalContainer'>
                    <div className='confirmationPayMembershipFeeModalContainer__ask'>¿Estás seguro que deseas pagar la cuota</div>
                    <div className='confirmationPayMembershipFeeModalContainer__ask'>del socio {email}?</div>
                    <div className='confirmationPayMembershipFeeModalContainer__askMobile'>
                        <div className='confirmationPayMembershipFeeModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationPayMembershipFeeModalContainer__askMobile__ask'>pagar la cuota del socio</div>
                        <div className='confirmationPayMembershipFeeModalContainer__askMobile__ask'>{email}?</div>
                    </div>
                    <div className='confirmationPayMembershipFeeModalContainer__btnsContainer'>
                        <div className='confirmationPayMembershipFeeModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationPayMembershipFeeModalContainer__btnsContainer__btns'>
                            <button onClick={handleConfirmBtnPayMembershipFee} className='confirmationPayMembershipFeeModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationPayMembershipFeeModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationPayMembershipFeeBtnNo} className='confirmationPayMembershipFeeModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationPayMembershipFeeModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }
 
  return (
    <>
        <div className='itemPartnerMobile'>
            <div className='itemPartnerMobile__input no-scroll'>
                <div className='itemPartnerMobile__input__prop'>{partner_number}</div>
            </div>
            <div className='itemPartnerMobile__input no-scroll'>
                <div className='itemPartnerMobile__input__prop'>{first_name}</div>
            </div>
            <div className='itemPartnerMobile__input no-scroll'>
                <div className='itemPartnerMobile__input__prop'>{last_name}</div>
            </div>
            {
                !updatePartnerModalMobile&&!createPartnerModalMobile?
                <>
                    <div className='itemPartnerMobile__btns'>
                        <button className='itemPartnerMobile__btns__btn' onClick={handleBtnUpdPartnerMobile}>+</button>
                        {
                            isMembershipFeePaid?
                            <button style={{backgroundColor:'green',color:'black'}} className='itemPartnerMobile__btns__btn'>✓</button>
                            :
                            <button style={{backgroundColor:'red',color:'black'}} className='itemPartnerMobile__btns__btn'>X</button>
                        }
                    </div>
                </>
                :
                <div className='itemPartnerMobile__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemPartnerMobile__btns__btn'>+</button>
                </div>
            }
            {
                updatePartnerModalMobileLocal&&
                    <PartnersListModalMobile
                    handleUpdatePartnerModalMobileLocal={handleUpdatePartnerModalMobileLocal}
                    resultCompleteMembershipNumber={resultCompleteMembershipNumber}
                    //updateShiftModalMobileLocal={updateShiftModalMobileLocal}
                    id={id}
                    first_name={first_name}
                    last_name={last_name}
                    partner_number={partner_number}
                    email={email}
                    />
            }
        </div>
        <div className='itemPartner'>
            <div className='itemPartner__input'>
                <div className='itemPartner__input__prop'>{partner_number}</div>
            </div>
            <div className='itemPartner__input'>
                <div className='itemPartner__input__prop'>{first_name}</div>
            </div>
            <div className='itemPartner__input'>
                <div className='itemPartner__input__prop'>{last_name}</div>
            </div>
            <div className='itemPartner__input no-scroll'>
                <div className='itemPartner__input__prop'>{email}</div>
            </div>
            {
                !updatePartnerModal&&!payMembershipFeeModal?
                <div className='itemPartner__btns'>
                    <button className='itemPartner__btns__btn' onClick={handleBtnUpdPartner}>Editar</button>
                    {
                        isMembershipFeePaid?
                        <button className='itemPartner__btns__btn' style={{backgroundColor:'green',color:'black'}}>Al día</button>
                        :
                        <button className='itemPartner__btns__btn' style={{backgroundColor:'red',color:'black'}} onClick={handleBtnPayMembershipFee}>Pagar cuota</button>
                    }
                </div>
                :
                <div className='itemPartner__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemPartner__btns__btn' onClick={handleBtnUpdPartner}>Editar</button>
                    {
                        isMembershipFeePaid?
                        <button disabled style={{buttonDisabledStyle,backgroundColor:'green',color:'black'}} className='itemPartner__btns__btn' onClick={handleBtnUpdPartner}>Al día</button>
                        :
                        <button disabled style={{buttonDisabledStyle,backgroundColor:'red',color:'black'}} className='itemPartner__btns__btn' onClick={handleBtnUpdPartner}>Pagar cuota</button>
                    }
                </div>
            }
        </div>
        {
            payMembershipFeeModalLocal && 
            <ConfirmationPayMembershipFeeModal
            handlePayMembershipFeeModalLocal={handlePayMembershipFeeModalLocal}
            email={email}
            />
        }
        {
            updatePartnerModalLocal && 
            <PartnersListModal
            handleUpdatePartnerModalLocal={handleUpdatePartnerModalLocal}
            resultCompleteMembershipNumber={resultCompleteMembershipNumber}
            id={id}
            first_name={first_name}
            last_name={last_name}
            partner_number={partner_number}
            email={email}
            />
        }
    </>
  )
}

export default ItemPartner
import React, { useState, useEffect, useContext } from 'react'
import {OpenModalContext} from '../context/OpenModalContext';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';

const PartnersListModalMobile = ({id,first_name,last_name,partner_number,email,handleUpdatePartnerModalMobileLocal,resultCompleteMembershipNumber,points}) => {
    const [inputFirstNameIPa, setInputFirstNameIPa] = useState('');
    const [inputLastNameIPa, setInputLastNameIPa] = useState('');
    //const [inputPartnerNumberIPa, setInputPartnerNumberIPa] = useState('');
    const [selectOptionMembershipNumber, setSelectOptionMembershipNumberShL] = useState('');
    const [inputEmailIPa, setInputEmailIPa] = useState('');
    const [inputPointsIPa, setInputPointsIPa] = useState('');
    const [confirmationDelPartnersModalMobile, handleConfirmationDelPartnersModalMobile] = useState(false);
    const {handleUpdatePartnerModalMobile,payMembershipFeeModal,handlePayMembershipFeeModal} = useContext(OpenModalContext);
    const [payMembershipFeeModalLocal, handlePayMembershipFeeModalLocal] = useState(false);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const currentDate = new Date();
    const yearCurrentDate = currentDate.getFullYear();
    const monthCurrentDate = currentDate.getMonth() + 1;
    const [isMembershipFeePaid, setIsMembershipFeePaid] = useState(false);
    const optionsMembershipNumber = [];
    optionsMembershipNumber.push(`${partner_number}`)
    resultCompleteMembershipNumber.forEach((element) => {
        optionsMembershipNumber.push(element)
    })
    //console.log(resultCompleteMembershipNumber)

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
    
    const handleInputFirstNameIPa = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputFirstNameIPa(textToSaved)
        }
        texto===first_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputLastNameIPa!==last_name && inputLastNameIPa!=='')setInputChanges(true);
        if(inputEmailIPa!==email && inputEmailIPa!=='')setInputChanges(true);
        if(inputPointsIPa!==points && inputPointsIPa!=='')setInputChanges(true);
    };

    const handleInputLastNameIPa = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputLastNameIPa(textToSaved)
        }
        texto===last_name?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputFirstNameIPa!==first_name && inputFirstNameIPa!=='')setInputChanges(true);
        if(inputEmailIPa!==email && inputEmailIPa!=='')setInputChanges(true);
        if(inputPointsIPa!==points && inputPointsIPa!=='')setInputChanges(true);
    };

    const handleSelectOptionMembershipNumberShL = (e) => {
        setSelectOptionMembershipNumberShL(e);
        inputValue==partner_number?setInputChanges(false):setInputChanges(true);
        inputValue==''&&setInputChanges(false);
        if(inputFirstNameIPa!==first_name && inputFirstNameIPa!=='')setInputChanges(true);
        if(inputLastNameIPa!==last_name && inputLastNameIPa!=='')setInputChanges(true);
        if(inputEmailIPa!==email && inputEmailIPa!=='')setInputChanges(true);
        if(inputPointsIPa!==points && inputPointsIPa!=='')setInputChanges(true);
    };

    const handleInputEmailIPa = (e) => {
        const texto = e.target.value;
        //const textCleaned = cleanString(texto);
        const textToSaved = cleanText(texto);
        setInputEmailIPa(textToSaved)
        texto===email?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputFirstNameIPa!==first_name && inputFirstNameIPa!=='')setInputChanges(true);
        if(inputLastNameIPa!==last_name && inputLastNameIPa!=='')setInputChanges(true);
        if(inputPointsIPa!==points && inputPointsIPa!=='')setInputChanges(true);
    };

    const handleInputPointsIPa = (e) => {
        const texto = e.target.value;
        if (/^\d*$/.test(texto)) {
            setInputPointsIPa(texto);
        } 
        texto===points?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputFirstNameIPa!==first_name && inputFirstNameIPa!=='')setInputChanges(true);
        if(inputLastNameIPa!==last_name && inputLastNameIPa!=='')setInputChanges(true);
        if(inputEmailIPa!==email && inputEmailIPa!=='')setInputChanges(true);
    };
    
    const handleBtnDelPartner = async() => {
        handleConfirmationDelPartnersModalMobile(true);
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

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdPartner = async() => {
        if (!validateEmail(inputEmailIPa?inputEmailIPa:email)) {
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
        } else if (!isValidUTF8(inputFirstNameIPa)) {
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
        } else if (!isValidUTF8(inputLastNameIPa)) {
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
        } else if (!isValidUTF8(inputEmailIPa)) {
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
        } else if ((inputPointsIPa == points || inputPointsIPa == '') && (inputFirstNameIPa == first_name || inputFirstNameIPa == '') && (inputLastNameIPa == last_name || inputLastNameIPa == '') && (inputEmailIPa == email || inputEmailIPa == '') && (selectOptionMembershipNumber?selectOptionMembershipNumber:optionsMembershipNumber[0]) == partner_number) {
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
        } else {
            document.getElementById('btnUpdatePartner').style.display = 'none';
            setShowSpinner(true);
            const partnerToUpdate = {
                first_name: inputFirstNameIPa?cleanString(inputFirstNameIPa):first_name,
                last_name: inputLastNameIPa?cleanString(inputLastNameIPa):last_name,
                partner_number: selectOptionMembershipNumber?selectOptionMembershipNumber:partner_number,
                points: inputPointsIPa?inputPointsIPa:points,
                email: inputEmailIPa?cleanString(inputEmailIPa):email
            }
            const response = await fetch(`${apiUrl}/api/partners/${id}`, {
                method: 'PUT',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partnerToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has actualizado el socio correctamente!', {
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
                    handleUpdatePartnerModalMobile(false);
                    handleUpdatePartnerModalMobileLocal(false);
                    setInputChanges(false);
                }, 1500);
            }
            if(data.error === 'There is already a partner with that email or membership number') {
                toast('Ya existe un socio con ese email o número de socio ingresado!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnUpdatePartner').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    const ConfirmationDeleteModal = () => {
        const handleBtnDelPartner = async() => {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/partners/${id}`, {
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email})
            })
            if(response.ok) {
                toast('Has eliminado el socio correctamente!', {
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
                    handleUpdatePartnerModalMobile(false);
                    handleUpdatePartnerModalMobileLocal(false);
                    handleConfirmationDelPartnersModalMobile(false);
                    setInputChanges(false);
                }, 2000);
            } else {
                toast('Has ocurrido un error al querer eliminar el socio!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setShowSpinner(false);
            }
        };

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelPartnersModalMobile(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnPartnersListModalContainerMobile'>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__ask'>¿Estás seguro que deseas borrar el socio?</div>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile'>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__askMobile__ask'>borrar el socio?</div>
                    </div>
                    <div className='confirmationDeleteBtnPartnersListModalContainerMobile__btns'>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn'>
                            <button onClick={handleBtnDelPartner} className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnPartnersListModalContainerMobile__btns__btn__prop'>No</button>
                        </div>
                        {showSpinner&&<Spinner/>}
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdatePartnerModalMobile(false);
        handleUpdatePartnerModalMobileLocal(false);
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
        color: 'white',
        cursor: 'pointer'
    };

    const handleBtnPayMembershipFee = () => {
        handlePayMembershipFeeModal(true);
        handlePayMembershipFeeModalLocal(true);
    };

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
                    handleUpdatePartnerModalMobile(false);
                    handleUpdatePartnerModalMobileLocal(false);
                    setInputChanges(false);
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
     <div className='updatePartnerModalContainerMobile'>
            <div className='updatePartnerModalContainerMobile__btnCloseModal'>
                {
                    !confirmationDelPartnersModalMobile&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='updatePartnerModalContainerMobile__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='updatePartnerModalContainerMobile__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            {
                !confirmationDelPartnersModalMobile?
                <>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>N° socio:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <select className='itemCreatePartner__select__prop' value={selectOptionMembershipNumber} onChange={(e) => {handleSelectOptionMembershipNumberShL(e.target.value)}}>
                                {optionsMembershipNumber.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                            {/* <input className='updatePartnerModalContainerMobile__labelInput__input__prop' value={!inputPartnerNumberIPa?partner_number:inputPartnerNumberIPa}onChange={handleInputPartnerNumberIPa}/> */}
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>Puntos:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <input className='updatePartnerModalContainerMobile__labelInput__input__prop' value={!inputPointsIPa?points:inputPointsIPa}onChange={handleInputPointsIPa}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>Nombre:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <input className='updatePartnerModalContainerMobile__labelInput__input__prop' value={!inputFirstNameIPa?first_name:inputFirstNameIPa}onChange={handleInputFirstNameIPa}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>Apellido:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <input className='updatePartnerModalContainerMobile__labelInput__input__prop' value={!inputLastNameIPa?last_name:inputLastNameIPa}onChange={handleInputLastNameIPa}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>Email:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <input className='updatePartnerModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailIPa?email:inputEmailIPa}onChange={handleInputEmailIPa}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__btns'>
                        <button className='updatePartnerModalContainerMobile__btns__btn' onClick={handleBtnDelPartner}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePartnerModalContainerMobile__btns'>
                        <button id='btnUpdatePartner' className='updatePartnerModalContainerMobile__btns__btn' onClick={handleBtnUpdPartner}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePartnerModalContainerMobile__btns'>
                        {
                            isMembershipFeePaid?
                            <button className='updatePartnerModalContainerMobile__btns__btn' style={{backgroundColor:'green',color:'black'}}>Al día</button>
                            :
                            <button id='btnUpdatePartner' className='updatePartnerModalContainerMobile__btns__btn' style={{backgroundColor:'red',color:'black'}} onClick={handleBtnPayMembershipFee}>Pagar cuota</button>
                        }
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePartnerModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
                :
                <>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>N° socio:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <select disabled className='itemCreatePartner__select__prop' value={selectOptionMembershipNumber} onChange={(e) => {handleSelectOptionMembershipNumberShL(e.target.value)}}>
                                {optionsMembershipNumber.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>Puntos:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <input disabled className='updatePartnerModalContainerMobile__labelInput__input__prop' value={!inputPointsIPa?points:inputPointsIPa}onChange={handleInputPointsIPa}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>Nombre:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <input disabled className='updatePartnerModalContainerMobile__labelInput__input__prop' value={!inputFirstNameIPa?first_name:inputFirstNameIPa}onChange={handleInputFirstNameIPa}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>Apellido:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <input disabled className='updatePartnerModalContainerMobile__labelInput__input__prop' value={!inputLastNameIPa?last_name:inputLastNameIPa}onChange={handleInputLastNameIPa}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__labelInput'>
                        <div className='updatePartnerModalContainerMobile__labelInput__label'>Email:</div>
                        <div className='updatePartnerModalContainerMobile__labelInput__input'>
                            <input disabled className='updatePartnerModalContainerMobile__labelInput__input__prop' type='email' value={!inputEmailIPa?email:inputEmailIPa}onChange={handleInputEmailIPa}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePartnerModalContainerMobile__btns'>
                        <button disabled className='updatePartnerModalContainerMobile__btns__btn' onClick={handleBtnDelPartner}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePartnerModalContainerMobile__btns'>
                        <button disabled id='btnUpdatePartner' className='updatePartnerModalContainerMobile__btns__btn' onClick={handleBtnUpdPartner}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePartnerModalContainerMobile__btns'>
                        {
                            isMembershipFeePaid?
                            <button disabled className='updatePartnerModalContainerMobile__btns__btn' style={{backgroundColor:'green',color:'black'}}>Al día</button>
                            :
                            <button disabled id='btnUpdatePartner' className='updatePartnerModalContainerMobile__btns__btn' style={{backgroundColor:'red',color:'black'}} onClick={handleBtnPayMembershipFee}>Pagar cuota</button>
                        }
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePartnerModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
            }
            {
                confirmationDelPartnersModalMobile&&<ConfirmationDeleteModal/>
            }
            {
            payMembershipFeeModalLocal && 
            <ConfirmationPayMembershipFeeModal
            handlePayMembershipFeeModalLocal={handlePayMembershipFeeModalLocal}
            email={email}
            />
        }
        </div>
    </>
  )
}

export default PartnersListModalMobile
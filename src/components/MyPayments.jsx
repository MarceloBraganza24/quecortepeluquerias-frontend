import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import {BtnMPContext} from '../context/BtnMPContext';
//import {PricesContext} from '../context/PricesContext';
import HMenu from './HMenu';
import Spinner from './Spinner';
import ItemTicket from './ItemTicket';

const MyPayments = () => {
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const {menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
    const {handleBtnBuyVisible} = useContext(BtnMPContext);
    //const {inputCreatePriceOf,inputCreateValuePriceOf,handleInputCreatePriceOf,handleInputCreateValuePriceOf} = useContext(PricesContext);
    const [tickets, setTickets] = useState([]);
    //const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    let ticketsByEmail = [];
    if(tickets.length!=0) {
        ticketsByEmail = tickets.filter(ticket => ticket.email == user.email)
    }
    tickets.length!=0&&ticketsByEmail.sort((a, b) => {
        return new Date(b.ticket_datetime) - new Date(a.ticket_datetime);
    });
    
    const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchPricesData() {
                const response = await fetch(`${apiUrl}/api/tickets`)
                const ticketsAll = await response.json();
                setTickets(ticketsAll.data)
            }
            fetchPricesData();
            const getCookie = (name) => {
                const cookieName = name + "=";
                const decodedCookie = decodeURIComponent(document.cookie);
                const cookieArray = decodedCookie.split(';');
                for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(cookieName) === 0) {
                    return cookie.substring(cookieName.length, cookie.length);
                }
                }
                return "";
            };
            const cookieValue = getCookie('TokenJWT');
            const fetchData = async () => {
                try {
                const response = await fetch(`${apiUrl}/api/sessions/current?cookie=${cookieValue}`)
                if(!response.ok) {
                    window.location.href = '/login';
                }
                const data = await response.json();
                if(data.error === 'jwt expired') {
                    logout();
                    window.location.href = '/login';
                } else {
                    const user = data.data
                    if(user) {
                        setUser(user)
                    }
                }
                } catch (error) {
                console.error('Error:', error);
                }
            };
            fetchData();
            if(cookieValue) {
                login()
            } else {
                logout()
            }
        }, 10000);

        return () => {
            handleBtnBuyVisible(false);
            clearInterval(interval);
        };
    }, [isMonted]);

    useEffect(() => {
        menuOptionsModal&&handleMenuOptionsModal(false);
        async function fetchPricesData() {
            const response = await fetch(`${apiUrl}/api/tickets`)
            const ticketsAll = await response.json();
            setTickets(ticketsAll.data)
        }
        fetchPricesData();
        const getCookie = (name) => {
            const cookieName = name + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
            }
            return "";
        };
        const cookieValue = getCookie('TokenJWT');
        const fetchData = async () => {
            try {
              const response = await fetch(`${apiUrl}/api/sessions/current?cookie=${cookieValue}`)
              const data = await response.json();
              if(data.error === 'jwt expired') {
                logout();
                window.location.href = '/login';
              } else {
                const user = data.data
                if(user) {
                    setUser(user)
                }
              }
            } catch (error) {
              console.error('Error:', error);
            }
          };
        fetchData();
        if(cookieValue) {
            login()
        } else {
            logout()
        }
        setTimeout(() => {
            setIsMonted(true);
        }, 10000)
        return () => {
            handleBtnBuyVisible(false);
        };
    }, []);

  return (
      <>
            <NavBar/>
            {
                isLoggedIn && (user.role==='admin' || user.role==='premium')?
                <>
                    <div className='myPaymentsContainerIsLoggedIn'>
                        <div className='myPaymentsContainerIsLoggedIn__title'>- Mis pagos -</div>
                        {
                            ticketsByEmail.length != 0?
                            <>
                                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__lengthShifts'>
                                    <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__lengthShifts__prop'>Cantidad de tickets: {ticketsByEmail.length}</div>
                                </div>
                                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList'>
                                    <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__headerMobile'>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__headerMobile__label'>Tipo</div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__headerMobile__label'>Pago</div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__headerMobile__label'>Precio unitario</div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__headerMobile__label'>Fecha de pago</div>
                                    </div>
                                    <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header'>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Tipo</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Pago</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Precio unitario</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Nombre</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Apellido</div>  
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Email</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Fecha de pago</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                        </div>
                                    </div>
                                    {
                                        ticketsByEmail.map((ticket) => {
                                            return(
                                                <ItemTicket
                                                id={ticket._id}
                                                title={ticket.type}
                                                payMethod={ticket.payMethod}
                                                unit_price={ticket.unit_price}
                                                first_name={ticket.first_name}
                                                last_name={ticket.last_name}
                                                email={ticket.email}
                                                ticket_datetime={ticket.ticket_datetime}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </>
                            :
                            <div className='myShiftsListContainer__withoutItems'>Aún no posees pagos</div>

                        }
                    </div>
                    {
                        (ticketsByEmail.length == 0) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'25vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'28vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 1) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'18vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'22vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 2) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'15vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'18vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 3) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'12vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 4) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'8vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'12vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 5) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'5vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'8vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 6) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'2vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'4vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 7) &&
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'0vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                        </>
                    }
                    <LogOut/>
                </>
                : isLoggedIn?
                <>
                    <div className='myPaymentsContainerIsLoggedIn'>
                        <div className='myPaymentsContainerIsLoggedIn__title'>- Mis pagos -</div>
                        {
                            ticketsByEmail.length != 0?
                            <>
                                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__lengthShifts'>
                                    <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__lengthShifts__prop'>Cantidad de tickets: {ticketsByEmail.length}</div>
                                </div>
                                <div className='myPaymentsContainerIsLoggedIn__myPaymentsList'>
                                    <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header'>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Tipo</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Pago</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Precio unitario</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Nombre</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Apellido</div>  
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Email</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                            <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label__prop'>Fecha de pago</div>
                                        </div>
                                        <div className='myPaymentsContainerIsLoggedIn__myPaymentsList__header__label'>
                                        </div>
                                    </div>
                                    {
                                        ticketsByEmail.map((ticket) => {
                                            return(
                                                <ItemTicket
                                                id={ticket._id}
                                                title={ticket.type}
                                                payMethod={ticket.payMethod}
                                                unit_price={ticket.unit_price}
                                                first_name={ticket.first_name}
                                                last_name={ticket.last_name}
                                                email={ticket.email}
                                                ticket_datetime={ticket.ticket_datetime}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </>
                            :
                            <div className='myShiftsListContainer__withoutItems'>Aún no posees pagos</div>
                        }
                        
                    </div>
                    {
                        (ticketsByEmail.length == 0) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'25vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'28vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 1) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'18vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'22vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 2) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'15vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'18vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 3) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'12vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 4) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'8vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'12vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 5) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'5vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'8vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 6) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'2vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'4vh 0vh'}}></div>
                        </>
                        : (ticketsByEmail.length == 7) &&
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'0vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                        </>
                    }
                    <LogOut/>
                </>
                :
                <>
                    <div className='warningLogin'>
                    <p className='warningLogin__prop'>Si aún no has iniciado sesión, <Link to={"/login"} className='warningLogin__link'>has click aquí</Link></p>
                    </div>
                    <div className='blackDiv'></div> 
                </>
            }
        <Footer/>
    </>
  )
}

export default MyPayments
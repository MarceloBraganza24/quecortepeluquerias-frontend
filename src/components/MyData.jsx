import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import HMenu from './HMenu';
import Spinner from './Spinner';
import MyDataModal from './MyDataModal';

const MyData = () => {
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [isMyDataModalOpen, setIsMyDataModalOpen] = useState(false);
    const {menuOptionsModal,handleMenuOptionsModal,handleUpdateMyDataModal} = useContext(OpenModalContext);
    //const {inputCreatePriceOf,inputCreateValuePriceOf,handleInputCreatePriceOf,handleInputCreateValuePriceOf} = useContext(PricesContext);
    const [myData, setMyData] = useState([]);
    const [partners, setPartners] = useState([]);
    const partnerByEmailUser = partners.find(partner => partner.email == user.email)
    const apiUrl = import.meta.env.VITE_API_URL;
    const [showSpinner, setShowSpinner] = useState(false);

    const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchMyData() {
                const response = await fetch(`${apiUrl}/api/my-data`)
                const myDataAll = await response.json();
                setMyData(myDataAll.data)
            }
            fetchMyData();
            async function fetchPartners() {
                const response = await fetch(`${apiUrl}/api/partners`)
                const partnersAll = await response.json();
                setPartners(partnersAll.data)
            }
            fetchPartners();
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
            clearInterval(interval);
        };
    }, [isMonted]);

    useEffect(() => {
        menuOptionsModal&&handleMenuOptionsModal(false);
        async function fetchMyData() {
            const response = await fetch(`${apiUrl}/api/my-data`)
            const myDataAll = await response.json();
            setMyData(myDataAll.data)
        }
        fetchMyData();
        async function fetchPartners() {
            const response = await fetch(`${apiUrl}/api/partners`)
            const partnersAll = await response.json();
            setPartners(partnersAll.data)
        }
        fetchPartners();
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
    }, []);

    const handleBtnOpenMyDataModal = () => {
        handleUpdateMyDataModal(true);
        setIsMyDataModalOpen(true);
    }

  return (
      <>
            <NavBar/>
            {
                isLoggedIn && (user.role==='admin' || user.role==='premium' || user.role==='user')&&
                <>
                    <div className='myDataContainer'>
                        <div className='myDataContainer__title'>- Mis datos -</div>
                        <div className='myDataContainer__data'>
                            <div className='myDataContainer__data__label-input'>
                                <div className='myDataContainer__data__label-input__label'>
                                    <div className='myDataContainer__data__label-input__label__prop'>Nombre:</div>
                                </div>
                                <div className='myDataContainer__data__label-input__labelData'>
                                    <div className='myDataContainer__data__label-input__labelData__prop'>{user.first_name}</div>
                                </div>
                            </div>
                            <div className='myDataContainer__data__label-input'>
                                <div className='myDataContainer__data__label-input__label'>
                                    <div className='myDataContainer__data__label-input__label__prop'>Apellido:</div>
                                </div>
                                <div className='myDataContainer__data__label-input__labelData'>
                                    <div className='myDataContainer__data__label-input__labelData__prop'>{user.last_name}</div>
                                </div>
                            </div>
                            <div className='myDataContainer__data__label-input'>
                                <div className='myDataContainer__data__label-input__label'>
                                    <div className='myDataContainer__data__label-input__label__prop'>Email:</div>
                                </div>
                                <div className='myDataContainer__data__label-input__labelData no-scroll'>
                                    <div className='myDataContainer__data__label-input__labelData__prop no-scroll'>{user.email}</div>
                                </div>
                            </div>
                            <div className='myDataContainer__data__label-input'>
                                <div className='myDataContainer__data__label-input__label'>
                                    <div className='myDataContainer__data__label-input__label__prop'>Socio:</div>
                                </div>
                                <div className='myDataContainer__data__label-input__labelData'>
                                    <div className='myDataContainer__data__label-input__labelData__prop'>{user.isMembershipFeePaid?'Si':'No'}</div>
                                </div>
                            </div>
                            {
                                user.isMembershipFeePaid&&
                                <div className='myDataContainer__data__label-input'>
                                    <div className='myDataContainer__data__label-input__labelNPartner'>
                                        <div className='myDataContainer__data__label-input__labelNPartner__prop'>N° socio:</div>
                                    </div>
                                    <div className='myDataContainer__data__label-input__labelData'>
                                        <div className='myDataContainer__data__label-input__labelData__prop'>{(user&&partnerByEmailUser)?partnerByEmailUser.partner_number:'-'}</div>
                                    </div>
                                </div>
                            }
                            {
                                user.isMembershipFeePaid&&
                                <div className='myDataContainer__data__label-input'>
                                    <div className='myDataContainer__data__label-input__labelNPartner'>
                                        <div className='myDataContainer__data__label-input__labelNPartner__prop'>Puntos:</div>
                                    </div>
                                    <div className='myDataContainer__data__label-input__labelData'>
                                        <div className='myDataContainer__data__label-input__labelData__prop'>{(user&&partnerByEmailUser)?partnerByEmailUser.points:'-'} pts.</div>
                                    </div>
                                </div>
                            }
                            <div className='myDataContainer__data__label-input'>
                                <div className='myDataContainer__data__label-input__label'>
                                    <div className='myDataContainer__data__label-input__label__prop'>Rol:</div>
                                </div>
                                <div className='myDataContainer__data__label-input__labelData'>
                                    <div className='myDataContainer__data__label-input__labelData__prop'>{user.role}</div>
                                </div>
                            </div>
                        </div>
                        <div className='myDataContainer__btn'>
                            <button onClick={handleBtnOpenMyDataModal} className='myDataContainer__btn__prop'>Editar</button>
                        </div>
                    </div>
                    {isMyDataModalOpen && <MyDataModal handleUpdateMyDataModal={handleUpdateMyDataModal} id={user._id} first_name={user.first_name} last_name={user.last_name} setIsMyDataModalOpen={setIsMyDataModalOpen}/>}
                    {/* <div className='myPaymentsContainerIsLoggedIn'>
                        <div className='myPaymentsContainerIsLoggedIn__title'>- Mis datos -</div>
                        {
                            myDataByEmail.length != 0?
                            <>
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
                                        myDataByEmail.map((ticket) => {
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
                    </div> */}
                    {/* {
                        (myDataByEmail.length == 0) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'25vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'28vh 0vh'}}></div>
                        </>
                        : (myDataByEmail.length == 1) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'18vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'22vh 0vh'}}></div>
                        </>
                        : (myDataByEmail.length == 2) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'15vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'18vh 0vh'}}></div>
                        </>
                        : (myDataByEmail.length == 3) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'12vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                        </>
                        : (myDataByEmail.length == 4) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'8vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'12vh 0vh'}}></div>
                        </>
                        : (myDataByEmail.length == 5) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'5vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'8vh 0vh'}}></div>
                        </>
                        : (myDataByEmail.length == 6) ?
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'2vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'4vh 0vh'}}></div>
                        </>
                        : (myDataByEmail.length == 7) &&
                        <>
                            <div className='myPaymentsContainerIsLoggedIn__blackDiv' style={{padding:'0vh 0vh'}}></div>
                            <div className='myPaymentsContainerIsLoggedIn__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                        </>
                    } */}
                    <LogOut/>
                </>
            }
        <Footer/>
    </>
  )
}

export default MyData
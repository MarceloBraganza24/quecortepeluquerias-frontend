import React, { useContext,useEffect,useState } from 'react'
import { Link } from 'react-router-dom'
import {OpenModalContext} from '../context/OpenModalContext'; 
import HMenuMobile from './HMenuMobile';
import LogOutMobile from './LogOutMobile';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {BtnMPContext} from '../context/BtnMPContext';
import { toast } from "react-toastify";
import HMenu from './HMenu';

const NavBar = () => {
    const {myDataModal,updateShiftModal,cancelDaysListModal,cancelDayModal,recoverShiftModal,cancelShiftModal,updateMyShiftModalMobile,updateUserModalMobile,createUserModalMobile,updateProductModalMobile,createProductModalMobile,updateProviderModalMobile,createProviderModalMobile,updatePartnerModalMobile,createPartnerModalMobile,createShiftModalMobile,updateMyShiftModal,updateShiftModalMobile,updatePartnerModal,updateProviderModal,updateProductsModal,updateUsersModal,updatePricesModal,deleteTicketModal,payMembershipFeeModal} = useContext(OpenModalContext);
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const {handleBtnBuyVisible} = useContext(BtnMPContext);
    const [user, setUser] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
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
                logout()
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
        return () => {
            handleBtnBuyVisible(false);
        };
    },[]);
    
    const goPartnersList = () => {
        toast('Para ver los socios, ve a lista de socios!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

  return (
    <>
        <div className='navBarMobileContainer'>
            <div className='navBarMobileContainer__hMenuMobileContainer'>
                <HMenuMobile/>
            </div>
            <div className='navBarMobileContainer__logoContainer'>
                {
                    !updateShiftModalMobile&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&!createUserModalMobile&&!updateMyShiftModalMobile&&!updatePricesModal&&!updateProductModalMobile&&!updateUserModalMobile&&!deleteTicketModal&&!createProductModalMobile&&!updateProviderModalMobile&&!createProviderModalMobile&&!createPartnerModalMobile&&!updatePartnerModalMobile&&!createShiftModalMobile?
                    <a className='navBarMobileContainer__logoContainer__logo' href="/home">
                        <img src="https://storage.googleapis.com/que-corte-peluquerias-img/logo-que-corte.jpeg" className='navBarMobileContainer__logoContainer__logo__prop' alt="logo-que-corte"/>
                    </a>
                    :
                    <a className='navBarMobileContainer__logoContainer__logo' href="/home">
                        <img src="https://storage.googleapis.com/que-corte-peluquerias-img/logo-que-corte.jpeg" className='navBarMobileContainer__logoContainer__logo__prop' alt="logo-que-corte"/>
                    </a>
                }
            </div>
            <div className='navBarMobileContainer__logOutMobileContainer'>
                <LogOutMobile/>
            </div>
            
        </div>



        <div className='navBarContainer'>
            <div className='navBarContainer__hMenuLogo'>
                <div className='navBarContainer__hMenuLogo__hMenu'>
                    <HMenu/>
                </div>
                <div className='navBarContainer__hMenuLogo__logo'>
                    <img src="https://storage.googleapis.com/que-corte-peluquerias-img/logo-que-corte.jpeg" className='navBarContainer__hMenuLogo__logo__prop' alt="logo-que-corte"/>
                </div>
            </div>
            <div className='navBarContainer__phrase-btns'>
                <div className='navBarContainer__phrase-btns__phrase-user'>
                    <div className='navBarContainer__phrase-btns__phrase-user__phrase'>
                        <p className='navBarContainer__phrase-btns__phrase-user__phrase__prop'>. . Trabajamos para resaltar tu belleza . .</p>
                    </div>
                    <div className='navBarContainer__phrase-btns__phrase-user__user'>
                        {
                            isLoggedIn?
                            <p className='navBarContainer__phrase-btns__phrase-user__user__prop'>Bienvenido/a, {user&&user.first_name.split(' ')[0]}</p>
                            :
                            <p className='navBarContainer__phrase-btns__phrase-user__user__prop'>Bienvenido/a</p>
                        }
                    </div>
                </div>
                <div className='navBarContainer__phrase-btns__btns'>
                    {
                        !updateShiftModal&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
                        <Link to={"/home"} className='navBarContainer__phrase-btns__btns__prop'>
                            Inicio
                        </Link>
                        :
                        <div className='navBarContainer__phrase-btns__btns__prop'>Inicio</div>
                    }
                    {
                        !updateShiftModal&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
                        <Link to={"/shifts"} className='navBarContainer__phrase-btns__btns__prop'>
                            Turnos
                        </Link>
                        :
                        <div className='navBarContainer__phrase-btns__btns__prop'>Turnos</div>
                    }
                    {
                        !updateShiftModal&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
                        <Link to={"/cuts"} className='navBarContainer__phrase-btns__btns__prop'>
                            Cortes
                        </Link>
                        :
                        <div className='navBarContainer__phrase-btns__btns__prop'>Cortes</div>
                    }
                    {
                        !updateShiftModal&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
                        <Link to={"/about"} className='navBarContainer__phrase-btns__btns__prop'>
                            Sobre nosotros
                        </Link>
                        :
                        <div className='navBarContainer__phrase-btns__btns__prop'>Sobre nosotros</div>
                    }
                    {
                        !updateShiftModal&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&(user.role != 'admin')&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
                        <Link to={"/partners"} className='navBarContainer__phrase-btns__btns__prop'>
                            Socios
                        </Link>
                        :
                        (user.role == 'admin')?
                        <div className='navBarContainer__phrase-btns__btns__prop' onClick={goPartnersList}>Socios</div>
                        :
                        <div className='navBarContainer__phrase-btns__btns__prop'>Socios</div>
                    }
                </div>
            </div>
        </div>
    </>
  )
}

export default NavBar
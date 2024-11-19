import React, {useContext, useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import {OpenModalContext} from '../context/OpenModalContext';
import {IsLoggedContext} from '../context/IsLoggedContext';
import { toast } from 'react-toastify';

const HMenuMobile = () => {
  const {deleteVariouModal,updateVariousPriceModal,deletePartnerBenModal,updatePartnersBenModal,updateServiceBtnIsOpen,deleteServiceModal,deleteCompanyModal,deleteHairdresserModal,saveShiftModal,myDataModal,updateShiftModal,cancelDayModal,cancelDaysListModal,recoverShiftModal,cancelShiftModal,updateMyShiftModalMobile,updateUserModalMobile,createUserModalMobile,updateProductModalMobile,createProductModalMobile,updateProviderModalMobile,createProviderModalMobile,updatePartnerModalMobile,createPartnerModalMobile,createShiftModalMobile,updateShiftModalMobile,updateMyShiftModal,updatePartnerModal,updateProviderModal,updateProductsModal,updateUsersModal,updatePricesModal,deleteTicketModal,menuOptionsModal,handleMenuOptionsModal,payMembershipFeeModal} = useContext(OpenModalContext);
  const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
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
  }, []);

  const openCloseW = () => {
    if(!menuOptionsModal) {
      handleMenuOptionsModal(true)
    } else if(menuOptionsModal) {
      handleMenuOptionsModal(false)
    }
  }

  return (
    <>
      {
        !updateShiftModal&&!deleteVariouModal&&!updateVariousPriceModal&&!deletePartnerBenModal&&!deleteServiceModal&&!updatePartnersBenModal&&!updateServiceBtnIsOpen&&!deleteHairdresserModal&&!deleteCompanyModal&&!saveShiftModal&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModalMobile&&!updateUserModalMobile&&!createUserModalMobile&&!updateProductModalMobile&&!updateProviderModalMobile&&!createProductModalMobile&&!createProviderModalMobile&&!createPartnerModalMobile&&!updatePartnerModalMobile&&!updateMyShiftModal&&!createShiftModalMobile&&!updateShiftModalMobile&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
        <>
          <div onClick={openCloseW} className='hMenuMobile'>
            <div className='hMenuMobile__line'></div>
            <div className='hMenuMobile__line'></div>
            <div className='hMenuMobile__line'></div>
          </div>
          {menuOptionsModal&&<MenuOptions isLoggedIn={isLoggedIn}role={user.role}/>}
        </>
        :
        <>
          <div className='hMenuMobile'>
            <div className='hMenuMobile__line'></div>
            <div className='hMenuMobile__line'></div>
            <div className='hMenuMobile__line'></div>
          </div>
        </>
      }
      
    </>
  )
}

const MenuOptions = ({isLoggedIn,role}) => {

  return (
    <>
      <div id='menuOptionsMobile' className='menuOptionsMobile'>
        {
          isLoggedIn && role==='admin'?
          <>
            <Link to={"/shifts"} className='menuOptionsMobile__item'>
                - Turnos
            </Link>
            <Link to={"/cuts"} className='menuOptionsMobile__item'>
                - Cortes
            </Link>
            <Link to={"/partners"} className='menuOptionsMobile__item'>
                - Socios
            </Link>
            <Link to={"/shiftsList"} className='menuOptionsMobile__item'>
                - Lista de turnos
            </Link>
            <Link to={"/partnersList"} className='menuOptionsMobile__item'>
              - Lista de socios
            </Link>
            <Link to={"/providersList"} className='menuOptionsMobile__item'>
              - Lista de proveedores
            </Link>
            <Link to={"/productsList"} className='menuOptionsMobile__item'>
              - Lista de productos
            </Link>
            <Link to={"/usersList"} className='menuOptionsMobile__item'>
              - Lista de usuarios
            </Link>
              <Link to={"/myShifts"} className='menuOptionsMobile__item'>
                - Mis turnos
            </Link>
            <Link to={"/myData"} className='menuOptionsMobile__item'>
              - Mis datos
            </Link>
            <Link to={"/config"} className='menuOptionsMobile__item'>
              - Configuración
            </Link>
            <Link to={"/about"} className='menuOptionsMobile__item'>
                - Sobre Nosotros
            </Link>
          </>
          :
          isLoggedIn && (role==='premium' || role==='user')&&
          <>
            <Link to={"/shifts"} className='menuOptionsMobile__item'>
                - Turnos
            </Link>
            <Link to={"/cuts"} className='menuOptionsMobile__item'>
                - Cortes
            </Link>
            <Link to={"/partners"} className='menuOptionsMobile__item'>
                - Socios
            </Link>
            <Link to={"/myShifts"} className='menuOptionsMobile__item'>
                - Mis turnos
            </Link>
            <Link to={"/myData"} className='menuOptionsMobile__item'>
              - Mis datos
            </Link>
            <Link to={"/about"} className='menuOptionsMobile__item'>
                - Sobre Nosotros
            </Link>
          </>
        }  
      </div>
    </>
  )
}


export default HMenuMobile
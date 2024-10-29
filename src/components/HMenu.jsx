import React, {useContext,useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import {OpenModalContext} from '../context/OpenModalContext';
import {IsLoggedContext} from '../context/IsLoggedContext';

const HMenu = () => {
  const {myDataModal,updateShiftModal,cancelDayModal,cancelDaysListModal,recoverShiftModal,cancelShiftModal,updateMyShiftModal,updatePartnerModal,updateProviderModal,updateProductsModal,updateUsersModal,updatePricesModal,deleteTicketModal,menuOptionsModal,handleMenuOptionsModal,payMembershipFeeModal} = useContext(OpenModalContext);
  const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
  const [user, setUser] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    menuOptionsModal&&handleMenuOptionsModal(false);
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
        !updateShiftModal&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
        <>
          <div onClick={openCloseW} className='hMenu'>
            <div className='hMenu__line'></div>
            <div className='hMenu__line'></div>
            <div className='hMenu__line'></div>
          </div>
          {menuOptionsModal&&<MenuOptions isLoggedIn={isLoggedIn} role={user.role}/>}
        </>
        :
        <>
          <div className='hMenu'>
            <div className='hMenu__line'></div>
            <div className='hMenu__line'></div>
            <div className='hMenu__line'></div>
          </div>
        </>
      }
      
    </>
  )
}

const MenuOptions = ({isLoggedIn,role}) => {
  
  return (
    <>
      <div id='menuOptions' className='menuOptions'>
        {
          isLoggedIn && role==='admin'?
          <>
            <Link to={"/partners"} className='menuOptions__item'>
              - Socios
            </Link>
            <Link to={"/shiftsList"} className='menuOptions__item'>
              - Lista de turnos
            </Link>
            <Link to={"/partnersList"} className='menuOptions__item'>
              - Lista de socios
            </Link>
            <Link to={"/providersList"} className='menuOptions__item'>
              - Lista de proveedores
            </Link>
            <Link to={"/productsList"} className='menuOptions__item'>
              - Lista de productos
            </Link>
            <Link to={"/usersList"} className='menuOptions__item'>
              - Lista de usuarios
            </Link>
            <Link to={"/myShifts"} className='menuOptions__item'>
            - Mis turnos
            </Link>
            {/* <Link to={"/myPayments"} className='menuOptions__item'>
              - Mis pagos
            </Link> */}
            <Link to={"/myData"} className='menuOptions__item'>
              - Mis datos
            </Link>
            <Link to={"/config"} className='menuOptionsMobile__item'>
              - Configuración
            </Link>
          </>
          :
          isLoggedIn && (role==='premium' || role==='user')?
          <>
            <Link to={"/partners"} className='menuOptions__item'>
              - Socios
            </Link>
            <Link to={"/myShifts"} className='menuOptions__item'>
            - Mis turnos
            </Link>
            {/* <Link to={"/myPayments"} className='menuOptions__item'>
              - Mis pagos
              </Link> */}
            <Link to={"/myData"} className='menuOptions__item'>
              - Mis datos
            </Link>
            {/* <Link to={"/about"} className='menuOptions__item'>
              - Sobre nosotros
            </Link> */}
          </>
          :
          <>
            {/* <Link to={"/myPayments"} className='menuOptions__item'>
              - Mis pagos
            </Link> */}
            <Link to={"/myData"} className='menuOptions__item'>
              - Mis datos
            </Link>
          </>
        }
      </div>
    </>
  )
}


export default HMenu
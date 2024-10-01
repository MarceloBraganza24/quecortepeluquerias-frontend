import React, { useContext} from 'react'
import { toast } from "react-toastify";
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext';
import {BtnMPContext} from '../context/BtnMPContext';

const LogOutMobile = () => {
  const {isLoggedIn,logout} = useContext(IsLoggedContext);
  const {myDataModal,updateShiftModal,cancelDayModal,cancelDaysListModal,recoverShiftModal,cancelShiftModal,updateMyShiftModalMobile,updateUserModalMobile,createUserModalMobile,updateProductModalMobile,createProductModalMobile,updateProviderModalMobile,createProviderModalMobile,updatePartnerModalMobile,createPartnerModalMobile,createShiftModalMobile,updateMyShiftModal,updateShiftModalMobile,updatePartnerModal,updateProviderModal,updateProductsModal,updateUsersModal,updatePricesModal,deleteTicketModal,payMembershipFeeModal} = useContext(OpenModalContext);
  const {btnBuyVisible} = useContext(BtnMPContext);
  const apiUrl = import.meta.env.VITE_API_URL;

    const logOutBtn = async (event) => {
      event.preventDefault();
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const last_connection = currentDate;
      
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
        const response = await fetch(`${apiUrl}/api/sessions/logout?cookie=${cookieValue}`, {
          method: 'POST',         
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ last_connection })
        })
        if(response.ok) {
          const expirationDate = new Date(0);
          const cookieJWT = `TokenJWT=${cookieValue}; expires=${expirationDate.toUTCString()}`;
          document.cookie = cookieJWT;
          logout();
          window.location.href = '/login'
          toast('Gracias por visitar nuestra página', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
          });
        }
    }
  return (
    <>
      {
        !updateShiftModal&&!myDataModal&&!cancelDaysListModal&&!cancelDayModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModalMobile&&!updateUserModalMobile&&!createUserModalMobile&&!updateProductModalMobile&&!createProductModalMobile&&!updateProviderModalMobile&&!createProviderModalMobile&&!createPartnerModalMobile&&!updatePartnerModalMobile&&!createShiftModalMobile&&!updateMyShiftModal&&!updateShiftModalMobile&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&isLoggedIn&&!btnBuyVisible&&!payMembershipFeeModal?
        <a onClick={logOutBtn} href="" className='logOutMobile'>Cerrar sesión</a>
        :
        <a aria-disabled className='logOutMobile'>Cerrar sesión</a>
      }
    </>
  )
}

export default LogOutMobile
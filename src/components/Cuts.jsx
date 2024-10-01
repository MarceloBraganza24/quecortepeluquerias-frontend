import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import HMenu from './HMenu'
import { Link } from 'react-router-dom'
import LogOut from './LogOut';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 

const Cuts = () => {
  const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
  const [user, setUser] = useState('');
  const {menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
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
    }, []);
  return (
    <>
        <NavBar/>
        {
          isLoggedIn && (user.role=='admin' || user.role=='premium')?
          <>
            <div className='cutsContainer'>
              <div className='cutsContainer__cuts'>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte4.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte1.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte2.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya1.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya2.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
              </div>
            </div>
            <LogOut/>
          </>
          : isLoggedIn?
          <>
            <div className='cutsContainer'>
            <div className='cutsContainer__cuts'>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte4.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte1.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte2.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya1.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya2.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
              </div>
            </div>
            <LogOut/>
          </>
          :
          <>
            <div className='warningLogin'>
              <p className='warningLogin__prop'>Si aún no has iniciado sesión, <Link to={"/login"} className='warningLogin__link'>has click aquí</Link></p>
            </div>
            <div className='cutsContainer'>
            <div className='cutsContainer__cuts'>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte4.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte1.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte2.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya1.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='cutsContainer__cuts__cut'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya2.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
                </div>
              </div>
            </div>
          </>
        }
        <Footer/>
    </>
  )
}

export default Cuts
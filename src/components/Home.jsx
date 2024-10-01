import React, { useContext, useEffect, useState } from 'react'
import LogOut from './LogOut'
import NavBar from './NavBar'
import Footer from './Footer'
import HMenu from './HMenu'
import { Link } from 'react-router-dom'
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 

const Home = () => {
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
        if(!response.ok) {
          window.location.href = '/login';
      }
        const data = await response.json();
        if(data.error === 'jwt expired') {
          logout();
          window.location.href = '/login';
        } else {
          const user = data.data;
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
          <LogOut/>
          <div className='homeContainer'>
              <div className='homeContainer__userName'>
                <h2 className='homeContainer__userName__prop'>- Bienvenido/a, {user.first_name} -</h2>  
              </div>
              <div className='homeContainer__imgContainer'>
                <div className='homeContainer__imgContainer__img'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/peluqueros.jpeg" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='homeContainer__imgContainer__img'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/salon.jpeg" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='homeContainer__imgContainer__img'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/chopper.jpeg" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='homeContainer__imgContainer__img'>
                  <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-foto4-index.jpg" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                </div>
              </div>
          </div>
      <Footer/>
    {/* <>
      <NavBar/>
      {
        !isLoggedIn ?
        <>
        <div className='warningLogin'>
        <p className='warningLogin__prop'>Si aún no has iniciado sesión, <Link to={"/login"} className='warningLogin__link'>has click aquí</Link></p>
        </div>
        <div className='homeContainer'>
        <div className='homeContainer__imgContainer'>
        <div className='homeContainer__imgContainer__img'>
        <img src="/img/pelu2.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
        </div>
        <div className='homeContainer__imgContainer__img'>
        <img src="/img/pelu1.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
        </div>
        <div className='homeContainer__imgContainer__img'>
        <img src="/img/pelu3.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
        </div>
        <div className='homeContainer__imgContainer__img'>
        <img src="/img/pelu4.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
        </div>
        </div>
        </div>
        </> 
        : 
        isLoggedIn && (user.role==='admin' || user.role==='premium') ?
        <>
        <div className='homeContainer'>
              <div className='homeContainer__userName'>
                <h2 className='homeContainer__userName__prop'>- Bienvenido/a, {user.first_name} -</h2>  
              </div>
              <div className='homeContainer__imgContainer'>
              <div className='homeContainer__imgContainer__img'>
              <img src="/img/pelu2.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
              </div>
              <div className='homeContainer__imgContainer__img'>
                  <img src="/img/pelu1.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                </div>
                <div className='homeContainer__imgContainer__img'>
                  <img src="/img/pelu3.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                  </div>
                  <div className='homeContainer__imgContainer__img'>
                  <img src="/img/pelu4.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                  </div>
                  </div>
                  </div>
                  <LogOut/>
                  </>
                  : 
         isLoggedIn && (user.role==='user') &&
         <>
          <div className='homeContainer'>
          <div className='homeContainer__userName'>
          <h2 className='homeContainer__userName__prop'>- Bienvenido/a, {user.first_name} -</h2>  
          </div>
          <div className='homeContainer__imgContainer'>
                <div className='homeContainer__imgContainer__img'>
                  <img src="/img/pelu2.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                  </div>
                <div className='homeContainer__imgContainer__img'>
                  <img src="/img/pelu1.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                  </div>
                  <div className='homeContainer__imgContainer__img'>
                  <img src="/img/pelu3.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                  </div>
                  <div className='homeContainer__imgContainer__img'>
                  <img src="/img/pelu4.png" className='homeContainer__imgContainer__img__prop' alt="imagenPeluqueria"/>
                </div>
                </div>
            </div>
          <LogOut/>
          </>
          }
      <Footer/>
    </> */}
          </>
  )
}

export default Home
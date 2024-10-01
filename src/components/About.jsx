import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import HMenu from './HMenu';
import { Link } from 'react-router-dom'
import LogOut from './LogOut';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import { toast } from 'react-toastify';

const About = () => {
  const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
  const [user, setUser] = useState('');
  const [queCortePeluqueriasAboutTextBD, setQueCortePeluqueriasAboutTextBD] = useState('');
  const [queCortePeluqueriasAboutText, setQueCortePeluqueriasAboutText] = useState('');
  const [editText, setEditText] = useState(false);
  const {menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    menuOptionsModal&&handleMenuOptionsModal(false);
    async function fetchAboutText() {
        const response = await fetch(`${apiUrl}/api/about`)
        const aboutText = await response.json();
        const aboutTextBD = aboutText.data.find(item => item.aboutText)
        setQueCortePeluqueriasAboutTextBD(aboutTextBD)
    }
    fetchAboutText();
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

  const btnShowTextAreaAboutText = () => {
    setEditText(true)
    if(queCortePeluqueriasAboutTextBD) {
      setQueCortePeluqueriasAboutText(queCortePeluqueriasAboutTextBD.aboutText)
    }
  }

  const btnUpdateAboutText = async() => {

    if(queCortePeluqueriasAboutText == '') {
      toast('Debes ingresar un texto!', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
    } else {
      //console.log(queCortePeluqueriasAboutText)
      const response = await fetch(`${apiUrl}/api/about/${queCortePeluqueriasAboutTextBD._id}`, {
        method: 'PUT',         
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({aboutText: queCortePeluqueriasAboutText})
      })
      if(response.ok) {
          toast('Has editado el texto correctamente!', {
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
            setEditText(false);
          }, 2000);
      }
    }
  }

  function isValidUTF8(str) {
      const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
      return utf8Regex.test(str);
  }

  const handleInputAboutText = (event) => {
    const texto = event.target.value;
    if(isValidUTF8(texto)) {
      setQueCortePeluqueriasAboutText(texto);
    }
  }

  const btnSaveAboutText = async() => {

    if(queCortePeluqueriasAboutText == '') {
      toast('Debes ingresar un texto!', {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
    } else {
      //console.log(queCortePeluqueriasAboutText)
      const response = await fetch(`${apiUrl}/api/about/register`, {
        method: 'POST',         
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({aboutText: queCortePeluqueriasAboutText})
      })
      if(response.ok) {
          toast('Has guardado el texto correctamente!', {
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
            setEditText(false);
          }, 2000);
      }
    }
    //console.log(queCortePeluqueriasAboutText)
  }

  return (
    <>
        <NavBar/>
        {
          isLoggedIn && (user.role=='admin')?
          <>


            <div className='aboutContainer'>

              {
                !editText ? 
                  <>
                    <div className='aboutContainer__descriptionContainerAdmin'>
                      <p>Somos una peluquería dedicada especialmente para vos que estás buscando un cambio de look. La peluquería se encuentra ubicada en la Avenida Casey 1664, ciudad de Coronel Suárez, Pcia de Buenos Aires. El personal se conforma por tres peluqueros, Ayrton Fibiger, Mirko Fibiger y Ale Lambretch en el que cada día brindan la mejor atención hacia sus clientes para que se sientan cómodos y amenos con su corte de pelo. Marcamos nuestro propio estilo en corte, color y peinado, con personalización en cada servicio, calidad de atención e imagen. Nuestro objetivo es que quienes visiten nuestro salón vivan una experiencia de 360 grados.</p>
                      {/* <p>{queCortePeluqueriasAboutTextBD?queCortePeluqueriasAboutTextBD.aboutText:'Aún no existe ningun texto sobre la empresa, escriba uno'}</p> */}
                    </div>
                    {/* <div className='aboutContainer__btn'>
                      <button disabled style={{color:'black'}} onClick={btnShowTextAreaAboutText} className='aboutContainer__btn__prop'>Editar</button>
                    </div> */}
                  </>
                :
                  <>
                    <div className='aboutContainer__input'>
                      <textarea
                        value={queCortePeluqueriasAboutText}
                        onChange={handleInputAboutText}
                        className='aboutContainer__input__prop'
                        rows="5"  // Define el número de filas visibles
                        cols="30" // Define el número de columnas visibles
                        placeholder="Escribe algo aquí..."
                      />
                    </div>
                    <div className='aboutContainer__btn'>
                      {
                        queCortePeluqueriasAboutTextBD ?
                        <button onClick={btnUpdateAboutText} className='aboutContainer__btn__prop'>Guardar</button>
                        :
                        <button onClick={btnSaveAboutText} className='aboutContainer__btn__prop'>Guardar</button>
                      }
                      <button onClick={()=>setEditText(false)} className='aboutContainer__btn__prop'>Atrás</button>
                    </div>
                  </>
              }
              

            </div>

            <LogOut/>

          </>
          : isLoggedIn && (user.role=='premium' || user.role=='user')?
          <>
            <div className='aboutContainer'>
              <div className='aboutContainer__descriptionContainer'>
              <p>Somos una peluquería dedicada especialmente para vos que estás buscando un cambio de look. La peluquería se encuentra ubicada en la Avenida Casey 1664, ciudad de Coronel Suárez, Pcia de Buenos Aires. El personal se conforma por tres peluqueros, Ayrton Fibiger, Mirko Fibiger y Ale Lambretch en el que cada día brindan la mejor atención hacia sus clientes para que se sientan cómodos y amenos con su corte de pelo. Marcamos nuestro propio estilo en corte, color y peinado, con personalización en cada servicio, calidad de atención e imagen. Nuestro objetivo es que quienes visiten nuestro salón vivan una experiencia de 360 grados.</p>
                {/* <p>{queCortePeluqueriasAboutTextBD?queCortePeluqueriasAboutTextBD.aboutText:'Aún no existe ningun texto sobre la empresa, escriba uno'}</p> */}
              </div>
            </div>
            <LogOut/>
          </>
          :
          <>
            <div className='warningLogin'>
              <p className='warningLogin__prop'>Si aún no has iniciado sesión, <Link to={"/login"} className='warningLogin__link'>has click aquí</Link></p>
            </div>
            <div className='aboutContainer'>
              <div className='aboutContainer__descriptionContainerIsNotLogin'>
              <p>Somos una peluquería dedicada especialmente para vos que estás buscando un cambio de look. La peluquería se encuentra ubicada en la Avenida Casey 1664, ciudad de Coronel Suárez, Pcia de Buenos Aires. El personal se conforma por tres peluqueros, Ayrton Fibiger, Mirko Fibiger y Ale Lambretch en el que cada día brindan la mejor atención hacia sus clientes para que se sientan cómodos y amenos con su corte de pelo. Marcamos nuestro propio estilo en corte, color y peinado, con personalización en cada servicio, calidad de atención e imagen. Nuestro objetivo es que quienes visiten nuestro salón vivan una experiencia de 360 grados.</p>
                {/* <p>{queCortePeluqueriasAboutTextBD?queCortePeluqueriasAboutTextBD.aboutText:'Aún no existe ningun texto sobre la empresa, escriba uno'}</p> */}
              </div>
            </div>
          </>
        }
        <Footer/>
    </>
  )
}

export default About
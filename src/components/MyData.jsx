import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import Spinner from './Spinner';
import MyDataModal from './MyDataModal';

const MyData = () => {
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [isMyDataModalOpen, setIsMyDataModalOpen] = useState(false);
    const {menuOptionsModal,handleMenuOptionsModal,handleUpdateMyDataModal} = useContext(OpenModalContext);
    const [myData, setMyData] = useState([]);
    const [partners, setPartners] = useState([]);
    const partnerByEmailUser = partners.find(partner => partner.email == user.email)
    const apiUrl = import.meta.env.VITE_API_URL;
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
                isLoggedIn && (user.role==='admin' || user.role==='premium' || user.role==='user')?
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
                    <LogOut/>
                </>
                :
                <div className='blackDiv'><Spinner/></div>
            }
        <Footer/>
    </>
  )
}

export default MyData
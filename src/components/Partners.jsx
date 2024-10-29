import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {BtnMPContext} from '../context/BtnMPContext';
import {OpenModalContext} from '../context/OpenModalContext'; 

const Partners = () => {
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState('');
    const [partners, setPartners] = useState([]);
    const partnerByEmailUser = partners.find(partner => partner.email == user.email)
    const [partnersBen, setPartnersBen] = useState([]);
    const {menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
    const {handleBtnBuyVisible} = useContext(BtnMPContext);
    const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchPartners() {
                const response = await fetch(`${apiUrl}/api/partners`)
                const partnersAll = await response.json();
                setPartners(partnersAll.data)
            }
            fetchPartners();
            async function fetchPartnersBenData() {
                const response = await fetch(`${apiUrl}/api/partnersBen`)
                const partnersBenAll = await response.json();
                setPartnersBen(partnersBenAll.data)
            }
            fetchPartnersBenData();
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
        }, 4000);

        return () => {
            handleBtnBuyVisible(false);
            clearInterval(interval);
        };
    }, [isMonted]);

    useEffect(() => {
        menuOptionsModal&&handleMenuOptionsModal(false);
        async function fetchPartners() {
            const response = await fetch(`${apiUrl}/api/partners`)
            const partnersAll = await response.json();
            setPartners(partnersAll.data)
        }
        fetchPartners();
        async function fetchPartnersBenData() {
            const response = await fetch(`${apiUrl}/api/partnersBen`)
            const partnersBenAll = await response.json();
            setPartnersBen(partnersBenAll.data)
        }
        fetchPartnersBenData();
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

        setTimeout(() => {
            setIsMonted(true);
        }, 2500)
      
        return () => {
            handleBtnBuyVisible(false);
        };
    }, []);

  return (
      <>
            <NavBar/>
            {
                isLoggedIn && (user.role=='premium' || user.role=='user') && !user.isMembershipFeePaid?
                <>
                    <div className='partnersContainer'>
                        <div className='partnersContainer__title'>Socios</div>
                        <div className='partnersContainer__phrase'>Hacete Socio y forma parte de la comunidad de Que Corte! Por cada vez que vengas a cortarte, tomar una birra o subir una historia vas a sumar puntos,  y cada 1.000 puntos vas a obtener un corte gratis!!!</div>
                        <div className='partnersContainer__table'>
                            {
                                partnersBen.map((partnerBen) => {
                                    return(
                                        <div className='partnersContainer__table__item'>
                                            <div className='partnersContainer__table__item__prop'>{partnerBen.title}</div>
                                            <div className='partnersContainer__table__item__prop'>{partnerBen.value} pts.</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='partnersContainer__contactPhrase'>Contáctate con la peluquería para hacerte socio!</div>
                    </div>
                    <LogOut/>
                </>
                :
                isLoggedIn && (user.role=='premium' || user.role=='user') && user.isMembershipFeePaid?
                <>
                    <div className='partnersContainerMembershipFeeOk'>
                        <div className='partnersContainerMembershipFeeOk__title'>Socios</div>
                        <div className='partnersContainerMembershipFeeOk__props'>Número socio: {(user&&partnerByEmailUser)?partnerByEmailUser.partner_number:'-'}</div>
                        <div className='partnersContainerMembershipFeeOk__props' style={{paddingBottom:'2vh'}}>Puntos obtenidos: {(user&&partnerByEmailUser)?partnerByEmailUser.points:'-'} pts.</div>
                        <div className='partnersContainerMembershipFeeOk__table'>
                            {
                                partnersBen.map((partnerBen) => {
                                    return(
                                        <div className='partnersContainerMembershipFeeOk__table__item'>
                                            <div className='partnersContainerMembershipFeeOk__table__item__prop'>{partnerBen.title}</div>
                                            <div className='partnersContainerMembershipFeeOk__table__item__prop'>{partnerBen.value} pts.</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <LogOut/> 
                    </>
                :
                <>
                    <div className='partnersContainer'>
                        <div className='partnersContainer__title'>Socios</div>
                        <div className='partnersContainer__phrase'>Hacete Socio y forma parte de la comunidad de Que Corte! Por cada vez que vengas a cortarte, tomar una birra o subir una historia vas a sumar puntos,  y cada 1.000 puntos vas a obtener un corte gratis!!!</div>
                        <div className='partnersContainer__table'>
                            {
                                partnersBen.map((partnerBen) => {
                                    return(
                                        <div className='partnersContainer__table__item'>
                                            <div className='partnersContainer__table__item__prop'>{partnerBen.title}</div>
                                            <div className='partnersContainer__table__item__prop'>{partnerBen.value} pts.</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className='partnersContainer__contactPhrase'>Contáctate con la peluquería para hacerte socio!</div>
                    </div>
                    <LogOut/> 
                </>
            }
        <Footer/>
    </>
  )
}

export default Partners
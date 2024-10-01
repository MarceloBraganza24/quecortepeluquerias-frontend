import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import {IsLoggedContext} from '../context/IsLoggedContext';
import {InputDataPaContext} from '../context/InputDataPaContext';
import {BtnMPContext} from '../context/BtnMPContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import HMenu from './HMenu';
import ItemTicket from './ItemTicket';
import Spinner from './Spinner';

const Partners = () => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [membershipFeePreferenceId, setMembershipFeePreferenceId] = useState(null);
    const [membershipFeeMobilePreferenceId, setMembershipFeeMobilePreferenceId] = useState(null);
    const { inputFirstNamePa, handleInputFirstNamePa, inputLastNamePa, handleInputLastNamePa, inputPhonePa, handleInputPhonePa, inputEmailPa, handleInputEmailPa } = useContext(InputDataPaContext);
    initMercadoPago('APP_USR-c6a80bf1-6064-4d38-85c2-873ae24113ef', {
        locale: 'es-AR'
    });
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth()+1;
    const currentYear = fechaActual.getFullYear();
    const currentDay = fechaActual.getDate();
    const [user, setUser] = useState('');
    const [prices, setPrices] = useState([]);

    //console.log(user)

    const [btnMPModal, handleBtnMPModal] = useState(false);

    //const [isBtnPayMembershipFee, handleBtnPayMembershipFee] = useState(true);
    
    const [isMembershipFeeExpired, setIsMembershipFeeExpired] = useState(false);

    const [tickets, setTickets] = useState([]);
    const [companies, setCompanies] = useState([]);
    const company = companies.find(company => company.name)

    const palabrasABuscar = ["cuota", "socio"];
    const membershipFees = prices.find(objeto => 
        palabrasABuscar.every(palabra => 
        objeto.title.toLowerCase().includes(palabra.toLowerCase())
        )
    );
    
    const membershipFeeTickets = tickets.filter(objeto => 
        palabrasABuscar.every(palabra => 
        objeto.type.toLowerCase().includes(palabra.toLowerCase())
        )
    );

    //let ticketsByType = [];

    /* if(tickets.length!=0) {
        ticketsByType = tickets.filter(ticket => ticket.type == 'cuota socio')
    } */

    let ticketsByTypeByEmail;
    if(user){
        ticketsByTypeByEmail = membershipFeeTickets.filter(ticket => ticket.email == user.email)
    }

    user&&ticketsByTypeByEmail.sort((a, b) => {
        return new Date(b.ticket_datetime) - new Date(a.ticket_datetime);
    });
    
    let ticketsByDate = [];
    if(ticketsByTypeByEmail) {
        ticketsByDate = ticketsByTypeByEmail.map(ticket => ticket.ticket_datetime)
    }

    let ticketsSort = ticketsByDate.sort((a, b) => {
        return new Date(b.ticket_datetime) - new Date(a.ticket_datetime);
    });
    let lastMembershipFeeDate = ticketsSort[0];
    
    const [nextMembershipFeeDate, setNextMembershipFeeDate] = useState('');

    const [lastMembershipFeeMonth, setLastMembershipFeeMonth] = useState('');
    
    const lastMembershipFeeDatee = new Date(lastMembershipFeeDate);
    const monthLastMembershipFeeDatee = lastMembershipFeeDatee.getMonth()+1;
    const yearLastMembershipFeeDatee = lastMembershipFeeDatee.getFullYear();
    //const dayLastMembershipFeeDatee = lastMembershipFeeDatee.getDate();
    
    function diffInMonths(date1, date2) {
        const year1 = date1.getFullYear();
        const month1 = date1.getMonth();
        const year2 = date2.getFullYear();
        const month2 = date2.getMonth();
        const months1 = year1 * 12 + month1;
        const months2 = year2 * 12 + month2;
        return months2 - months1;
    }

    const isAtLeastTwoMonthsApart = diffInMonths(lastMembershipFeeDatee, fechaActual) >= 2;
    
    useEffect(() => {
        if(lastMembershipFeeDate) {
            /* if(isAtLeastTwoMonthsApart) {
                async function fetchUsersData() {
                    const userNoPartner = {
                        email: email,
                        prop: 'isMembershipFeePaid',
                        prop_value: false
        
                    }
                    //userNoPartner.isMembershipFeePaid = false;
                    const response = await fetch(`${apiUrl}/api/users/update-prop`, {
                        method: 'PUT',         
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userNoPartner)
                    })
                    if(response.ok) {
                        toast('Ya no eres más socio en Que Corte!', {
                            position: "top-right",
                            autoClose: 2500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                    }
                }
                //fetchUsersData();
            } */
            if(monthLastMembershipFeeDatee == mesActual && yearLastMembershipFeeDatee == currentYear) {
                setIsMembershipFeeExpired(false);
                if(monthLastMembershipFeeDatee=='12') {
                    setLastMembershipFeeMonth(`Diciembre`);
                    setNextMembershipFeeDate(`Enero`);
                } else if(monthLastMembershipFeeDatee=='1') {
                    setLastMembershipFeeMonth(`Enero`);
                    setNextMembershipFeeDate(`Febrero`);
                } else if(monthLastMembershipFeeDatee=='2') {
                    setLastMembershipFeeMonth(`Febrero`);
                    setNextMembershipFeeDate(`Marzo`);
                } else if(monthLastMembershipFeeDatee=='3') {
                    setLastMembershipFeeMonth(`Marzo`);
                    setNextMembershipFeeDate(`Abril`);
                } else if(monthLastMembershipFeeDatee=='4') {
                    setLastMembershipFeeMonth(`Abril`);
                    setNextMembershipFeeDate(`Mayo`);
                } else if(monthLastMembershipFeeDatee=='5') {
                    setLastMembershipFeeMonth(`Mayo`);
                    setNextMembershipFeeDate(`Junio`);
                } else if(monthLastMembershipFeeDatee=='6') {
                    setLastMembershipFeeMonth(`Junio`);
                    setNextMembershipFeeDate(`Julio`);
                } else if(monthLastMembershipFeeDatee=='7') {
                    setLastMembershipFeeMonth(`Julio`);
                    setNextMembershipFeeDate(`Agosto`);
                } else if(monthLastMembershipFeeDatee=='8') {
                    setLastMembershipFeeMonth(`Agosto`);
                    setNextMembershipFeeDate(`Septiembre`);
                } else if(monthLastMembershipFeeDatee=='9') {
                    setLastMembershipFeeMonth(`Septiembre`);
                    setNextMembershipFeeDate(`Octubre`);
                } else if(monthLastMembershipFeeDatee=='10') {
                    setLastMembershipFeeMonth(`Octubre`);
                    setNextMembershipFeeDate(`Noviembre`);
                } else if(monthLastMembershipFeeDatee=='11') {
                    setLastMembershipFeeMonth(`Noviembre`);
                    setNextMembershipFeeDate(`Diciembre`);
                } else if(monthLastMembershipFeeDatee=='12') {
                    setLastMembershipFeeMonth(`Diciembre`);
                    setNextMembershipFeeDate(`Enero`);
                }
            } else {
                setIsMembershipFeeExpired(true);
                if(monthLastMembershipFeeDatee=='1') {
                    setLastMembershipFeeMonth(`Enero`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='2') {
                    setLastMembershipFeeMonth(`Febrero`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='3') {
                    setLastMembershipFeeMonth(`Marzo`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='4') {
                    setLastMembershipFeeMonth(`Abril`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='5') {
                    setLastMembershipFeeMonth(`Mayo`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='6') {
                    setLastMembershipFeeMonth(`Junio`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='7') {
                    setLastMembershipFeeMonth(`Julio`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='8') {
                    setLastMembershipFeeMonth(`Agosto`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='9') {
                    setLastMembershipFeeMonth(`Septiembre`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='10') {
                    setLastMembershipFeeMonth(`Octubre`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='11') {
                    setLastMembershipFeeMonth(`Noviembre`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                } else if(monthLastMembershipFeeDatee=='12') {
                    setLastMembershipFeeMonth(`Diciembre`);
                    mesActual=='1'&&setNextMembershipFeeDate('Enero');
                    mesActual=='2'&&setNextMembershipFeeDate('Febrero');
                    mesActual=='3'&&setNextMembershipFeeDate('Marzo');
                    mesActual=='4'&&setNextMembershipFeeDate('Abril');
                    mesActual=='5'&&setNextMembershipFeeDate('Mayo');
                    mesActual=='6'&&setNextMembershipFeeDate('Junio');
                    mesActual=='7'&&setNextMembershipFeeDate('Julio');
                    mesActual=='8'&&setNextMembershipFeeDate('Agosto');
                    mesActual=='9'&&setNextMembershipFeeDate('Septiembre');
                    mesActual=='10'&&setNextMembershipFeeDate('Octubre');
                    mesActual=='11'&&setNextMembershipFeeDate('Noviembre');
                    mesActual=='12'&&setNextMembershipFeeDate('Diciembre');
                }
            }
        } else {
            setIsMembershipFeeExpired(true)
        }
    },[lastMembershipFeeDate])
    
    const {deleteTicketModal,menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
    const {handleBtnBuyVisible} = useContext(BtnMPContext);
    
    //const [membershipFee, setMembershipFee] = useState('');

    

    

    //console.log(membershipFeeTickets)
   /*  if(membershipFee) {
    } */

    const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchPricesData() {
                const response = await fetch(`${apiUrl}/api/prices`)
                const pricesAll = await response.json();
                setPrices(pricesAll.data)
            }
            fetchPricesData();
            async function fetchTicketsData() {
                const response = await fetch(`${apiUrl}/api/tickets`)
                const ticketsAll = await response.json();
                setTickets(ticketsAll.data)
            }
            fetchTicketsData();
            async function fetchCompaniesData() {
                const response = await fetch(`${apiUrl}/api/companies`)
                const companiesAll = await response.json();
                setCompanies(companiesAll.data)
            }
            fetchCompaniesData();
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
        async function fetchPricesData() {
            const response = await fetch(`${apiUrl}/api/prices`)
            const pricesAll = await response.json();
            setPrices(pricesAll.data)
        }
        fetchPricesData();
        async function fetchTicketsData() {
            const response = await fetch(`${apiUrl}/api/tickets`)
            const ticketsAll = await response.json();
            setTickets(ticketsAll.data)
        }
        fetchTicketsData();
        async function fetchCompaniesData() {
            const response = await fetch(`${apiUrl}/api/companies`)
            const companiesAll = await response.json();
            setCompanies(companiesAll.data)
        }
        fetchCompaniesData();
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

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const pagarRegistroSocio = async () => {
        try {
            const order = {
                title: 'Cuota socio',
                unit_price: membershipFee,
                quantity: 1,
                first_name: inputFirstNamePa,
                last_name: inputLastNamePa,
                phone: inputPhonePa,
                email: inputEmailPa,
            }
            if(!inputFirstNamePa || !inputLastNamePa || !inputPhonePa || !inputEmailPa) {
                toast('Debes completar todos los campos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!validateEmail(inputEmailPa)) {
                toast('El email no es válido!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputFirstNamePa)) {
                toast('El campo nombre contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputLastNamePa)) {
                toast('El campo apellido contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputPhonePa)) {
                toast('El campo teléfono contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputEmailPa)) {
                toast('El campo email contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                const response = await fetch(`${apiUrl}/api/partners`)
                const res = await response.json();
                const partners = res.data;
                const partnerByEmailExists = partners.find(item => item.email === inputEmailPa)
                if(partnerByEmailExists) {
                    toast('Ya existe un socio con ese email!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                } else {  
                    const preference = await fetch(`${apiUrl}/api/payments/create-preference-partner`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(order)
                    })
                    const responsePref = await preference.json();
                    if(responsePref.id) {
                        document.getElementById('pagarCuotaSocioBtn').style.display = 'none';
                        const id = responsePref.id;
                        return id;
                    } else {
                        toast('Ha ocurrido un error al intentar pagar el turno, intente nuevamente', {
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
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handlePartnerPay = async (evt) => {
        evt.preventDefault();
        const id = await pagarRegistroSocio();
        if(id) {
            setPreferenceId(id);
            handleBtnBuyVisible(true);
        }
    };

    const pagarCuotaSocio = async () => {
        try {
            const order = {
                title: 'Cuota socio',
                unit_price: membershipFee,
                quantity: 1,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }
            if (!isValidUTF8(inputFirstNamePa)) {
                toast('El campo nombre contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputLastNamePa)) {
                toast('El campo apellido contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputPhonePa)) {
                toast('El campo teléfono contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputEmailPa)) {
                toast('El campo email contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                const preference = await fetch(`${apiUrl}/api/payments/create-preference-membership-fees`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                })
                const responsePref = await preference.json();
                if(responsePref.id) {
                    document.getElementById('btnPayMembershipFee').style.display = 'none';
                    const id = responsePref.id;
                    return id;
                } else {
                    toast('Ha ocurrido un error al intentar pagar el turno, intente nuevamente', {
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

        } catch (error) {
            console.log(error)
        }
    };

    const handleMembershipFeePay = async (evt) => {
        evt.preventDefault();
        const id = await pagarCuotaSocio();
        if(id) {
            setMembershipFeePreferenceId(id);
            handleBtnBuyVisible(true);
        }
    };

    const pagarCuotaSocioMobile = async () => {
        try {
            const order = {
                title: 'Cuota socio',
                unit_price: membershipFee,
                quantity: 1,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }
            if (!isValidUTF8(inputFirstNamePa)) {
                toast('El campo nombre contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputLastNamePa)) {
                toast('El campo apellido contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputPhonePa)) {
                toast('El campo teléfono contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else if (!isValidUTF8(inputEmailPa)) {
                toast('El campo email contiene caracteres no válidos', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                const preference = await fetch(`${apiUrl}/api/payments/create-preference-membership-fees-mobile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                })
                const responsePref = await preference.json();
                if(responsePref.id) {
                    document.getElementById('btnPayMembershipFeeMobile').style.display = 'none';
                    const id = responsePref.id;
                    return id;
                } else {
                    toast('Ha ocurrido un error al intentar pagar el turno, intente nuevamente', {
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

        } catch (error) {
            console.log(error)
        }
    };

    const handleMembershipFeePayMobile = async (evt) => {
        evt.preventDefault();
        const id = await pagarCuotaSocioMobile();
        if(id) {
            handleBtnMPModal(true);
            setMembershipFeeMobilePreferenceId(id);
            handleBtnBuyVisible(true);
        }
    };

    const loginToast = (event) => {
        event.preventDefault();
        toast('Debes iniciar sesión para registrarte como socio', {
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

    const handleBtnNonRegister = (event) => {
        event.preventDefault();
        toast('Contáctate con la peluquería para hacerte socio!', {
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

    
    const BtnMPModal = ({membershipFeeMobilePreferenceId,handleBtnMPModal}) => {

        const closeM = () => {
            handleBtnMPModal(false);
            document.getElementById('btnPayMembershipFeeMobile').style.display = 'block';
        }

      return (
        <div className='btnMPModalContainer'>
            <div className='btnMPModalContainer__btnCloseModal'>
                <div onClick={closeM}>x</div>
            </div>
            <div className='btnMPModalContainer__phrase'>Has click aquí para pagar la cuota!</div>
            {membershipFeeMobilePreferenceId && <Wallet initialization={{ preferenceId: membershipFeeMobilePreferenceId }} />} 
        </div>
      )
    }

  return (
      <>
            <NavBar/>
            {
                isLoggedIn && (user.role=='premium' || user.role=='user') && !user.isMembershipFeePaid?

                <>
                    <div className='partnersContainerIsLoggedIn'>
                        <div className='partnersContainerIsLoggedIn__userName'>
                            <h2 className='partnersContainerIsLoggedIn__userName__prop'>- Bienvenido/a, {user.first_name} -</h2>  
                        </div>
                        <h2 className='partnersContainerIsLoggedIn__phrase' style={{borderBottom:'0.3vh solid white'}}>Aún no eres socio/a en {company?company.name:'-'}</h2>
                        <h2 className='partnersContainerIsLoggedIn__phrase'>Registrate aquí mismo</h2>
                        <div className='partnersContainerIsLoggedIn__credentials'>
                            <div className='partnersContainerIsLoggedIn__credentials__label-input'>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__label'>
                                    <h2 className='partnersContainerIsLoggedIn__credentials__label-input__label__prop'>Nombre:</h2>
                                </div>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__input'>
                                    <input disabled className='partnersContainerIsLoggedIn__credentials__label-input__input__prop' placeholder='Nombre' value={inputFirstNamePa} onChange={handleInputFirstNamePa}/>
                                </div>
                            </div>
                            <div className='partnersContainerIsLoggedIn__credentials__label-input'>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__label'>
                                    <h2 className='partnersContainerIsLoggedIn__credentials__label-input__label__prop'>Apellido:</h2>
                                </div>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__input'>
                                    <input disabled className='partnersContainerIsLoggedIn__credentials__label-input__input__prop' placeholder='Apellido' value={inputLastNamePa} onChange={handleInputLastNamePa}/>
                                </div>
                            </div>
                            <div className='partnersContainerIsLoggedIn__credentials__label-input'>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__label'>
                                    <h2 className='partnersContainerIsLoggedIn__credentials__label-input__label__prop'>Teléfono:</h2>
                                </div>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__input'>
                                    <input disabled className='partnersContainerIsLoggedIn__credentials__label-input__input__prop' type='text' maxLength={13} placeholder='Teléfono' value={inputPhonePa} onChange={handleInputPhonePa}/>
                                </div>
                            </div>
                            <div className='partnersContainerIsLoggedIn__credentials__label-input'>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__label'>
                                    <h2 className='partnersContainerIsLoggedIn__credentials__label-input__label__prop'>Email:</h2>
                                </div>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__input'>
                                    <input disabled className='partnersContainerIsLoggedIn__credentials__label-input__input__prop' type='email' placeholder='Email' value={inputEmailPa} onChange={handleInputEmailPa}/>
                                </div>
                            </div>
                            <div className='partnersContainerIsLoggedIn__credentials__label-input'>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__label'>
                                    <h2 className='partnersContainerIsLoggedIn__credentials__label-input__label__prop'>Cuota:</h2>
                                </div>
                                <div className='partnersContainerIsLoggedIn__credentials__label-input__membershipFee'>
                                    <div className='partnersContainerIsLoggedIn__credentials__label-input__membershipFee__prop'>$ {membershipFees?membershipFees.value:'-'}</div>
                                </div>
                            </div>
                            <div className='partnersContainerIsLoggedIn__credentials__btn'>
                                <button id='pagarCuotaSocioBtn' className='partnersContainerIsLoggedIn__credentials__btn__propNonRegister' onClick={handleBtnNonRegister}>Aún no puedes registrarte</button>
                                {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />} 
                            </div> 
                        </div>
                    </div>
                    <LogOut/>
                </>
                :
                isLoggedIn && (user.role=='premium' || user.role=='user') && user.isMembershipFeePaid?
                <>
                    <div className='partnersContainerIsLoggedIn'>
                        <div className='partnersContainerIsLoggedIn__userName'>
                            <h2 className='partnersContainerIsLoggedIn__userName__prop'>- Bienvenido, {user.first_name} -</h2>  
                        </div>
                            {
                                !isMembershipFeeExpired?
                                <h2 className='partnersContainerIsLoggedIn__phrase' style={{borderBottom:'0.3vh solid white'}}>Ya eres socio/a en {company?company.name:'-'}</h2>
                                :
                                <h2 className='partnersContainerIsLoggedIn__phrase' style={{borderBottom:'0.3vh solid white'}}>Cuota de socio vencida!</h2>
                            }

                        <div className='partnersContainerIsLoggedIn__nextMembershipFeeMobile'>Próxima couta a pagar: {nextMembershipFeeDate}</div>

                        <div className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile'>

                            <div className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile__nextMembershipFee'>Próxima couta a pagar: {nextMembershipFeeDate}</div>

                            <div className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile__labels-btn'>

                                <div className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile__labels-btn__labels'>
                                    <div className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile__labels-btn__labels__prop'>Cuota socio: $ {membershipFees?membershipFees.value:'-'}</div>
                                </div>

                                <div className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile__labels-btn__btn'>
                                    {
                                            !deleteTicketModal?
                                            <>
                                                {/* <button id='btnPayMembershipFeeMobile' style={{width:'250px',backgroundColor:'#d2b569'}} className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile__labels-btn__btn__prop'>Aún no puedes pagar la cuota</button> */}
                                            </>
                                            :
                                            <>
                                                {/* <button id='btnPayMembershipFeeMobile' style={{width:'250px',backgroundColor:'#d2b569'}} className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile__labels-btn__btn__prop'>Aún no puedes pagar la cuota</button> */}
                                                {/* <div className='partnersContainerIsLoggedIn__payMembershipFeeContainerMobile__labels-btn__labels__prop'>Estas al día!</div> */}
                                            </>
                                    }
                                    {   
                                        btnMPModal && 
                                        <>
                                            <BtnMPModal handleBtnMPModal={handleBtnMPModal} membershipFeeMobilePreferenceId={membershipFeeMobilePreferenceId}/>
                                            <Spinner/>
                                        </>
                                    } 
                                </div>

                            </div>

                        </div>

                        <div className='partnersContainerIsLoggedIn__payMembershipFeeContainer'>

                            <div className='partnersContainerIsLoggedIn__payMembershipFeeContainer__nextMembershipFee'>Próxima couta a pagar: {nextMembershipFeeDate}</div>

                            <div className='partnersContainerIsLoggedIn__payMembershipFeeContainer__labels-btn'>
                                <div className='partnersContainerIsLoggedIn__payMembershipFeeContainer__labels-btn__labels'>
                                    <div className='partnersContainerIsLoggedIn__payMembershipFeeContainer__labels-btn__labels__prop'>Cuota socio: $ {membershipFees?membershipFees.value:'-'}</div>
                                </div>

                                <div className='partnersContainerIsLoggedIn__payMembershipFeeContainer__labels-btn__btn'>
                                    {

                                            !deleteTicketModal?
                                                <>
                                                    <button id='btnPayMembershipFee' style={{width:'250px',backgroundColor:'#d2b569',color:'black'}} className='partnersContainerIsLoggedIn__payMembershipFeeContainer__labels-btn__btn__prop'>Aún no puedes pagar la cuota</button>
                                                </>
                                                :
                                                <button id='btnPayMembershipFee' style={{width:'250px',backgroundColor:'#d2b569',color:'black'}} className='partnersContainerIsLoggedIn__payMembershipFeeContainer__labels-btn__btn__prop'>Aún no puedes pagar la cuota</button>
                                        
                                    }
                                    {membershipFeePreferenceId && <Wallet initialization={{ preferenceId: membershipFeePreferenceId }} />} 
                                </div>
                            </div>

                        </div>

                        {
                            ticketsByTypeByEmail.length==0?
                            <h2 className='partnersContainerIsLoggedIn__lastMembershipFee'>Última cuota paga: -</h2>
                            :
                            <h2 className='partnersContainerIsLoggedIn__lastMembershipFee'>Última cuota paga: {lastMembershipFeeMonth?lastMembershipFeeMonth:'-'}</h2>
                        }
                        {
                            ticketsByTypeByEmail.length!=0&&
                            <>
                                <div className='partnersContainerIsLoggedIn__lengthShifts'>
                                    <div className='partnersContainerIsLoggedIn__lengthShifts__prop'>Cantidad de cuotas de socios: {ticketsByTypeByEmail.length}</div>
                                </div>
                                <div className='partnersContainerIsLoggedIn__membershipFeedList'>
                                    <div className='partnersContainerIsLoggedIn__membershipFeedList__headerMobile'>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__headerMobile__label'>Tipo</div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__headerMobile__label'>Pago</div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__headerMobile__label'>Precio unitario</div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__headerMobile__label'>Fecha de pago</div>
                                    </div>
                                    <div className='partnersContainerIsLoggedIn__membershipFeedList__header'>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label'>
                                            <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label__prop'>Tipo</div>
                                        </div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label'>
                                            <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label__prop'>Pago</div>
                                        </div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label'>
                                            <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label__prop'>Precio unitario</div>
                                        </div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label'>
                                            <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label__prop'>Nombre</div>
                                        </div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label'>
                                            <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label__prop'>Apellido</div>  
                                        </div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label'>
                                            <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label__prop'>Email</div>
                                        </div>
                                        <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label'>
                                            <div className='partnersContainerIsLoggedIn__membershipFeedList__header__label__prop'>Fecha de pago</div>
                                        </div>
                                    </div>
                                    {
                                        ticketsByTypeByEmail.map((ticket) => {
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
                        }
                    </div>
                    {
                        (ticketsByTypeByEmail.length == 0) ?
                        <>
                            <div className='partnersContainerIsLoggedIn__blackDiv' style={{padding:'20vh 0vh'}}></div>
                            <div className='partnersContainerIsLoggedIn__blackDivMobile' style={{padding:'18vh 0vh'}}></div>
                        </>
                        : (ticketsByTypeByEmail.length == 1) ?
                        <>
                            <div className='partnersContainerIsLoggedIn__blackDiv' style={{padding:'10vh 0vh'}}></div>
                            <div className='partnersContainerIsLoggedIn__blackDivMobile' style={{padding:'8vh 0vh'}}></div>
                        </>
                        : (ticketsByTypeByEmail.length == 2) ?
                        <>
                            <div className='partnersContainerIsLoggedIn__blackDiv' style={{padding:'8vh 0vh'}}></div>
                            <div className='partnersContainerIsLoggedIn__blackDivMobile' style={{padding:'5vh 0vh'}}></div>
                        </>
                        : (ticketsByTypeByEmail.length == 3) ?
                        <>
                            <div className='partnersContainerIsLoggedIn__blackDiv' style={{padding:'4vh 0vh'}}></div>
                            <div className='partnersContainerIsLoggedIn__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                        </>
                        : (ticketsByTypeByEmail.length == 4) ?
                        <>
                            <div className='partnersContainerIsLoggedIn__blackDiv' style={{padding:'2vh 0vh'}}></div>
                        </>
                        : (ticketsByTypeByEmail.length == 5) ?
                        <>
                            <div className='partnersContainerIsLoggedIn__blackDiv' style={{padding:'0vh 0vh'}}></div>
                        </>
                        : (ticketsByTypeByEmail.length == 6) ?
                        <>
                            <div className='partnersContainerIsLoggedIn__blackDiv' style={{padding:'2vh 0vh'}}></div>
                        </>
                        : (ticketsByTypeByEmail.length == 7) &&
                        <>
                            <div className='partnersContainerIsLoggedIn__blackDiv' style={{padding:'0vh 0vh'}}></div>
                        </>
                    }
                    <LogOut/> 
                    </>
                :
                <>
                    <div className='warningLogin'>
                    <p className='warningLogin__prop'>Si aún no has iniciado sesión, <Link to={"/login"} className='warningLogin__link'>has click aquí</Link></p>
                    </div>
                    <div className='partnersContainer'>
                        <h2 className='partnersContainer__phrase'>Registrate aquí mismo</h2>
                        <div className='partnersContainer__credentials'>
                            <div className='partnersContainer__credentials__label-input'>
                                <div className='partnersContainer__credentials__label-input__label'>
                                    <h2 className='partnersContainer__credentials__label-input__label__prop'>Nombre:</h2>
                                </div>
                                <div className='partnersContainer__credentials__label-input__input'>
                                    <input disabled className='partnersContainer__credentials__label-input__input__prop' placeholder='Nombre' value={inputFirstNamePa} onChange={handleInputFirstNamePa}/>
                                </div>
                            </div>
                            <div className='partnersContainer__credentials__label-input'>
                                <div className='partnersContainer__credentials__label-input__label'>
                                    <h2 className='partnersContainer__credentials__label-input__label__prop'>Apellido:</h2>
                                </div>
                                <div className='partnersContainer__credentials__label-input__input'>
                                    <input disabled className='partnersContainer__credentials__label-input__input__prop' placeholder='Apellido' value={inputLastNamePa} onChange={handleInputLastNamePa}/>
                                </div>
                            </div>
                            <div className='partnersContainer__credentials__label-input'>
                                <div className='partnersContainer__credentials__label-input__label'>
                                    <h2 className='partnersContainer__credentials__label-input__label__prop'>Teléfono:</h2>
                                </div>
                                <div className='partnersContainer__credentials__label-input__input'>
                                    <input disabled className='partnersContainer__credentials__label-input__input__prop' type='text' maxLength={13} placeholder='Teléfono' value={inputPhonePa} onChange={handleInputPhonePa}/>
                                </div>
                            </div>
                            <div className='partnersContainer__credentials__label-input'>
                                <div className='partnersContainer__credentials__label-input__label'>
                                    <h2 className='partnersContainer__credentials__label-input__label__prop'>Email:</h2>
                                </div>
                                <div className='partnersContainer__credentials__label-input__input'>
                                    <input disabled className='partnersContainer__credentials__label-input__input__prop' type='email' placeholder='Email' value={inputEmailPa} onChange={handleInputEmailPa}/>
                                </div>
                            </div>
                            <div className='partnersContainer__credentials__label-input'>
                                <div className='partnersContainer__credentials__label-input__label'>
                                    <h2 className='partnersContainer__credentials__label-input__label__prop'>Cuota:</h2>
                                </div>
                                <div className='partnersContainer__credentials__label-input__membershipFee'>
                                    <div className='partnersContainer__credentials__label-input__membershipFee__prop'>$ </div>
                                </div>
                            </div>
                            <div className='partnersContainer__credentials__btn'>
                                <button id='pagarCuotaSocioBtn' className='partnersContainer__credentials__btn__prop' onClick={loginToast}>Registrarse</button>
                            </div> 
                        </div>
                    </div>
                </>
            }
        <Footer/>
    </>
  )
}

export default Partners
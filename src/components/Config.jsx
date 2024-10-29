import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import HMenu from './HMenu'
import { Link } from 'react-router-dom'
import LogOut from './LogOut';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import { toast } from 'react-toastify'
import Spinner from './Spinner'

const Config = () => {
  const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
  const [showSpinner, setShowSpinner] = useState(false);
  const [user, setUser] = useState('');
  const [hairdressers, setHairdressers] = useState([]);
  const [services, setServices] = useState([]);
  const [prices, setPrices] = useState([]);
  const [partnersBen, setPartnersBen] = useState([]);
  const [workDays, setWorkDays] = useState([]);

  const [companies, setCompanies] = useState([]);

  const workDaysByHairdresserWorkDay = []
  const {menuOptionsModal,handleMenuOptionsModal} = useContext(OpenModalContext);
  const apiUrl = import.meta.env.VITE_API_URL;
  //const selectPartnerNonPartner = ['No socio','Socio'];
  
  const [inputSaveCompany, setInputSaveCompany] = useState('');

  const [inputAddHairdresser, setInputAddHairdresser] = useState('');
  const [inputTitleService, setInputTitleService] = useState('');
  const [inputValueService, setInputValueService] = useState('');
  //const [selectCategoryService, setSelectCategoryService] = useState('');
  const [inputMembershipFee, setInputMembershipFee] = useState('');

  const [inputAddTitlePartnersBen, setInputAddTitlePartnersBen] = useState('');
  const [inputAddValuePartnersBen, setInputAddValuePartnersBen] = useState('');

  const [selectHairdressersWeekDays, setSelectHairdressersWeekDays] = useState('');
  const [selectDaysWeekDays, setSelectDaysWeekDays] = useState('');
  const [selectScheduleWeekDays, setSelectScheduleWeekDays] = useState('');
  const [inputCreateWeekDayH, setInputCreateWeekDayH] = useState('');
  const [inputCreateWeekDayM, setInputCreateWeekDayM] = useState('');
  const [inputCreateWeekDayOpen, setInputCreateWeekDayOpen] = useState(false);

  const [inputAddTitleVariouPrice, setInputAddTitleVariouPrice] = useState('');
  const [inputAddValueVariouPrice, setInputAddValueVariouPrice] = useState('');
  
  const [updateServiceBtnIsOpen, setUpdateServiceBtnIsOpen] = useState(false);
  const [updateInputMembershipFeeIsOpen, setUpdateInputMembershipFeeIsOpen] = useState(false);

  const [updateVariousPriceModal, setUpdateVariousPriceModal] = useState(false);

  const [updatePartnersBenModal, setUpdatePartnersBenModal] = useState(false);

  const [showWorkDaysList, setShowWorkDaysList] = useState(false);

    const workDaysByHairdresserWorkDayFiltered = workDays.filter(item => item.hairdresser == selectHairdressersWeekDays && item.work_day == selectDaysWeekDays)
    workDaysByHairdresserWorkDayFiltered.sort((a, b) => {
        const timeA = a.schedule.split(':').map(Number);
        const timeB = b.schedule.split(':').map(Number);
        const totalMinutesA = timeA[0] * 60 + timeA[1];
        const totalMinutesB = timeB[0] * 60 + timeB[1];
    
        return totalMinutesA - totalMinutesB;
    });
  
  const hairdressersOptionsSelect = ['Peluquero'];
  const hairdressersName = hairdressers.map(hairdresser => hairdresser.name)
  hairdressersName.forEach(item => {
    hairdressersOptionsSelect.push(item)
  })
  const weekDays = ['Día laboral','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo',]
  const schedulesWeekDays = [];

  const palabrasABuscar = ["cuota", "socio"];
  const membershipFee = prices.find(objeto => 
    palabrasABuscar.every(palabra => 
      objeto.title.toLowerCase().includes(palabra.toLowerCase())
    )
  );

  const pricesWithoutMembershipFee = prices.filter(price => price.title.toLowerCase() != 'cuota socio')
  
  /* const bens = [
    {
        title: 'Productos/Birra',
        value: '50'
    },
    {
        title: 'Barba',
        value: '80'
    },
    {
        title: 'Corte',
        value: '100'
    }
  ] */

  workDaysByHairdresserWorkDayFiltered.forEach(item => {
    workDaysByHairdresserWorkDay.push(`${item.schedule}`)
    schedulesWeekDays.push(`${item.schedule}`)
  }) 

  const [isMonted, setIsMonted] = useState(false);

    useEffect(() => {
        
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchHairdressersData() {
                const response = await fetch(`${apiUrl}/api/hairdressers`)
                const hairdressersAll = await response.json();
                setHairdressers(hairdressersAll.data)
            }
            fetchHairdressersData();
            async function fetchServicesData() {
                const response = await fetch(`${apiUrl}/api/services`)
                const servicesAll = await response.json();
                setServices(servicesAll.data)
            }
            fetchServicesData();
            async function fetchPricesData() {
                const response = await fetch(`${apiUrl}/api/prices`)
                const pricesAll = await response.json();
                setPrices(pricesAll.data)
            }
            fetchPricesData();
            async function fetchPartnersBenData() {
                const response = await fetch(`${apiUrl}/api/partnersBen`)
                const partnersBenAll = await response.json();
                setPartnersBen(partnersBenAll.data)
            }
            fetchPartnersBenData();
            async function fetchWorkDaysData() {
                const response = await fetch(`${apiUrl}/api/workDays`)
                const workDaysAll = await response.json();
                setWorkDays(workDaysAll.data)
            }
            fetchWorkDaysData();
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

        return () => clearInterval(interval); 
        
    }, [isMonted]);

    useEffect(() => {
        menuOptionsModal&&handleMenuOptionsModal(false);
        async function fetchHairdressersData() {
            const response = await fetch(`${apiUrl}/api/hairdressers`)
            const hairdressersAll = await response.json();
            setHairdressers(hairdressersAll.data)
        }
        fetchHairdressersData();
        async function fetchServicesData() {
            const response = await fetch(`${apiUrl}/api/services`)
            const servicesAll = await response.json();
            setServices(servicesAll.data)
        }
        fetchServicesData();
        async function fetchPricesData() {
            const response = await fetch(`${apiUrl}/api/prices`)
            const pricesAll = await response.json();
            setPrices(pricesAll.data)
        }
        fetchPricesData();
        async function fetchWorkDaysData() {
            const response = await fetch(`${apiUrl}/api/workDays`)
            const workDaysAll = await response.json();
            setWorkDays(workDaysAll.data)
        }
        fetchWorkDaysData();
        async function fetchPartnersBenData() {
            const response = await fetch(`${apiUrl}/api/partnersBen`)
            const partnersBenAll = await response.json();
            setPartnersBen(partnersBenAll.data)
        }
        fetchPartnersBenData();
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

    function regexOnlyLetters(str) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(str);
    }

    const cleanText = (text) => {
        const replacements = {
          'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
          'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
          'ñ': 'n', 'Ñ': 'N'
        };
      
        return text.split('').map(char => replacements[char] || char).join('');
    };

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    const handleInputSaveCompany = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputSaveCompany(textToSaved)
    }

    const handleInputAddHairdresser = (e) => {
      const texto = e.target.value;
      if(regexOnlyLetters(texto)) {
        const textToSaved = cleanText(texto);
        setInputAddHairdresser(textToSaved)
      }
    }

    const handleInputTitleService = (e) => {
      const texto = e.target.value;
      if(regexOnlyLetters(texto)) {
        const textToSaved = cleanText(texto);
        setInputTitleService(textToSaved)
      }
    }

    const handleInputValueService = (e) => {
        const texto = e.target.value;
        if (/^\d*$/.test(texto)) {
            setInputValueService(texto);
        }
    }

    /* const handleSelectCategoryService = (e) => {
        setSelectCategoryService(e)
    } */

    const handleInputMembershipFee = (e) => {
      const texto = e.target.value;
      setInputMembershipFee(texto)
    }

    const handleInputAddTitlePartnersBen = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputAddTitlePartnersBen(textToSaved)
    }

    const handleInputAddValuePartnersBen = (e) => {
        const texto = e.target.value;
        const regex = /^\d+$/;
        if (texto == '' || regex.test(texto)) {
            setInputAddValuePartnersBen(texto)
        }
    }

    const handleInputAddTitleVariouPrice = (e) => {
      const texto = e.target.value;
      if(regexOnlyLetters(texto)) {
        const textToSaved = cleanText(texto);
        setInputAddTitleVariouPrice(textToSaved)
      }
    }

    const handleInputAddValueVariouPrice = (e) => {
      const texto = e.target.value;
      if (/^\d*$/.test(texto)) {
        setInputAddValueVariouPrice(texto);
    }
    }

    const handleSelectHairdressersWeekDays = (e) => {
      setSelectHairdressersWeekDays(e)
    }

    const handleSelectDaysWeekDays = (e) => {
      setSelectDaysWeekDays(e)
    }

    const handleSelectScheduleWeekDays = (e) => {
      setSelectScheduleWeekDays(e)
    }


    const handleInputCreateWeekDayH = (e) => {
      const texto = e.target.value;
      const regex = /^(0?[0-9]|1[0-9]|2[0-3])$/;
      if (texto === '' || regex.test(texto)) {
        setInputCreateWeekDayH(texto)
      }
    }

    const handleInputCreateWeekDayM = (e) => {
      const texto = e.target.value;
      const regex = /^(0?[0-9]|[1-5][0-9])$/;
      if (texto === '' || regex.test(texto)) {
        setInputCreateWeekDayM(texto)
      }
    }

    const handleOnBlurInputCreateWeekDayH = (e) => {
      const texto = e.target.value;
      if(texto.length == 1) {
        setInputCreateWeekDayH(`0${texto}`)
      }
    }

    const handleOnBlurInputCreateWeekDayM = (e) => {
      const texto = e.target.value;
      if(texto.length == 1) {
        setInputCreateWeekDayM(`0${texto}`)
      }
    }

    const handleBtnAddHairdresser = async() => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const hairdresser_datetime = currentDate;

      if(inputAddHairdresser == '') {
        toast('Debes ingresar un peluquero', {
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
        const response = await fetch(`${apiUrl}/api/hairdressers/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name: cleanString(inputAddHairdresser), hairdresser_datetime })
        })
        const data = await response.json();
        if (response.ok) {
            toast('Has agregado un peluquero a la lista', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setTimeout(() => {
                setInputAddHairdresser('');
            }, 2500);
        } 
        if(data.error === 'There is already a hairdresser with that name') {
            toast('Ya existe un peluquero con ese nombre!', {
                position: "top-right",
                autoClose: 1500,
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

    const handleBtnSaveCompany = async() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        const company_datetime = currentDate;
  
        if(inputSaveCompany == '') {
          toast('Debes ingresar el nombre de tu empresa!', {
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
          const response = await fetch(`${apiUrl}/api/companies/register`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
              },
              body: JSON.stringify({ name: cleanString(inputSaveCompany), company_datetime })
          })
          //const data = await response.json();
          if (response.ok) {
              toast('Has guardado el nombre de tu empresa', {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              });
              setTimeout(() => {
                  setInputSaveCompany('');
              }, 2500);
          } 
          /* if(data.error === 'There is already a company with that name') {
              toast('Ya existe un peluquero con ese nombre!', {
                  position: "top-right",
                  autoClose: 1500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              });
          } */
        }
        
      }  

    const [idHairdresser, setIdHairdresser] = useState('');
    const [nameHairdresser, setNameHairdresser] = useState('');
    const [deleteHairdresserModal, setDeleteHairdresserModal] = useState(false);
    
    const [idCompany, setIdCompany] = useState('');
    const [nameCompany, setNameCompany] = useState('');
    const [deleteCompanyModal, setDeleteCompanyModal] = useState(false);

    const [idVariou, setIdVariou] = useState('');
    const [titleVariou, setTitleVariou] = useState('');
    const [deleteVariouModal, setDeleteVariouModal] = useState(false);

    const [idPartnerBen, setIdPartnerBen] = useState('');
    const [titlePartnerBen, setTitlePartnerBen] = useState('');
    const [deletePartnerBenModal, setDeletePartnerBenModal] = useState(false);

    const [deleteServiceModal, setDeleteServiceModal] = useState(false);

    const handleOpenModalBtnDeleteHairdresser = (id,hairdresser) => {
        setIdHairdresser(id)
        setNameHairdresser(hairdresser)
        setDeleteHairdresserModal(true)
    }

    const handleOpenModalBtnDeleteCompany = (id,company) => {
        setIdCompany(id)
        setNameCompany(company)
        setDeleteCompanyModal(true)
    }

    const handleOpenModalBtnDeleteService = (id,service) => {
        setIdService(id)
        setTitleService(service)
        setDeleteServiceModal(true)
    }

    const handleOpenModalBtnDeleteVariou = (id,titleVariou) => {
        setIdVariou(id)
        setTitleVariou(titleVariou)
        setDeleteVariouModal(true)
    }

    const handleOpenModalBtnDeletePartnersBen = (id,titlePartnerBen) => {
        setIdPartnerBen(id)
        setTitlePartnerBen(titlePartnerBen)
        setDeletePartnerBenModal(true)
    }

    const hanldeBtnAddService = async() => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const service_datetime = currentDate;

      if(inputTitleService == '' || inputValueService == '') {
        toast('Debes completar todos los campos!', {
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
        const obj = {
          title: cleanString(inputTitleService),
          value: inputValueService,
          service_datetime: service_datetime
        }
        const response = await fetch(`${apiUrl}/api/services/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        const data = await response.json();
        if (response.ok) {
            toast('Has agregado un servicio a la lista', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setTimeout(() => {
                setInputTitleService('');
                setInputValueService('');
            }, 2500);
        } else if(data.error === 'There is already a service with that title') {
            toast('Ya existe un servicio con ese nombre!', {
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
            toast('Ha ocurrido un error, intente nuevamente!', {
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

    const [idService,setIdService] = useState('')
    const [titleService,setTitleService] = useState('')
    const [valueService,setValueService] = useState('')
    
    const handleBtnOpenUpdateService = (id,title,value) => {
      setIdService(id)
      setTitleService(title)
      setValueService(value)
      setUpdateServiceBtnIsOpen(true)
    }

    const handleBtnSaveMembershipFee = async() => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const price_datetime = currentDate;

      if(inputMembershipFee == '') {
        toast('Debes ingresar el valor de la cuota de socio!', {
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
        const obj = {
          title: 'Cuota socio',
          value: inputMembershipFee,
          price_datetime: price_datetime
        }
        const response = await fetch(`${apiUrl}/api/prices/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        if (response.ok) {
          toast('Has guardado la cuota de socio correctamente', {
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

    const handleEditMembershipFee = () => {
      setUpdateInputMembershipFeeIsOpen(true);
      setInputMembershipFee(membershipFee.value)
    }

    const [idVariousPrice,setIdVariousPrice] = useState('')
    const [titleVariousPrice,setTitleVariousPrice] = useState('')
    const [valueVariousPrice,setValueVariousPrice] = useState('')

    const [idPartnersBen,setIdPartnersBen] = useState('')
    const [titlePartnersBen,setTitlePartnersBen] = useState('')
    const [valuePartnersBen,setValuePartnersBen] = useState('')

    const handleBtnOpenUpdateVariousPrice = (id,title,value) => {
      setIdVariousPrice(id)
      setTitleVariousPrice(title)
      setValueVariousPrice(value)
      setUpdateVariousPriceModal(true)
    }

    const handleBtnOpenUpdatePartnersBen = (id,title,value) => {
        setIdPartnersBen(id)
        setTitlePartnersBen(title)
        setValuePartnersBen(value)
        setUpdatePartnersBenModal(true)
    }

    const handleBtnAddPartnersBen = async() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        const partnersBen_datetime = currentDate;

        if(inputAddTitlePartnersBen == '' || inputAddValuePartnersBen == '') {
        toast('Debes completar todos los campos!', {
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
            const obj = {
                title: inputAddTitlePartnersBen,
                value: inputAddValuePartnersBen,
                partnersBen_datetime: partnersBen_datetime
            }
            const response = await fetch(`${apiUrl}/api/partnersBen/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(obj)
            })
            const data = await response.json();
            if (response.ok) {
                toast(`Has guardado correctamente`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    setInputAddTitlePartnersBen('');
                    setInputAddValuePartnersBen('');
                }, 2500);
            } else if(data.error === 'There is already a partnersBen with that title') {
                toast('Ya existe un documento guardado con ese título!', {
                    position: "top-right",
                    autoClose: 1500,
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

    const handleBtnAddVariouPrice = async() => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        const price_datetime = currentDate;

        if(inputAddTitleVariouPrice == '' || inputAddValueVariouPrice == '') {
        toast('Debes completar todos los campos!', {
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
            const obj = {
                title: inputAddTitleVariouPrice,
                value: inputAddValueVariouPrice,
                price_datetime: price_datetime
            }
            const response = await fetch(`${apiUrl}/api/prices/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(obj)
            })
            const data = await response.json();
            if (response.ok) {
                toast(`Has añadido el precio de ${inputAddTitleVariouPrice} correctamente`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    setInputAddTitleVariouPrice('');
                    setInputAddValueVariouPrice('');
                }, 2500);
            } else if(data.error === 'There is already a price with that title') {
                toast('Ya existe un documento guardado con ese título!', {
                    position: "top-right",
                    autoClose: 1500,
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

    const handleBtnCreateWeekDay = async() => {
      if(selectHairdressersWeekDays == '' || selectHairdressersWeekDays == 'Peluquero') {
        toast('Debes seleccionar un peluquero!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if(selectDaysWeekDays == '' || selectDaysWeekDays == 'Día laboral') {
        toast('Debes seleccionar un día!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if(inputCreateWeekDayH == '' || inputCreateWeekDayM == '') {
        toast('Debes ingresar el horario!', {
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
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
        const workDay_datetime = currentDate;
        const concatSchedulesWorkDays = inputCreateWeekDayH + ':' + inputCreateWeekDayM
        const obj = {
          hairdresser: selectHairdressersWeekDays,
          work_day: selectDaysWeekDays,
          schedule: concatSchedulesWorkDays,
          workDay_datetime: workDay_datetime
        }
        const response = await fetch(`${apiUrl}/api/workDays/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        const data = await response.json();
        if (response.ok) {
            toast(`Has guardado correctamente el horario ${concatSchedulesWorkDays} el día ${selectDaysWeekDays} del peluquero ${selectHairdressersWeekDays}`, {
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
        if(data.error === 'There is already a workDay with that data') {
            toast('El peluquero, día y horario ya existen!', {
                position: "top-right",
                autoClose: 1500,
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

    const handleBtnUpdateMembershipFee = async(id) => {

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      const price_datetime = currentDate;

      if(inputMembershipFee == '') {
        toast('Debes ingresar el valor de la cuota de socio!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if(inputMembershipFee == membershipFee.value) {
        toast('No tienes cambios para actualizar!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
            setUpdateInputMembershipFeeIsOpen(false)
        }, 2500);
      } else {
        const obj = {
          title: 'Cuota socio',
          value: inputMembershipFee,
          price_datetime: price_datetime
        }
        const response = await fetch(`${apiUrl}/api/prices/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        })
        if (response.ok) {
            toast('Has actualizado la cuota de socio correctamente', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setUpdateInputMembershipFeeIsOpen(false)
        } 
      }
      
    }            

    
    const handleBtnDeleteScheduleWorkDay = async(id) => {
        const response = await fetch(`${apiUrl}/api/workDays/${id}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            toast('Has eliminado el horario correctamente', {
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

    
    const DeleteCompanyModal = ({id,company,setDeleteCompanyModal}) => {

        const handleBtnDeleteCompany = async() => {
            setShowSpinner(true)
            const response = await fetch(`${apiUrl}/api/companies/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                toast('Has eliminado el nombre de tu empresa correctamente', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    setShowSpinner(false)
                    setDeleteCompanyModal(false)
                }, 2500);
            } 
        }

        const handleBtnNonDeleteCompany = () => {
            setDeleteCompanyModal(false)
        }

      return (
        <>
            <div className='confirmationDeleteBtnCompanyModalContainer'>
                <div className='confirmationDeleteBtnCompanyModalContainer__ask'>¿Estás seguro que deseas borrar el nombre de tu empresa "{company}"?</div>
                <div className='confirmationDeleteBtnCompanyModalContainer__askMobile'>
                    <div className='confirmationDeleteBtnCompanyModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar el nombre de tu empresa "{company}"?</div>
                </div>
                <div className='confirmationDeleteBtnCompanyModalContainer__btnsContainer'>
                    <div className='confirmationDeleteBtnCompanyModalContainer__btnsContainer__btns'>
                        {
                            !showSpinner?                            
                            <button onClick={handleBtnDeleteCompany} className='confirmationDeleteBtnCompanyModalContainer__btnsContainer__btns__prop'>Si</button>
                            :
                            <Spinner/>
                        }
                    </div>
                    <div className='confirmationDeleteBtnCompanyModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnNonDeleteCompany} className='confirmationDeleteBtnCompanyModalContainer__btnsContainer__btns__prop'>No</button>
                    </div>
                </div>
            </div>
        </>
      )
    }
    
    const DeleteHairdresserModal = ({id,hairdresser,setDeleteHairdresserModal}) => {

        const handleBtnDeleteHairdresser = async() => {
            setShowSpinner(true)
            const response = await fetch(`${apiUrl}/api/hairdressers/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                toast('Has eliminado el peluquero correctamente', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    setShowSpinner(false)
                    setDeleteHairdresserModal(false)
                }, 2500);
            } 
        }

        const handleBtnNonDeleteHairdresser = () => {
            setDeleteHairdresserModal(false)
        }

      return (
        <>
            <div className='confirmationDeleteBtnHairdresserModalContainer'>
                <div className='confirmationDeleteBtnHairdresserModalContainer__ask'>¿Estás seguro que deseas borrar el peluquero {hairdresser}?</div>
                <div className='confirmationDeleteBtnHairdresserModalContainer__askMobile'>
                    <div className='confirmationDeleteBtnHairdresserModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar el peluquero {hairdresser}?</div>
                </div>
                <div className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer'>
                    <div className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer__btns'>
                        {
                            !showSpinner?                            
                            <button onClick={handleBtnDeleteHairdresser} className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer__btns__prop'>Si</button>
                            :
                            <Spinner/>
                        }
                    </div>
                    <div className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnNonDeleteHairdresser} className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer__btns__prop'>No</button>
                    </div>
                </div>
            </div>
        </>
      )
    }

    const DeleteServiceModal = ({id,service,setDeleteServiceModal}) => {

        const handleBtnDeleteService = async() => {
            setShowSpinner(true)
            const response = await fetch(`${apiUrl}/api/services/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                toast('Has eliminado el servicio correctamente', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    setShowSpinner(false)
                    setDeleteServiceModal(false)
                }, 2500);
            } 
        }

        const handleBtnNonDeleteService = () => {
            setDeleteServiceModal(false)
        }

      return (
        <>
            <div className='confirmationDeleteBtnHairdresserModalContainer'>
                <div className='confirmationDeleteBtnHairdresserModalContainer__ask'>¿Estás seguro que deseas borrar el servicio "{service}"?</div>
                <div className='confirmationDeleteBtnHairdresserModalContainer__askMobile'>
                    <div className='confirmationDeleteBtnHairdresserModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar el servicio "{service}"?</div>
                </div>
                <div className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer'>
                    <div className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer__btns'>
                        {
                            !showSpinner?                            
                            <button onClick={handleBtnDeleteService} className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer__btns__prop'>Si</button>
                            :
                            <Spinner/>
                        }
                    </div>
                    <div className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnNonDeleteService} className='confirmationDeleteBtnHairdresserModalContainer__btnsContainer__btns__prop'>No</button>
                    </div>
                </div>
            </div>
        </>
      )
    }

    const DeleteVariouModal = ({id,variou,setDeleteVariouModal}) => {

        const handleBtnDeleteVariou = async() => {
            setShowSpinner(true)
            const response = await fetch(`${apiUrl}/api/prices/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                toast('Has eliminado el item correctamente', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    setShowSpinner(false)
                    setDeleteVariouModal(false)
                }, 2500);
            } 
        }

        const handleBtnNonDeleteVariou = () => {
            setDeleteVariouModal(false)
        }

      return (
        <>
            <div className='confirmationDeleteBtnVariouModalContainer'>
                <div className='confirmationDeleteBtnVariouModalContainer__ask'>¿Estás seguro que deseas borrar el item "{variou}"?</div>
                <div className='confirmationDeleteBtnVariouModalContainer__askMobile'>
                    <div className='confirmationDeleteBtnVariouModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar el item "{variou}"?</div>
                </div>
                <div className='confirmationDeleteBtnVariouModalContainer__btnsContainer'>
                    <div className='confirmationDeleteBtnVariouModalContainer__btnsContainer__btns'>
                        {
                            !showSpinner?                            
                            <button onClick={handleBtnDeleteVariou} className='confirmationDeleteBtnVariouModalContainer__btnsContainer__btns__prop'>Si</button>
                            :
                            <Spinner/>
                        }
                    </div>
                    <div className='confirmationDeleteBtnVariouModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnNonDeleteVariou} className='confirmationDeleteBtnVariouModalContainer__btnsContainer__btns__prop'>No</button>
                    </div>
                </div>
            </div>
        </>
      )
    }

    const DeletePartnerBenModal = ({id,partnerBen,setDeletePartnerBenModal}) => {

        const handleBtnDeletePartnerBen = async() => {
            setShowSpinner(true)
            const response = await fetch(`${apiUrl}/api/partnersBen/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                toast('Has eliminado el item correctamente', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    setShowSpinner(false)
                    setDeletePartnerBenModal(false)
                }, 2500);
            } 
        }

        const handleBtnNonDeletePartnerBen = () => {
            setDeletePartnerBenModal(false)
        }

      return (
        <>
            <div className='confirmationDeleteBtnVariouModalContainer'>
                <div className='confirmationDeleteBtnVariouModalContainer__ask'>¿Estás seguro que deseas borrar el item "{partnerBen}"?</div>
                <div className='confirmationDeleteBtnVariouModalContainer__askMobile'>
                    <div className='confirmationDeleteBtnVariouModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar el item "{partnerBen}"?</div>
                </div>
                <div className='confirmationDeleteBtnVariouModalContainer__btnsContainer'>
                    <div className='confirmationDeleteBtnVariouModalContainer__btnsContainer__btns'>
                        {
                            !showSpinner?                            
                            <button onClick={handleBtnDeletePartnerBen} className='confirmationDeleteBtnVariouModalContainer__btnsContainer__btns__prop'>Si</button>
                            :
                            <Spinner/>
                        }
                    </div>
                    <div className='confirmationDeleteBtnVariouModalContainer__btnsContainer__btns'>
                        <button onClick={handleBtnNonDeletePartnerBen} className='confirmationDeleteBtnVariouModalContainer__btnsContainer__btns__prop'>No</button>
                    </div>
                </div>
            </div>
        </>
      )
    }
    

    
    const UpdateServiceModal = ({setUpdateServiceBtnIsOpen,id,title,value}) => {

        const cleanText = (text) => {
            const replacements = {
              'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
              'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
              'ñ': 'n', 'Ñ': 'N'
            };
          
            return text.split('').map(char => replacements[char] || char).join('');
        };

        const [inputTitleUpdateService,setInputTitleUpdateService] = useState('')
        const [inputValueUpdateService,setInputValueUpdateService] = useState('')

        const handleBtnCloseModal = () => {
            setUpdateServiceBtnIsOpen(false)
        }

        useEffect(()=>{
            setInputTitleUpdateService(`${title}`)
            setInputValueUpdateService(`${value}`)
        },[])

        const handleBtnUpdateServiceValue = async() => {
            if((inputTitleUpdateService == '' || inputTitleUpdateService == title) && (inputValueUpdateService == '' || inputValueUpdateService == value)) {
            toast('No tienes cambios para actualizar!', {
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
            const obj = {
                title: inputTitleUpdateService?inputTitleUpdateService:title,
                value: inputValueUpdateService?inputValueUpdateService:value,
            }
            const response = await fetch(`${apiUrl}/api/services/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(obj)
            })
            if (response.ok) {
                toast('Has actualizado el servicio correctamente', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setUpdateServiceBtnIsOpen(false)
            } 
            const data = await response.json();
            if(data.error === 'There is already a service with that title') {
                toast('Ya existe un servicio con ese nombre y categoría!', {
                    position: "top-right",
                    autoClose: 1500,
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

      const handleInputTitleUpdateService = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputTitleUpdateService(textToSaved)
      }

      const handleInputValueUpdateService = (e) => {
        const texto = e.target.value;
        if (/^\d*$/.test(texto)) {
            setInputValueUpdateService(texto)
        } 
      }


      return (
        <div className='updateServiceModal'>
            <div className='updateServiceModal__btnCloseModal'>
                <div onClick={handleBtnCloseModal} className='updateServiceModal__btnCloseModal__prop'>X</div>
            </div>
            <div className='updateServiceModal__data'>
                <div className='updateServiceModal__data__label-input'>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputTitleUpdateService} onChange={handleInputTitleUpdateService} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputValueUpdateService} onChange={handleInputValueUpdateService} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                </div>
            </div>
            <div className='updateServiceModal__btn'>
                <button onClick={handleBtnUpdateServiceValue} className='updateServiceModal__btn__prop'>Guardar</button>
            </div>
        </div>
        
      )
    }

    const UpdateVariousPriceModal = ({setUpdateVariousPriceModal,id,title,value}) => {

      const [inputUpdateTitleVariousPrice,setInputUpdateTitleVariousPrice] = useState('')
      const [inputUpdateValueVariousPrice,setInputUpdateValueVariousPrice] = useState('')

      const handleBtnCloseModal = () => {
        setUpdateVariousPriceModal(false)
      }

      const handleBtnUpdateServiceValue = async() => {
        if((inputUpdateTitleVariousPrice == '' || inputUpdateTitleVariousPrice == title) && (inputUpdateValueVariousPrice == '' || inputUpdateValueVariousPrice == value)) {
          toast('No tienes cambios para actualizar!', {
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
          const obj = {
            title: inputUpdateTitleVariousPrice?inputUpdateTitleVariousPrice:title,
            value: inputUpdateValueVariousPrice?inputUpdateValueVariousPrice:value,
          }
          const response = await fetch(`${apiUrl}/api/prices/${id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
              },
              body: JSON.stringify(obj)
          })
          if (response.ok) {
              toast(`Has actualizado el precio de ${title} correctamente`, {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
              });
              setUpdateVariousPriceModal(false)
          } 
          const data = await response.json();
          if(data.error === 'There is already a price with that title') {
              toast('Ya existe un precio con ese nombre!', {
                  position: "top-right",
                  autoClose: 1500,
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

      const handleInputTitleUpdateService = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputUpdateTitleVariousPrice(textToSaved)
      }

      const handleInputValueUpdateService = (e) => {
        const texto = e.target.value;
        if (/^\d*$/.test(texto)) {
            setInputUpdateValueVariousPrice(texto)
        } 
      }

      return (
        <div className='updateServiceModal'>
            <div className='updateServiceModal__btnCloseModal'>
                <div onClick={handleBtnCloseModal} className='updateServiceModal__btnCloseModal__prop'>X</div>
            </div>
            <div className='updateServiceModal__data'>
                <div className='updateServiceModal__data__label-input'>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputUpdateTitleVariousPrice?inputUpdateTitleVariousPrice:title} onChange={handleInputTitleUpdateService} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputUpdateValueVariousPrice?inputUpdateValueVariousPrice:value} onChange={handleInputValueUpdateService} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                </div>
            </div>
            <div className='updateServiceModal__btn'>
                <button onClick={handleBtnUpdateServiceValue} className='updateServiceModal__btn__prop'>Guardar</button>
            </div>
        </div>
        
      )
    }

    const UpdatePartnersBenModal = ({setUpdatePartnersBenModal,id,title,value}) => {

        const [inputUpdateTitlePartnersBen,setInputUpdateTitlePartnersBen] = useState('')
        const [inputUpdateValuePartnersBen,setInputUpdateValuePartnersBen] = useState('')

        const handleBtnCloseModal = () => {
            setUpdatePartnersBenModal(false)
        }

        const handleBtnUpdatePartnersBen = async() => {
            if((inputUpdateTitlePartnersBen == '' || inputUpdateTitlePartnersBen == title) && (inputUpdateValuePartnersBen == '' || inputUpdateValuePartnersBen == value)) {
            toast('No tienes cambios para actualizar!', {
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
            const obj = {
                title: inputUpdateTitlePartnersBen?inputUpdateTitlePartnersBen:title,
                value: inputUpdateValuePartnersBen?inputUpdateValuePartnersBen:value,
            }
            const response = await fetch(`${apiUrl}/api/partnersBen/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(obj)
            })
            if (response.ok) {
                toast(`Has actualizado el precio de ${title} correctamente`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setUpdatePartnersBenModal(false)
            } 
            const data = await response.json();
            if(data.error === 'There is already a partnersBen with that title') {
                toast('Ya existe un item con ese nombre!', {
                    position: "top-right",
                    autoClose: 1500,
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

      const handleInputTitleUpdatePartnersBen = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputUpdateTitlePartnersBen(textToSaved)
      }

      const handleInputValueUpdatePartnersBen = (e) => {
        const texto = e.target.value;
        if (/^\d*$/.test(texto)) {
            setInputUpdateValuePartnersBen(texto)
        } 
      }

      return (
        <div className='updateServiceModal'>
            <div className='updateServiceModal__btnCloseModal'>
                <div onClick={handleBtnCloseModal} className='updateServiceModal__btnCloseModal__prop'>X</div>
            </div>
            <div className='updateServiceModal__data'>
                <div className='updateServiceModal__data__label-input'>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputUpdateTitlePartnersBen?inputUpdateTitlePartnersBen:title} onChange={handleInputTitleUpdatePartnersBen} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                    <div className='updateServiceModal__data__label-input__input'>
                        <input value={inputUpdateValuePartnersBen?inputUpdateValuePartnersBen:value} onChange={handleInputValueUpdatePartnersBen} className='updateServiceModal__data__label-input__input__prop' type="text" />
                    </div>
                </div>
            </div>
            <div className='updateServiceModal__btn'>
                <button onClick={handleBtnUpdatePartnersBen} className='updateServiceModal__btn__prop'>Guardar</button>
            </div>
        </div>
        
      )
    }
    
    

  return (
    <>
        <NavBar/>
        {
          isLoggedIn && user.role=='admin'?
          <>
            <div className='configContainer'>
                <div className='configContainer__config'>

                    <div className='configContainer__config__title'>Configuración</div>

                    <div className='configContainer__config__company'>
                        <div className='configContainer__config__company__prop'>Empresa:</div>
                    </div>
                    {
                        companies.length == 0 &&
                        <div className='configContainer__config__addCompany'>
                            <div className='configContainer__config__addCompany__addCompanyContainer'>
                                <div className='configContainer__config__addCompany__addCompanyContainer__input'>
                                    <input value={inputSaveCompany} onChange={handleInputSaveCompany} placeholder='nombre empresa' type="text" className='configContainer__config__addCompany__addCompanyContainer__input__prop' />
                                </div>
                                <div className='configContainer__config__addCompany__addCompanyContainer__btn'>
                                    <button onClick={handleBtnSaveCompany} className='configContainer__config__addCompany__addCompanyContainer__btn__prop'>Guardar</button>
                                </div>
                            </div>
                        </div>
                    }
                    
                    <div className='configContainer__config__companiesList'>
                        {
                            companies.length == 0 ?
                            <div style={{color:'black'}}>Aún no has guardado ningún nombre</div>
                            :

                            companies.map((company) => {
                            return(
                                <>
                                        <div className='configContainer__config__companiesList__item'>
                                            <div className='configContainer__config__companiesList__item__label'>
                                                <div className='configContainer__config__companiesList__item__label__prop'>{company.name}</div>
                                            </div>
                                            <div className='configContainer__config__companiesList__item__btn'>
                                                <button onClick={()=>{handleOpenModalBtnDeleteCompany(company._id,company.name)}} className='configContainer__config__companiesList__item__btn__prop'>Borrar</button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>

                    <div className='configContainer__config__hairdresser'>
                        <div className='configContainer__config__hairdresser__prop'>Peluqueros:</div>
                    </div>
                    <div className='configContainer__config__addHairdresser'>
                        <div className='configContainer__config__addHairdresser__addHairdresserContainer'>
                            <div className='configContainer__config__addHairdresser__addHairdresserContainer__input'>
                                <input value={inputAddHairdresser} onChange={handleInputAddHairdresser} placeholder='ingrese peluquero' type="text" className='configContainer__config__addHairdresser__addHairdresserContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addHairdresser__addHairdresserContainer__btn'>
                                <button onClick={handleBtnAddHairdresser} className='configContainer__config__addHairdresser__addHairdresserContainer__btn__prop'>Añadir</button>
                            </div>
                        </div>
                    </div>
                    <div className='configContainer__config__hairdressersList'>
                      {
                        hairdressers.length != 0 &&
                        <div className='configContainer__config__hairdressersList__titleList'>- Lista de peluqueros -</div>
                      }
                        {

                          hairdressers.length == 0 ?
                            <div style={{color:'black'}}>Aún no existen peluqueros</div>
                          :
                          
                          hairdressers.map((hairdresser) => {
                            return(
                              <>
                                        <div className='configContainer__config__hairdressersList__item'>
                                            <div className='configContainer__config__hairdressersList__item__label'>
                                                <div className='configContainer__config__hairdressersList__item__label__prop'>{hairdresser.name}</div>
                                            </div>
                                            <div className='configContainer__config__hairdressersList__item__btn'>
                                                <button onClick={()=>{handleOpenModalBtnDeleteHairdresser(hairdresser._id,hairdresser.name)}} className='configContainer__config__hairdressersList__item__btn__prop'>Borrar</button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                    </div>

                    <div className='configContainer__config__services'>
                        <div className='configContainer__config__services__prop'>Servicios:</div>
                    </div>
                    <div className='configContainer__config__addService'>
                        <div className='configContainer__config__addService__addServiceContainer'>
                            <div className='configContainer__config__addService__addServiceContainer__input'>
                                <input value={inputTitleService} onChange={handleInputTitleService} placeholder='ingrese servicio' type="text" className='configContainer__config__addService__addServiceContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addService__addServiceContainer__input'>
                                <input value={inputValueService} onChange={handleInputValueService} placeholder='ingrese valor' type="text" className='configContainer__config__addService__addServiceContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addService__addServiceContainer__inputMobile'>
                                <input value={inputTitleService} onChange={handleInputTitleService} placeholder='servicio' type="text" className='configContainer__config__addService__addServiceContainer__inputMobile__prop' />
                            </div>
                            <div className='configContainer__config__addService__addServiceContainer__inputMobile'>
                                <input value={inputValueService} onChange={handleInputValueService} placeholder='valor' type="text" className='configContainer__config__addService__addServiceContainer__inputMobile__prop' />
                            </div>

                            {/* <div className='configContainer__config__addService__addServiceContainer__select'>
                                <select className='configContainer__config__addService__addServiceContainer__select__prop'  value={selectCategoryService} onChange={(e) => {handleSelectCategoryService(e.target.value)}}>
                                    {selectPartnerNonPartner.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div> */}

                            <div className='configContainer__config__addService__addServiceContainer__btn'>
                                <button onClick={hanldeBtnAddService} className='configContainer__config__addService__addServiceContainer__btn__prop'>Añadir</button>
                            </div>
                        </div>
                    </div>


                    <div className='configContainer__config__servicesList'>


                        <div className='configContainer__config__servicesList__titleList'>- Lista de servicios -</div>
                        {
                            services.length == 0 ?
                            <div style={{color:'black'}}>Aún no existen servicios</div>
                            :
                            services.map((service) => {
                                return(
                                    <>
                                        <div className='configContainer__config__servicesList__item'>
                                            <div className='configContainer__config__servicesList__item__label'>
                                                <div className='configContainer__config__servicesList__item__label__prop'>{service.title}</div>
                                            </div>
                                            <div className='configContainer__config__servicesList__item__label'>
                                                <div className='configContainer__config__servicesList__item__label__prop'>$ {service.value}</div>
                                            </div>
                                            <div className='configContainer__config__servicesList__item__btn'>
                                                <button onClick={()=>{handleBtnOpenUpdateService(service._id,service.title,service.value)}} className='configContainer__config__servicesList__item__btn__prop'>Editar</button>
                                                <button onClick={()=>{handleOpenModalBtnDeleteService(service._id,service.title)}} className='configContainer__config__servicesList__item__btn__prop'>Borrar</button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                        
                    </div>



                    <div className='configContainer__config__membershipFee'>
                        <div className='configContainer__config__membershipFee__prop'>Cuota socio:</div>
                    </div>

                    <div className='configContainer__config__membershipFeeList__item'>

                      <div className='configContainer__config__membershipFeeList__item__label'>
                          <div className='configContainer__config__membershipFeeList__item__label__prop'>Cuota socio:</div>
                      </div>

                      <div className='configContainer__config__membershipFeeList__item__label'>
                        {
                          membershipFee&&!updateInputMembershipFeeIsOpen?
                          <div className='configContainer__config__membershipFeeList__item__label__prop'>$ {membershipFee?membershipFee.value:''}</div>
                          :
                          <>
                            <input className='configContainer__config__membershipFeeList__item__label__input' placeholder='ingrese valor cuota' value={inputMembershipFee} onChange={handleInputMembershipFee} type="text" />
                            <input className='configContainer__config__membershipFeeList__item__label__inputMobile' placeholder='valor cuota' value={inputMembershipFee} onChange={handleInputMembershipFee} type="text" />
                          </>
                        }
                      </div>

                      <div className='configContainer__config__membershipFeeList__item__btn'>
                        {
                          !membershipFee?
                          <button onClick={handleBtnSaveMembershipFee} className='configContainer__config__membershipFeeList__item__btn__prop'>Guardar</button>
                          :
                          <>
                          {
                            updateInputMembershipFeeIsOpen?
                            <>
                            <button onClick={()=>{handleBtnUpdateMembershipFee(membershipFee._id)}} className='configContainer__config__membershipFeeList__item__btn__prop'>Guardar</button>
                            <button onClick={()=>setUpdateInputMembershipFeeIsOpen(false)} className='configContainer__config__membershipFeeList__item__btn__prop'>Cancelar</button>
                            </>
                            :
                            <button onClick={handleEditMembershipFee} className='configContainer__config__membershipFeeList__item__btn__prop'>Editar</button>
                          }
                          </>
                        }
                      </div>

                    </div>
                    <div className='configContainer__config__partners'>
                        <div className='configContainer__config__partners__prop'>Socios:</div>
                    </div>
                    <div className='configContainer__config__addPartnersBen'>
                        <div className='configContainer__config__addPartnersBen__addPartnersBenContainer'>
                            <div className='configContainer__config__addPartnersBen__addPartnersBenContainer__input'>
                                <input value={inputAddTitlePartnersBen} onChange={handleInputAddTitlePartnersBen} placeholder='ingrese algo' type="text" className='configContainer__config__addPartnersBen__addPartnersBenContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addPartnersBen__addPartnersBenContainer__input'>
                                <input value={inputAddValuePartnersBen} onChange={handleInputAddValuePartnersBen} placeholder='ingrese puntos' type="text" className='configContainer__config__addPartnersBen__addPartnersBenContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addPartnersBen__addPartnersBenContainer__btn'>
                                <button onClick={handleBtnAddPartnersBen} className='configContainer__config__addPartnersBen__addPartnersBenContainer__btn__prop'>Añadir</button>
                            </div>
                        </div>
                    </div>

                    <div className='configContainer__config__partnersBenList'>
                        {
                          partnersBen.length != 0 &&
                          <div className='configContainer__config__partnersBenList__titleList'>- Socios -</div>
                        }
                        {
                            partnersBen.length == 0 ?
                            <div style={{color:'black'}}>Aún no has guardado nada</div>
                            :
                            partnersBen.map((item) => {
                            return(
                                <>
                                    <div className='configContainer__config__partnersBenList__item'>
                                        <div className='configContainer__config__partnersBenList__item__label'>
                                            <div className='configContainer__config__partnersBenList__item__label__prop'>{item.title}</div>
                                        </div>
                                        <div className='configContainer__config__partnersBenList__item__label'>
                                            <div className='configContainer__config__partnersBenList__item__label__prop'>{item.value} pts.</div>
                                        </div>
                                        <div className='configContainer__config__partnersBenList__item__btn'>
                                            <button onClick={()=>{handleBtnOpenUpdatePartnersBen(item._id,item.title,item.value)}} className='configContainer__config__partnersBenList__item__btn__prop'>Editar</button>
                                            <button onClick={()=>{handleOpenModalBtnDeletePartnersBen(item._id,item.title)}} className='configContainer__config__partnersBenList__item__btn__prop'>Borrar</button>
                                        </div>
                                    </div>
                                </>
                                )
                              })
                        }
                    </div>

                    <div className='configContainer__config__various'>
                        <div className='configContainer__config__various__prop'>Varios:</div>
                    </div>
                    <div className='configContainer__config__addVarious'>
                        <div className='configContainer__config__addVarious__addVariousContainer'>
                            <div className='configContainer__config__addVarious__addVariousContainer__input'>
                                <input value={inputAddTitleVariouPrice} onChange={handleInputAddTitleVariouPrice} placeholder='ingrese algo' type="text" className='configContainer__config__addVarious__addVariousContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addVarious__addVariousContainer__input'>
                                <input value={inputAddValueVariouPrice} onChange={handleInputAddValueVariouPrice} placeholder='ingrese valor' type="text" className='configContainer__config__addVarious__addVariousContainer__input__prop' />
                            </div>
                            <div className='configContainer__config__addVarious__addVariousContainer__btn'>
                                <button onClick={handleBtnAddVariouPrice} className='configContainer__config__addVarious__addVariousContainer__btn__prop'>Añadir</button>
                            </div>
                        </div>
                    </div>

                    <div className='configContainer__config__variousList'>
                        {
                          pricesWithoutMembershipFee.length != 0 &&
                          <div className='configContainer__config__variousList__titleList'>- Varios -</div>
                        }
                        {
                            pricesWithoutMembershipFee.length == 0 ?
                            <div style={{color:'black'}}>Aún no has guardado nada</div>
                            :
                          pricesWithoutMembershipFee.map((item) => {
                            return(
                                <>
                                    <div className='configContainer__config__variousList__item'>
                                        <div className='configContainer__config__variousList__item__label'>
                                            <div className='configContainer__config__variousList__item__label__prop'>{item.title}</div>
                                        </div>
                                        <div className='configContainer__config__variousList__item__label'>
                                            <div className='configContainer__config__variousList__item__label__prop'>$ {item.value}</div>
                                        </div>
                                        <div className='configContainer__config__variousList__item__btn'>
                                            <button onClick={()=>{handleBtnOpenUpdateVariousPrice(item._id,item.title,item.value)}} className='configContainer__config__variousList__item__btn__prop'>Editar</button>
                                            <button onClick={()=>{handleOpenModalBtnDeleteVariou(item._id,item.title)}} className='configContainer__config__variousList__item__btn__prop'>Borrar</button>
                                        </div>
                                    </div>
                                </>
                                )
                              })
                        }
                    </div>


                    <div className='configContainer__config__weekDays'>
                        <div className='configContainer__config__weekDays__prop'>Días laborales:</div>
                    </div>
                    <div className='configContainer__config__createWeekDayMobile'>

                        <div className='configContainer__config__createWeekDayMobile__hairdresser'>
                            <select className='configContainer__config__createWeekDayMobile__hairdresser__select'  value={selectHairdressersWeekDays} onChange={(e) => {handleSelectHairdressersWeekDays(e.target.value)}}>
                                {hairdressersOptionsSelect.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div className='configContainer__config__createWeekDayMobile__day'>
                            <select className='configContainer__config__createWeekDayMobile__day__select'  value={selectDaysWeekDays} onChange={(e) => {handleSelectDaysWeekDays(e.target.value)}}>
                                {weekDays.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div className='configContainer__config__createWeekDayMobile__schedule'>

                            <select className='configContainer__config__createWeekDayMobile__schedule__select' value={selectScheduleWeekDays} onChange={(e) => {handleSelectScheduleWeekDays(e.target.value)}}>
                                {schedulesWeekDays.map((option, index) => (
                                <option key={index} value={option}>{option}</option>
                                ))}
                            </select>

                        </div>

                    </div>
                    <div className='configContainer__config__createWeekDayMobile__inputsCreateWorkDayBtns'>
                            {
                                inputCreateWeekDayOpen&&
                                <div className='configContainer__config__createWeekDayMobile__inputsCreateWorkDayBtns__inputs'>
                                    <input placeholder='HH' maxLength={2} value={inputCreateWeekDayH} onChange={handleInputCreateWeekDayH} onBlur={handleOnBlurInputCreateWeekDayH} className='configContainer__config__createWeekDayMobile__inputsCreateWorkDayBtns__inputs__prop' type="text" />
                                    <div>:</div>
                                    <input placeholder='MM' maxLength={2} value={inputCreateWeekDayM} onChange={handleInputCreateWeekDayM} onBlur={handleOnBlurInputCreateWeekDayM} className='configContainer__config__createWeekDayMobile__inputsCreateWorkDayBtns__inputs__prop' type="text" />
                                </div>
                            }
                        <div className='configContainer__config__createWeekDayMobile__inputsCreateWorkDayBtns__btns'>
                            
                            {
                                !inputCreateWeekDayOpen?
                                <button onClick={()=>setInputCreateWeekDayOpen(true)} className='configContainer__config__createWeekDayMobile__inputsCreateWorkDayBtns__btns__add'>Añadir horario</button>
                                :
                                <>
                                <button onClick={handleBtnCreateWeekDay} className='configContainer__config__createWeekDayMobile__inputsCreateWorkDayBtns__btns__create'>Crear</button>
                                <button onClick={()=>setInputCreateWeekDayOpen(false)} className='configContainer__config__createWeekDayMobile__inputsCreateWorkDayBtns__btns__goBack'>Atrás</button>
                                </>
                            }

                        </div>
                    </div>
                    <div className='configContainer__config__createWeekDay'>
                      <div className='configContainer__config__createWeekDay__hairdresser'>
                        <select className='configContainer__config__createWeekDay__hairdresser__select'  value={selectHairdressersWeekDays} onChange={(e) => {handleSelectHairdressersWeekDays(e.target.value)}}>
                            {hairdressersOptionsSelect.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                      </div>
                      <div className='configContainer__config__createWeekDay__day'>
                        <select className='configContainer__config__createWeekDay__day__select'  value={selectDaysWeekDays} onChange={(e) => {handleSelectDaysWeekDays(e.target.value)}}>
                            {weekDays.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                            ))}
                        </select>
                      </div>
                      <div className='configContainer__config__createWeekDay__scheduleBtn'>
                        <div className='configContainer__config__createWeekDay__scheduleBtn__schedule'>
                            {
                                !inputCreateWeekDayOpen?
                                <select className='configContainer__config__createWeekDay__scheduleBtn__schedule__select' value={selectScheduleWeekDays} onChange={(e) => {handleSelectScheduleWeekDays(e.target.value)}}>
                                    {schedulesWeekDays.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                :
                                <div className='configContainer__config__createWeekDay__scheduleBtn__schedule__inputSchedules'>
                                    <input placeholder='HH' maxLength={2} value={inputCreateWeekDayH} onChange={handleInputCreateWeekDayH} onBlur={handleOnBlurInputCreateWeekDayH} className='configContainer__config__createWeekDay__scheduleBtn__schedule__inputSchedules__input' type="text" />
                                    <div>:</div>
                                    <input placeholder='MM' maxLength={2} value={inputCreateWeekDayM} onChange={handleInputCreateWeekDayM} onBlur={handleOnBlurInputCreateWeekDayM} className='configContainer__config__createWeekDay__scheduleBtn__schedule__inputSchedules__input' type="text" />
                                </div>
                            }

                        </div>
                        <div className='configContainer__config__createWeekDay__scheduleBtn__btn'>
                            
                            {
                                !inputCreateWeekDayOpen?
                                <button onClick={()=>setInputCreateWeekDayOpen(true)} className='configContainer__config__createWeekDay__scheduleBtn__btn__addSchedule'>Añadir</button>
                                :
                                <>
                                <button onClick={handleBtnCreateWeekDay} className='configContainer__config__createWeekDay__scheduleBtn__btn__goBack'>Crear</button>
                                <button onClick={()=>setInputCreateWeekDayOpen(false)} className='configContainer__config__createWeekDay__scheduleBtn__btn__goBack'>Atrás</button>
                                </>
                            }

                        </div>
                      </div>
                    </div>
                    <div className='configContainer__config__btnShowWorkDaysListContainer'>
                        {
                            !showWorkDaysList ?
                            <button className='configContainer__config__btnShowWorkDaysListContainer__btn' onClick={()=>setShowWorkDaysList(true)}>Editar horarios</button>
                            :
                            <button className='configContainer__config__btnShowWorkDaysListContainer__btn' onClick={()=>setShowWorkDaysList(false)}>Ocultar horarios</button>
                        }
                    </div>
                    {
                        showWorkDaysList&&
                            <div className='configContainer__config__workDaysList'>
                            {
                                workDaysByHairdresserWorkDayFiltered.map((workDay) => {
                                    return(
                                        <>
                                            <div className='configContainer__config__workDaysList__itemSchedule'>
                                                    <div className='configContainer__config__workDaysList__itemSchedule__scheduleBtn'>
                                                        <div className='configContainer__config__workDaysList__itemSchedule__scheduleBtn__label'>
                                                            <div className='configContainer__config__workDaysList__itemSchedule__scheduleBtn__label__prop'>{workDay.schedule}</div>
                                                        </div>
                                                        <div className='configContainer__config__workDaysList__itemSchedule__scheduleBtn__btn'>
                                                            <button onClick={()=>{handleBtnDeleteScheduleWorkDay(workDay._id)}} className='configContainer__config__workDaysList__itemSchedule__scheduleBtn__btn__prop'>Borrar</button>
                                                        </div>
                                                    </div>
                                            </div>
                                        </>
                                    )
                                })
                            }
                            </div>
                    }
                    {/* <div className='configContainer__config__partners'>
                        <div className='configContainer__config__partners__prop'>Socios:</div>
                    </div> */}
                        {
                          deleteCompanyModal&&<DeleteCompanyModal setDeleteCompanyModal={setDeleteCompanyModal} id={idCompany} company={nameCompany} />
                        }
                        {
                            deleteHairdresserModal&&<DeleteHairdresserModal setDeleteHairdresserModal={setDeleteHairdresserModal} id={idHairdresser} hairdresser={nameHairdresser} />
                        }
                        {
                            deleteServiceModal&&<DeleteServiceModal setDeleteServiceModal={setDeleteServiceModal} id={idService} service={titleService} />
                        }
                        {
                            deleteVariouModal&&<DeleteVariouModal setDeleteVariouModal={setDeleteVariouModal} id={idVariou} variou={titleVariou} />
                        }
                        {
                            deletePartnerBenModal&&<DeletePartnerBenModal setDeletePartnerBenModal={setDeletePartnerBenModal} id={idPartnerBen} partnerBen={titlePartnerBen} />
                        }
                        {
                            updateServiceBtnIsOpen&&<UpdateServiceModal setUpdateServiceBtnIsOpen={setUpdateServiceBtnIsOpen} id={idService} title={titleService} value={valueService} />
                        }
                        {
                          updateVariousPriceModal&&<UpdateVariousPriceModal setUpdateVariousPriceModal={setUpdateVariousPriceModal} id={idVariousPrice} title={titleVariousPrice} value={valueVariousPrice} />
                        }
                        {
                          updatePartnersBenModal&&<UpdatePartnersBenModal setUpdatePartnersBenModal={setUpdatePartnersBenModal} id={idPartnersBen} title={titlePartnersBen} value={valuePartnersBen} />
                        }
                </div>
            </div>
            <LogOut/>
          </>
          :
          <>
            
          </>
        }
        <Footer/>
    </>
  )
}

export default Config
import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import {IsLoggedContext} from '../context/IsLoggedContext';
import {OpenModalContext} from '../context/OpenModalContext'; 
import {BtnMPContext} from '../context/BtnMPContext';
import {PricesContext} from '../context/PricesContext';
import HMenu from './HMenu';
import Spinner from './Spinner';
import ItemPrice from './ItemPrice';

const Prices = () => {
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const {menuOptionsModal,handleMenuOptionsModal,updatePricesModal} = useContext(OpenModalContext);
    const {handleBtnBuyVisible} = useContext(BtnMPContext);
    const {inputCreatePriceOf,inputCreateValuePriceOf,inputCreateCategory,handleInputCreatePriceOf,handleInputCreateValuePriceOf,handleInputCreateCategory,handleEmptyInputCreatePriceOf,handleEmptyInputCreateValuePriceOf} = useContext(PricesContext);
    const [prices, setPrices] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [isMonted, setIsMonted] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;
    const optionsCategory = ['Elija categoría','Socios','No socios','Varios'];

    const noPartnersPrices = prices.filter(price => price.category == 'No socios')
    const partnersPrices = prices.filter(price => price.category == 'Socios')
    const variousPrices = prices.filter(price => price.category == 'Varios')
    
    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchPricesData() {
                const response = await fetch(`${apiUrl}/api/prices`)
                const pricesAll = await response.json();
                setPrices(pricesAll.data)
            }
            fetchPricesData();
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
        return () => {
            handleBtnBuyVisible(false);
        };
    }, []);

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnCreateItemPriceOf = async() => {
        if(!inputCreatePriceOf || !inputCreateValuePriceOf) {
            toast('Debes completar todos los campos!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputCreatePriceOf)) {
            toast('El campo "precio de" contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputCreateValuePriceOf)) {
            toast('El campo "valor" contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if(inputCreateCategory=='Elija categoría' || inputCreateCategory=='') {
            toast('Debes elegir la categoría', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else {
            document.getElementById('btnCreateItemPriceOf').style.display = 'none';
            setShowSpinner(true);
            const itemPriceToCreate = {
                price_of: inputCreatePriceOf,
                value_price_of: inputCreateValuePriceOf,
                category: inputCreateCategory,
            }
            const response = await fetch(`${apiUrl}/api/prices/register`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemPriceToCreate)
            })
            if(response.ok) {
                toast(`Has registrado el precio de ${inputCreatePriceOf} correctamente!`, {
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
                    document.getElementById('btnCreateItemPriceOf').style.display = 'block';
                    setShowSpinner(false);
                    cleanPropsCreatePrice();
                }, 2000);
            }
            const data = await response.json();
            if(data.error === 'There is already a price with that price of') {
                toast('Ya existe un item con esa descripción!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnCreateItemPriceOf').style.display = 'block';
                setShowSpinner(false);
            }
        }
    }

    const cleanPropsCreatePrice = () => {
        handleEmptyInputCreatePriceOf('');
        handleEmptyInputCreateValuePriceOf('');
        handleInputCreateCategory(optionsCategory[0])
    };

    const inputButtonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: 'white'
    };

  return (
      <>
            <NavBar/>
            {
                isLoggedIn && user.role==='admin'?
                <>
                    <div className='pricesContainerIsLoggedIn'>
                        <div className='pricesContainerIsLoggedIn__title'>- Precios -</div>
                        <div className='pricesContainerIsLoggedIn__pricesList'>
                            <div className='pricesContainerIsLoggedIn__pricesList__header'>
                                <div className='pricesContainerIsLoggedIn__pricesList__header__label'>Precio de</div>
                                <div className='pricesContainerIsLoggedIn__pricesList__header__label'>Valor</div>
                                <div className='pricesContainerIsLoggedIn__pricesList__header__label'>Categoría</div>
                            </div>
                            {
                                !updatePricesModal?
                                    <>
                                        <div className='pricesContainerIsLoggedIn__pricesList__createPrice'>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPrice__input'>
                                                <input className='pricesContainerIsLoggedIn__pricesList__createPrice__input__prop' placeholder='-' value={inputCreatePriceOf} onChange={handleInputCreatePriceOf}/>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPrice__input'>
                                                <input className='pricesContainerIsLoggedIn__pricesList__createPrice__input__prop' placeholder='-' maxLength={8} value={inputCreateValuePriceOf} onChange={handleInputCreateValuePriceOf}/>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPrice__select'>
                                                <select className='pricesContainerIsLoggedIn__pricesList__createPrice__select__prop' value={inputCreateCategory} onChange={(e) => {handleInputCreateCategory(e.target.value)}}>
                                                    {optionsCategory.map((option, index) => (
                                                    <option key={index} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPrice__btn'>
                                                <button id='btnCreateItemPriceOf' className='pricesContainerIsLoggedIn__pricesList__createPrice__btn__prop' onClick={handleBtnCreateItemPriceOf}>Crear</button>
                                                {showSpinner&&<Spinner/>}
                                            </div>
                                        </div>
                                        <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile'>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput'>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label'>
                                                    <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label__prop'>Precio de:</div>
                                                </div>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__input'>
                                                    <input className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__input__prop' placeholder='-' value={inputCreatePriceOf} onChange={handleInputCreatePriceOf}/>
                                                </div>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput'>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label'>
                                                    <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label__prop'>Valor:</div>
                                                </div>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__input'>
                                                    <input className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__input__prop' placeholder='-' maxLength={8} value={inputCreateValuePriceOf} onChange={handleInputCreateValuePriceOf}/>
                                                </div>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput'>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label'>
                                                    <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label__prop'>Categoría:</div>
                                                </div>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__select'>
                                                    <select className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__select__prop' value={inputCreateCategory} onChange={(e) => {handleInputCreateCategory(e.target.value)}}>
                                                        {optionsCategory.map((option, index) => (
                                                            <option key={index} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__btn'>
                                                <button id='btnCreateItemPriceOf' className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__btn__prop' onClick={handleBtnCreateItemPriceOf}>Crear</button>
                                                {showSpinner&&<Spinner/>}
                                            </div>
                                        </div>
                                    </>
                                :
                                    <>
                                        <div className='pricesContainerIsLoggedIn__pricesList__createPrice'>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPrice__input'>
                                                <input style={inputButtonDisabledStyle} disabled className='pricesContainerIsLoggedIn__pricesList__createPrice__input__prop' placeholder='-' value={inputCreatePriceOf} onChange={handleInputCreatePriceOf}/>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPrice__input'>
                                                <input style={inputButtonDisabledStyle} disabled className='pricesContainerIsLoggedIn__pricesList__createPrice__input__prop' placeholder='-' maxLength={8} value={inputCreateValuePriceOf} onChange={handleInputCreateValuePriceOf}/>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPrice__select'>
                                                <select style={inputButtonDisabledStyle} disabled className='pricesContainerIsLoggedIn__pricesList__createPrice__select__prop' value={inputCreateCategory} onChange={(e) => {handleInputCreateCategory(e.target.value)}}>
                                                    {optionsCategory.map((option, index) => (
                                                    <option key={index} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPrice__btn'>
                                                <button disabled id='btnCreateItemPriceOf' className='pricesContainerIsLoggedIn__pricesList__createPrice__btn__prop'>Crear</button>
                                                {showSpinner&&<Spinner/>}
                                            </div>
                                        </div>
                                        <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile'>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput'>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label'>
                                                    <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label__prop'>Precio de:</div>
                                                </div>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__input'>
                                                    <input disabled className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__input__prop' placeholder='-' value={inputCreatePriceOf} onChange={handleInputCreatePriceOf}/>
                                                </div>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput'>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label'>
                                                    <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label__prop'>Valor:</div>
                                                </div>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__input'>
                                                    <input disabled className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__input__prop' placeholder='-' maxLength={8} value={inputCreateValuePriceOf} onChange={handleInputCreateValuePriceOf}/>
                                                </div>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput'>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label'>
                                                    <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__label__prop'>Categoría:</div>
                                                </div>
                                                <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__select'>
                                                    <select disabled className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__labelInput__select__prop' value={inputCreateCategory} onChange={(e) => {handleInputCreateCategory(e.target.value)}}>
                                                        {optionsCategory.map((option, index) => (
                                                            <option key={index} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__btn'>
                                                <button disabled id='btnCreateItemPriceOf' className='pricesContainerIsLoggedIn__pricesList__createPriceMobile__btn__prop' onClick={handleBtnCreateItemPriceOf}>Crear</button>
                                                {showSpinner&&<Spinner/>}
                                            </div>
                                        </div>
                                    </>
                            }
                            
                            <h2 className='pricesContainerIsLoggedIn__pricesList__h2'>- No socios -</h2>
                            {
                                noPartnersPrices.length != 0?
                                noPartnersPrices.map((price) => {
                                    return(
                                        <ItemPrice
                                        id={price._id}
                                        priceOf={price.price_of}
                                        valuePriceOf={price.value_price_of}
                                        category={price.category}
                                        />
                                    )
                                })
                                :
                                <div className='pricesContainerIsLoggedIn__pricesList__nonPrices'>- Aún no existen precios -</div>
                            }
                            <h2 className='pricesContainerIsLoggedIn__pricesList__h2'>- Socios -</h2>
                            {
                                partnersPrices.length != 0?
                                partnersPrices.map((price) => {
                                    return(
                                        <ItemPrice
                                        id={price._id}
                                        priceOf={price.price_of}
                                        valuePriceOf={price.value_price_of}
                                        category={price.category}
                                        />
                                    )
                                })
                                :
                                <div className='pricesContainerIsLoggedIn__pricesList__nonPrices'>- Aún no existen precios -</div>
                            }
                            <h2 className='pricesContainerIsLoggedIn__pricesList__h2'>- Varios -</h2>
                            {
                                variousPrices.length != 0?
                                variousPrices.map((price) => {
                                    return(
                                        <ItemPrice
                                        id={price._id}
                                        priceOf={price.price_of}
                                        valuePriceOf={price.value_price_of}
                                        category={price.category}
                                        />
                                    )
                                })
                                :
                                <div className='pricesContainerIsLoggedIn__pricesList__nonPrices'>- Aún no existen precios -</div>
                            }
                        </div>
                    </div>
                    <LogOut/>
                </>
                : 
                <>
                    <div className='warningLogin'>
                    <p className='warningLogin__prop'>Si aún no has iniciado sesión, <Link to={"/login"} className='warningLogin__link'>has click aquí</Link></p>
                    </div>
                    <div className='blackDiv'></div> 
                </>
            }
        <Footer/>
    </>
  )
}

export default Prices
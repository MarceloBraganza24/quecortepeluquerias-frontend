import React, { createContext, useState, useEffect } from 'react';

export const InputDataShContext = createContext(null)

export const ParentComponent = ({children}) => {
    const [inputFirstNameSh, setInputFirstNameSh] = useState('');
    const [inputLastNameSh, setInputLastNameSh] = useState('');
    const [selectOptionHairdresserSh, setSelectOptionHairdresserSh] = useState('');
    const [inputEmailSh, setInputEmailSh] = useState('');
    const [inputDateSh, setInputDateSh] = useState(new Date);
    const [selectScheduleSh, setSelectScheduleSh] = useState('');
    const [inputOptionServiceSh, setInputOptionServiceSh] = useState('');
    const [inputPriceSh, setInputPriceSh] = useState('');
    const [services, setServices] = useState([]);
    const [user, setUser] = useState('');
    const [isMonted, setIsMonted] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    const cleanText = (text) => {
        const replacements = {
          'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
          'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
          'ñ': 'n', 'Ñ': 'N'
        };
      
        return text.split('').map(char => replacements[char] || char).join('');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            async function fetchServicesData() {
                const response = await fetch(`${apiUrl}/api/services`)
                const servicesAll = await response.json();
                setServices(servicesAll.data)
            }
            fetchServicesData();
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
        }, 10000);
        return () => {
            clearInterval(interval);
        };
    }, [isMonted]);

    useEffect(() => {
        async function fetchServicesData() {
            const response = await fetch(`${apiUrl}/api/services`)
            const servicesAll = await response.json();
            setServices(servicesAll.data)
        }
        fetchServicesData();
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
        setTimeout(() => {
            setIsMonted(true);
        }, 10000)
    },[])   

    function regexOnlyLetters(str) {
        const regex = /^[a-zA-Z\s]*$/;
        return regex.test(str);
    }

    const handleInputFirstNameSh = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputFirstNameSh(textToSaved)
        }
    };

    const handleInputLastNameSh = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputLastNameSh(textToSaved)
        }
    };

    const handleInputEmailSh = (e) => {
        const texto = e.target.value;
        const textCleaned = cleanString(texto);
        const textToSaved = cleanText(textCleaned);
        setInputEmailSh(textToSaved)
    };

    const handleInputDateSh = (e) => {
        setInputDateSh(e);
    };

    const handleSelectScheduleSh = (e) => {
        setSelectScheduleSh(e);
    };

    const handleSelectOptionHairdresserSh = (e) => {
        setSelectOptionHairdresserSh(e);
    };

    const handleInputOptionServiceSh = (e) => {
        setInputOptionServiceSh(e);
        //handleInputPriceSh(e)
        e=='Elija su servicio'&&setInputPriceSh('')
        services.forEach(res => {
            const compared = compareStringsIgnoreCase(e, res.title)
            if(compared) {
                setInputPriceSh(res.value)
            }
        })
        /* if(!user.isMembershipFeePaid) {
            const noPartnersServices = services.filter(service => service.category == 'No socio')
            noPartnersServices.forEach(res => {
                const compared = compareStringsIgnoreCase(e, res.title)
                if(compared) {
                    setInputPriceSh(res.value)
                }
            })
        } else if(user.isMembershipFeePaid) {
            const noPartnersServices = services.filter(service => service.category == 'Socio')
            noPartnersServices.forEach(res => {
                const compared = compareStringsIgnoreCase(e, res.title)
                if(compared) {
                    setInputPriceSh(res.value)
                }
            })
        } */

    };

    function compareStringsIgnoreCase(str1, str2) {
        return str1.toLowerCase() === str2.toLowerCase();
    }

    return (
    <InputDataShContext.Provider value={{ selectOptionHairdresserSh,inputFirstNameSh, inputLastNameSh, inputEmailSh, inputDateSh, selectScheduleSh, inputOptionServiceSh, inputPriceSh, handleInputFirstNameSh, handleInputLastNameSh, handleInputEmailSh, handleInputDateSh, handleSelectScheduleSh, handleInputOptionServiceSh,handleSelectOptionHairdresserSh }}>
        {children}
    </InputDataShContext.Provider>
    );
}
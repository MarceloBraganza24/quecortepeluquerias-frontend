import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const MyDataModal = ({id,first_name,last_name,setIsMyDataModalOpen,handleUpdateMyDataModal}) => {
    const [inputFirstNameMD, setInputFirstNameMD] = useState('');
    const [inputLastNameMD, setInputLastNameMD] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

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

    const handleInputFirstNameMD = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputFirstNameMD(textToSaved)
        } 
    };

    const handleInputLastNameMD = (e) => {
        const texto = e.target.value;
        if(regexOnlyLetters(texto)) {
            //const textCleaned = cleanString(texto);
            const textToSaved = cleanText(texto);
            setInputLastNameMD(textToSaved)
        } 
    };

    const handleBtnCloseModal = () => {
        if((inputFirstNameMD == first_name || inputFirstNameMD == '') && (inputLastNameMD == last_name || inputLastNameMD == '')) {
            handleUpdateMyDataModal(false)
            setIsMyDataModalOpen(false)
        } else {
            toast('Aún no has guardado los cambios!', {
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

    const handleUpdateMyData = async(e) => {
        e.preventDefault();
        setShowSpinner(true);
        if((inputFirstNameMD == first_name || inputFirstNameMD == '') && (inputLastNameMD == last_name || inputLastNameMD == '')) {
            toast('No tienes cambios para actualizar!', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setShowSpinner(false);
        } else {
            const myData = {
                first_name: inputFirstNameMD?cleanString(inputFirstNameMD):first_name,
                last_name: inputLastNameMD?cleanString(inputLastNameMD):last_name
            }
            const response = await fetch(`${apiUrl}/api/users/props/${id}`, {
                method: 'PATCH',         
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(myData)
            })
            if(response.ok) {
                toast('Has actualizado el usuario correctamente!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setTimeout(() => {
                    setIsMyDataModalOpen(false)
                    handleUpdateMyDataModal(false)
                }, 1500);
            }
        }
    }

    return (
        <div className='myDataModalContainer'>
            <div className='myDataModalContainer__btnCloseModal'>
                <div onClick={handleBtnCloseModal} className='myDataModalContainer__btnCloseModal__prop'>X</div>
            </div>
            <div className='myDataModalContainer__data'>
                <div className='myDataModalContainer__data__label-input'>
                    <div className='myDataModalContainer__data__label-input__label'>
                        <div className='myDataModalContainer__data__label-input__label__prop'>Nombre:</div>
                    </div>
                    <div className='myDataModalContainer__data__label-input__input'>
                        <input onChange={handleInputFirstNameMD} value={!inputFirstNameMD?first_name:inputFirstNameMD} className='myDataModalContainer__data__label-input__input__prop' type="text" />
                    </div>
                </div>
                <div className='myDataModalContainer__data__label-input'>
                    <div className='myDataModalContainer__data__label-input__label'>
                        <div className='myDataModalContainer__data__label-input__label__prop'>Apellido:</div>
                    </div>
                    <div className='myDataModalContainer__data__label-input__input'>
                        <input onChange={handleInputLastNameMD} value={!inputLastNameMD?last_name:inputLastNameMD} className='myDataModalContainer__data__label-input__input__prop' type="text" />
                    </div>
                </div>
            </div>
            <div className='myDataModalContainer__btn'>
                <button onClick={handleUpdateMyData} className='myDataModalContainer__btn__prop'>Guardar</button>
                {showSpinner&&<Spinner/>}
            </div>
        </div>
    )
}

export default MyDataModal
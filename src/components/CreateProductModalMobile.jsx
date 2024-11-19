import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from "react-toastify";
import {OpenModalContext} from '../context/OpenModalContext'; 

const CreateProductModalMobile = ({setIsOpenCreateProductModalLocalMobile}) => {
    const {handleCreateProductModalMobile} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [inputTitleProdL, setInputTitleProdL] = useState('');
    const [inputDescriptionProdL, setInputDescriptionProdL] = useState('');
    const [inputPriceProdL, setInputPriceProdL] = useState('');
    const [inputStockProdL, setInputStockProdL] = useState('');
    const [inputCategoryProdL, setInputCategoryProdL] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);

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

    const handleInputTitleProdL = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputTitleProdL(textToSaved)
    };

    const handleInputDescriptionProdL = (e) => {
        const inputValue = e.target.value;
        const textToSaved = cleanText(inputValue);
        setInputDescriptionProdL(textToSaved)
    };

    const handleInputPriceProdL = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputPriceProdL(inputValue);
        }
    };

    const handleInputStockProdL = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputStockProdL(inputValue);
        }
    };

    const handleInputCategoryProdL = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputCategoryProdL(textToSaved)
    };

    const closeM = () => {
        setIsOpenCreateProductModalLocalMobile(false);
        handleCreateProductModalMobile(false);
    };

    const cleanPropsCreateProduct = () => {
        setInputTitleProdL('')
        setInputDescriptionProdL('')
        setInputPriceProdL('')
        setInputStockProdL('')
        setInputCategoryProdL('')
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnCreatePartner = async() => {
        if(!inputTitleProdL || !inputDescriptionProdL || !inputPriceProdL || !inputStockProdL || !inputCategoryProdL) {
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
        } else if (!isValidUTF8(inputTitleProdL)) {
            toast('El campo título contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputDescriptionProdL)) {
            toast('El campo descripción contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputPriceProdL)) {
            toast('El campo precio contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputStockProdL)) {
            toast('El campo stock contiene caracteres no válidos', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputCategoryProdL)) {
            toast('El campo categoría contiene caracteres no válidos', {
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
            const product_datetime = `${year}-${month}-${day} ${hours}:${minutes}`;
            document.getElementById('btnCreateProduct').style.display = 'none';
            setShowSpinner(true);
            const productToCreate = {
                title: cleanString(inputTitleProdL),
                description: cleanString(inputDescriptionProdL),
                price: inputPriceProdL,
                stock: inputStockProdL,
                category: cleanString(inputCategoryProdL),
                product_datetime: product_datetime
            }
            const response = await fetch(`${apiUrl}/api/products/register`, {
                method: 'POST',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToCreate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has registrado un producto correctamente!', {
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
                    document.getElementById('btnCreateProduct').style.display = 'block';
                    setShowSpinner(false);   
                    cleanPropsCreateProduct();
                }, 2000);
            }
            if(data.error === 'There is already a product with that title') {
                toast('Ya existe un producto con ese título!', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                document.getElementById('btnCreateProduct').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    return (
        <>
            <div className='createProductModalContainerMobile'>
                <div className='createProductModalContainerMobile__btnCloseModal'>
                    <Link onClick={closeM} className='createProductModalContainerMobile__btnCloseModal__prop'>
                        Cerrar
                    </Link>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createProductModalContainerMobile__labelInput'>
                    <div className='createProductModalContainerMobile__labelInput__label'>
                        <div className='createProductModalContainerMobile__labelInput__label__prop'>Título:</div>
                    </div>
                    <div className='createProductModalContainerMobile__labelInput__input'>
                        <input type='text' className='createProductModalContainerMobile__labelInput__input__prop' value={inputTitleProdL} onChange={handleInputTitleProdL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createProductModalContainerMobile__labelInput'>
                    <div className='createProductModalContainerMobile__labelInput__label'>
                        <div className='createProductModalContainerMobile__labelInput__label__prop'>Descripción:</div>
                    </div>
                    <div className='createProductModalContainerMobile__labelInput__input'>
                        <input type='text' className='createProductModalContainerMobile__labelInput__input__prop' value={inputDescriptionProdL} onChange={handleInputDescriptionProdL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createProductModalContainerMobile__labelInput'>
                    <div className='createProductModalContainerMobile__labelInput__label'>
                        <div className='createProductModalContainerMobile__labelInput__label__prop'>Precio:</div>
                    </div>
                    <div className='createProductModalContainerMobile__labelInput__input'>
                        <input className='createProductModalContainerMobile__labelInput__input__prop' value={inputPriceProdL} onChange={handleInputPriceProdL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createProductModalContainerMobile__labelInput'>
                    <div className='createProductModalContainerMobile__labelInput__label'>
                        <div className='createProductModalContainerMobile__labelInput__label__prop'>Stock:</div>
                    </div>
                    <div className='createProductModalContainerMobile__labelInput__input'>
                        <input type='email' className='createProductModalContainerMobile__labelInput__input__prop' value={inputStockProdL} onChange={handleInputStockProdL}/>
                    </div>
                </div>
                <div style={{paddingTop:'1vh',paddingBottom:'1vh'}} className='createProductModalContainerMobile__labelInput'>
                    <div className='createProductModalContainerMobile__labelInput__label'>
                        <div className='createProductModalContainerMobile__labelInput__label__prop'>Categoría:</div>
                    </div>
                    <div className='createProductModalContainerMobile__labelInput__input'>
                        <input type='email' className='createProductModalContainerMobile__labelInput__input__prop' value={inputCategoryProdL} onChange={handleInputCategoryProdL}/>
                    </div>
                </div>
                <div style={{paddingTop:'2vh'}} className='createProductModalContainerMobile__btns'>
                    <button id='btnCreateProduct' className='createProductModalContainerMobile__btns__btn' onClick={handleBtnCreatePartner}>Crear producto</button>
                </div>
                {showSpinner&&<Spinner/>}
            </div>
        </>
    )
}

export default CreateProductModalMobile
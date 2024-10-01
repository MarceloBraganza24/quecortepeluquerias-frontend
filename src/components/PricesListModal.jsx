import React, {useState,useContext} from 'react'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext';

const PricesListModal = ({id,priceOf,valuePriceOf,category,setIsPricesListModalOpen}) => {
    const [inputPriceOf, setInputPriceOf] = useState('');
    const [inputValuePriceOf, setInputValuePriceOf] = useState('');
    const [inputCreateCategory, setInputCreateCategory] = useState(`${category}`);
    const [confirmationDelPricesModal, handleConfirmationDelPricesModal] = useState(false);
    const [confirmationDelPriceModalMobile, handleConfirmationDelPriceModalMobile] = useState(false);
    const {handleUpdatePriceModal} = useContext(OpenModalContext);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const optionsService = ['Elija categoría','Socios','No socios','Varios'];
    const apiUrl = import.meta.env.VITE_API_URL;
    const optionsCategory = ['Elija categoría','Socios','No socios','Varios'];

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

    const handleInputPriceOf = (e) => {
        const texto = e.target.value;
        const textCleaned = cleanString(texto);
        const textToSaved = cleanText(textCleaned);
        setInputPriceOf(textToSaved)
        texto===priceOf?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputValuePriceOf!=valuePriceOf && inputValuePriceOf!='')setInputChanges(true);
        if(inputCreateCategory!=category && inputCreateCategory!='')setInputChanges(true);
    };

    const handleInputValuePriceOf = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputValuePriceOf(inputValue);
            inputValue===valuePriceOf?setInputChanges(false):setInputChanges(true);
            inputValue===''&&setInputChanges(false);
            if(inputPriceOf!=priceOf && inputPriceOf!='')setInputChanges(true);
            if(inputCreateCategory!=category && inputCreateCategory!='')setInputChanges(true);
        }
    };

    const handleInputCreateCategory = (e) => {
        setInputCreateCategory(e);
        e==category?setInputChanges(false):setInputChanges(true);
        e==''&&setInputChanges(false);
        if(inputPriceOf!=priceOf && inputPriceOf!='')setInputChanges(true);
        if(inputValuePriceOf!=valuePriceOf && inputValuePriceOf!='')setInputChanges(true);
      };

    const handleBtnDelPrice = async() => {
        handleConfirmationDelPricesModal(true);
        handleConfirmationDelPriceModalMobile(true);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdPrice = async(evt) => {
        evt.preventDefault();
        if(inputCreateCategory=='Elija categoría') {
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
        } else if ((inputPriceOf == priceOf || inputPriceOf == '') && (inputValuePriceOf == valuePriceOf || inputValuePriceOf == '') && (inputCreateCategory == category || inputCreateCategory == '')) {
            toast('No tienes cambios para actualizar!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else if (!isValidUTF8(inputPriceOf)) {
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
        } else if (!isValidUTF8(inputValuePriceOf)) {
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
        } else {
            document.getElementById('btnUpdateItemPriceOf').style.display = 'none';
            setShowSpinner(true);
            const itemPriceToUpdate = {
                price_of: inputPriceOf?inputPriceOf:priceOf,
                value_price_of: inputValuePriceOf?inputValuePriceOf:valuePriceOf,
                category: inputCreateCategory?inputCreateCategory:category
            }
            const response = await fetch(`${apiUrl}/api/prices/${id}`, {
                method: 'PUT',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemPriceToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast(`Has actualizado el precio de ${priceOf} correctamente!`, {
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
                    handleUpdatePriceModal(false);
                    setIsPricesListModalOpen(false);
                    setInputChanges(false)
                }, 1500);
            }
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
                document.getElementById('btnUpdateItemPriceOf').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    const ConfirmationDeleteItemPriceOfModal = ({id,inputPriceOf,handleConfirmationDelPricesModal}) => {
        const [showSpinner, setShowSpinner] = useState(false);

        const handleBtnDelItemPriceOf = async() => {
            const response = await fetch(`${apiUrl}/api/prices/${id}`, {
                method: 'DELETE'
            })
            if(response.ok) {
                setShowSpinner(true);
                toast(`Has borrado el precio de ${inputPriceOf} correctamente!`, {
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
                    handleUpdatePriceModal(false);
                    setIsPricesListModalOpen(false);
                }, 1500);
            }
        }

        const handleBtnConfirmationDeleteBtnNo = (evt) => {
            evt.preventDefault();
            handleConfirmationDelPricesModal(false);
        }
        return (
            <>
                <div className='confirmationDeleteItemPriceOfModalContainer'>
                    <div className='confirmationDeleteItemPriceOfModalContainer__ask'>¿Estás seguro que deseas borrar el precio de {inputPriceOf}?</div>
                    <div className='confirmationDeleteItemPriceOfModalContainer__askMobile'>
                        <div className='confirmationDeleteItemPriceOfModalContainer__askMobile__ask'>¿Estás seguro que deseas borrar</div>
                        <div className='confirmationDeleteItemPriceOfModalContainer__askMobile__ask'> el precio de {inputPriceOf}?</div>
                    </div>
                    <div className='confirmationDeleteItemPriceOfModalContainer__btnsContainer'>
                        <div className='confirmationDeleteItemPriceOfModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteItemPriceOfModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelItemPriceOf} className='confirmationDeleteItemPriceOfModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteItemPriceOfModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteItemPriceOfModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteItemPriceOfModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const ConfirmationDeleteModalMobile = ({id,price_of,handleConfirmationDelPriceModalMobile}) => {
        const [showSpinner, setShowSpinner] = useState(false);

        const handleBtnDelItemPriceOf = async() => {
            const response = await fetch(`${apiUrl}/api/prices/${id}`, {
                method: 'DELETE'
            })
            if(response.ok) {
                setShowSpinner(true);
                toast(`Has borrado el precio de ${price_of} correctamente!`, {
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
                    handleUpdatePriceModal(false);
                    setIsPricesListModalOpen(false);
                }, 1500);
            }
        }

        const handleBtnConfirmationDeleteBtnNo = (evt) => {
            evt.preventDefault();
            handleConfirmationDelPriceModalMobile(false);
        }
        return (
            <>
                <div className='confirmationDeletePriceModalMobileContainer'>
                    <div className='confirmationDeletePriceModalMobileContainer__askMobile'>
                        <div className='confirmationDeletePriceModalMobileContainer__askMobile__ask'>¿Estás seguro que deseas borrar</div>
                        <div className='confirmationDeletePriceModalMobileContainer__askMobile__ask'> el precio de {price_of}?</div>
                    </div>
                    <div className='confirmationDeletePriceModalMobileContainer__btnsContainer'>
                        <div className='confirmationDeletePriceModalMobileContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelItemPriceOf} className='confirmationDeletePriceModalMobileContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeletePriceModalMobileContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeletePriceModalMobileContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeletePriceModalMobileContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const closeM = (e) => {
        e.preventDefault();
        setIsPricesListModalOpen(false);
        handleUpdatePriceModal(false);
    }

    const unsavedChanges = () => {
        toast('No has actualizado los cambios!', {
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

    const buttonDisabledStyle = {
        color: 'white',
        cursor: 'pointer'
    };

    return (
        <>
            <div className='updatePriceModalContainerMobile'>
            <div className='updatePriceModalContainerMobile__btnCloseModal'>
                {
                    !confirmationDelPriceModalMobile&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='updatePriceModalContainerMobile__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='updatePriceModalContainerMobile__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            {
                !confirmationDelPriceModalMobile?
                <>
                    <div style={{paddingTop:'2vh'}} className='updatePriceModalContainerMobile__labelInput'>
                        <div className='updatePriceModalContainerMobile__labelInput__label'>
                            <div className='updatePriceModalContainerMobile__labelInput__label__prop'>Precio de:</div>
                        </div>
                        <div className='updatePriceModalContainerMobile__labelInput__input'>
                            <input className='updatePriceModalContainerMobile__labelInput__input__prop' value={!inputPriceOf?priceOf:inputPriceOf}onChange={handleInputPriceOf}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePriceModalContainerMobile__labelInput'>
                        <div className='updatePriceModalContainerMobile__labelInput__label'>
                            <div className='updatePriceModalContainerMobile__labelInput__label__prop'>Valor:</div>
                        </div>
                        <div className='updatePriceModalContainerMobile__labelInput__input'>
                            <input className='updatePriceModalContainerMobile__labelInput__input__prop' value={!inputValuePriceOf?valuePriceOf:inputValuePriceOf}onChange={handleInputValuePriceOf}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePriceModalContainerMobile__labelInput'>
                        <div className='updatePriceModalContainerMobile__labelInput__label'>
                            <div className='updatePriceModalContainerMobile__labelInput__label__prop'>Categoría:</div>
                        </div>
                        <div className='updatePriceModalContainerMobile__labelInput__selectSchedule'>
                            <select className='updatePriceModalContainerMobile__labelInput__selectSchedule__select' value={inputCreateCategory} onChange={(e) => {handleInputCreateCategory(e.target.value)}}>
                                {optionsCategory.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePriceModalContainerMobile__btns'>
                        <button className='updatePriceModalContainerMobile__btns__btn' onClick={handleBtnDelPrice}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePriceModalContainerMobile__btns'>
                        <button id='btnUpdateUser' className='updatePriceModalContainerMobile__btns__btn' onClick={handleBtnUpdPrice}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePriceModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
                :
                <>
                    <div style={{paddingTop:'2vh'}} className='updatePriceModalContainerMobile__labelInput'>
                        <div className='updatePriceModalContainerMobile__labelInput__label'>
                            <div className='updatePriceModalContainerMobile__labelInput__label__prop'>Precio de:</div>
                        </div>
                        <div className='updatePriceModalContainerMobile__labelInput__input'>
                            <input disabled className='updatePriceModalContainerMobile__labelInput__input__prop' value={!inputPriceOf?priceOf:inputPriceOf}onChange={handleInputPriceOf}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePriceModalContainerMobile__labelInput'>
                        <div className='updatePriceModalContainerMobile__labelInput__label'>
                            <div className='updatePriceModalContainerMobile__labelInput__label__prop'>Valor:</div>
                        </div>
                        <div className='updatePriceModalContainerMobile__labelInput__input'>
                            <input disabled className='updatePriceModalContainerMobile__labelInput__input__prop' value={!inputValuePriceOf?valuePriceOf:inputValuePriceOf}onChange={handleInputValuePriceOf}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePriceModalContainerMobile__labelInput'>
                        <div className='updatePriceModalContainerMobile__labelInput__label'>
                            <div className='updatePriceModalContainerMobile__labelInput__label__prop'>Categoría:</div>
                        </div>
                        <div className='updatePriceModalContainerMobile__labelInput__selectSchedule'>
                            <select disabled className='updatePriceModalContainerMobile__labelInput__selectSchedule__select' value={inputCreateCategory} onChange={(e) => {handleInputCreateCategory(e.target.value)}}>
                                {optionsCategory.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updatePriceModalContainerMobile__btns'>
                        <button disabled className='updatePriceModalContainerMobile__btns__btn' onClick={handleBtnDelPrice}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePriceModalContainerMobile__btns'>
                        <button disabled id='btnUpdateUser' className='updatePriceModalContainerMobile__btns__btn' onClick={handleBtnUpdPrice}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updatePriceModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
            }
            {
                confirmationDelPriceModalMobile&&<ConfirmationDeleteModalMobile id={id} price_of={priceOf} handleConfirmationDelPriceModalMobile={handleConfirmationDelPriceModalMobile}/>
            }
        </div>












            <div className='priceModalContainer'>
                <div className='priceModalContainer__btnCloseModal'>
                    {
                        !confirmationDelPricesModal&&!inputChanges?
                        <Link onClick={closeM} className='priceModalContainer__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                        :
                        <div onClick={unsavedChanges} className='priceModalContainer__btnCloseModal__prop'>Cerrar</div>
                    }
                </div>
                <div className='priceModalContainer__header'>
                    <div className='priceModalContainer__header__label'>Precio de</div>
                    <div className='priceModalContainer__header__label'>Valor</div>
                    <div className='priceModalContainer__header__label'>Categoría</div>
                </div>
                <div className='priceModalContainer__itemPrice'>
                    {
                        !confirmationDelPricesModal?
                        <>
                            <div className='priceModalContainer__itemPrice__input'>
                                <input className='priceModalContainer__itemPrice__input__prop' value={!inputPriceOf?priceOf:inputPriceOf} onChange={handleInputPriceOf}/>
                            </div>
                            <div className='priceModalContainer__itemPrice__input'>
                                <input className='priceModalContainer__itemPrice__input__prop' value={!inputValuePriceOf?valuePriceOf:inputValuePriceOf} onChange={handleInputValuePriceOf}/>
                            </div>
                            <div className='priceModalContainer__itemPrice__select'>
                                <select className='priceModalContainer__itemPrice__select__prop' value={inputCreateCategory} onChange={(e) => {handleInputCreateCategory(e.target.value)}}>
                                    {optionsService.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='priceModalContainer__itemPrice__btns'>
                                <button className='priceModalContainer__itemPrice__btns__btn' onClick={handleBtnDelPrice}>Borrar</button>
                                <button id='btnUpdateItemPriceOf' className='priceModalContainer__itemPrice__btns__btn' onClick={handleBtnUpdPrice}>Actualizar</button>
                                {showSpinner&&<Spinner/>}
                            </div>
                        </>
                        :
                        <>
                            <div className='priceModalContainer__itemPrice__input'>
                                <input disabled className='priceModalContainer__itemPrice__input__prop' value={!inputPriceOf?priceOf:inputPriceOf} onChange={handleInputPriceOf}/>
                            </div>
                            <div className='priceModalContainer__itemPrice__input'>
                                <input disabled className='priceModalContainer__itemPrice__input__prop' value={!inputValuePriceOf?valuePriceOf:inputValuePriceOf} onChange={handleInputValuePriceOf}/>
                            </div>
                            <div className='priceModalContainer__itemPrice__select'>
                                <select disabled className='priceModalContainer__itemPrice__select__prop' value={inputCreateCategory} onChange={(e) => {handleInputCreateCategory(e.target.value)}}>
                                    {optionsService.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='priceModalContainer__itemPrice__btns'>
                                <button className='priceModalContainer__itemPrice__btns__btn'>Borrar</button>
                                <button disabled style={buttonDisabledStyle} id='btnUpdateItemPriceOf' className='priceModalContainer__itemPrice__btns__btn'>Actualizar</button>
                            </div>
                        </>
                    }
                </div>
                {
                    confirmationDelPricesModal&&<ConfirmationDeleteItemPriceOfModal id={id} inputPriceOf={inputPriceOf?inputPriceOf:priceOf} handleConfirmationDelPricesModal={handleConfirmationDelPricesModal}/>
                }
            </div>
        </>
        )
}

export default PricesListModal
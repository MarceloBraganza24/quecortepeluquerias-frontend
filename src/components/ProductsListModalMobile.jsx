import React, { useState, useEffect, useContext } from 'react'
import {OpenModalContext} from '../context/OpenModalContext';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';

const ProductsListModalMobile = ({id,title,description,price,stock,category,handleUpdateProductModalMobileLocal}) => {
    const [inputTitleIProd, setInputTitleIProd] = useState('');
    const [inputDescriptionIProd, setInputDescriptionIProd] = useState('');
    const [inputPriceIProd, setInputPriceIProd] = useState('');
    const [inputStockIProd, setInputStockIProd] = useState('');
    const [inputCategoryIProd, setInputCategoryIProd] = useState('');
    const [confirmationDelProductsModalMobile, handleConfirmationDelProductsModalMobile] = useState(false);
    const {handleUpdateProductModalMobile} = useContext(OpenModalContext);
    const [inputChanges, setInputChanges] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

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

    const handleInputTitleIProd = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputTitleIProd(textToSaved)
        texto==title?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(inputDescriptionIProd!=description && inputDescriptionIProd!='')setInputChanges(true);
        if(inputPriceIProd!=price && inputPriceIProd!='')setInputChanges(true);
        if(inputStockIProd!=stock && inputStockIProd!='')setInputChanges(true);
        if(inputCategoryIProd!==category && inputCategoryIProd!=='')setInputChanges(true);
    };

    const handleInputDescriptionIProd = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputDescriptionIProd(textToSaved)
        texto==description?setInputChanges(false):setInputChanges(true);
        texto==''&&setInputChanges(false);
        if(inputTitleIProd!=title && inputTitleIProd!='')setInputChanges(true);
        if(inputPriceIProd!=price && inputPriceIProd!='')setInputChanges(true);
        if(inputStockIProd!=stock && inputStockIProd!='')setInputChanges(true);
        if(inputCategoryIProd!==category && inputCategoryIProd!=='')setInputChanges(true);
    };

    const handleInputPriceIProd = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputPriceIProd(inputValue);
            inputValue==price?setInputChanges(false):setInputChanges(true);
            inputValue==''&&setInputChanges(false);
            if(inputTitleIProd!==title && inputTitleIProd!=='')setInputChanges(true);
            if(inputDescriptionIProd!=description && inputDescriptionIProd!='')setInputChanges(true);
            if(inputStockIProd!==stock && inputStockIProd!=='')setInputChanges(true);
            if(inputCategoryIProd!==category && inputStockIProd!=='')setInputChanges(true);
        }
    };

    const handleInputStockIProd = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputStockIProd(inputValue);
            inputValue==stock?setInputChanges(false):setInputChanges(true);
            inputValue==''&&setInputChanges(false);
            if(inputTitleIProd!==title && inputTitleIProd!=='')setInputChanges(true);
            if(inputDescriptionIProd!=description && inputDescriptionIProd!='')setInputChanges(true);
            if(inputPriceIProd!=price && inputPriceIProd!='')setInputChanges(true);
            if(inputCategoryIProd!==category && inputStockIProd!=='')setInputChanges(true);
        }
    };

    const handleInputCategoryIProd = (e) => {
        const texto = e.target.value;
        const textToSaved = cleanText(texto);
        setInputCategoryIProd(textToSaved)
        texto===category?setInputChanges(false):setInputChanges(true);
        texto===''&&setInputChanges(false);
        if(inputTitleIProd!==title && inputTitleIProd!=='')setInputChanges(true);
        if(inputDescriptionIProd!==description && inputDescriptionIProd!=='')setInputChanges(true);
        if(inputPriceIProd!=price && inputPriceIProd!='')setInputChanges(true);
        if(inputStockIProd!==stock && inputStockIProd!=='')setInputChanges(true);
    };
    
    const handleBtnDelProduct = async() => {
        handleConfirmationDelProductsModalMobile(true);
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }
    
    const handleBtnUpdProduct = async() => {

        if ((inputTitleIProd == title || inputTitleIProd == '') && (inputDescriptionIProd == description || inputDescriptionIProd == '') && (inputPriceIProd == price || inputPriceIProd == '') && (inputStockIProd == stock || inputStockIProd == '') && (inputCategoryIProd == category || inputCategoryIProd == '')) {
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
        } else if (!isValidUTF8(inputTitleIProd)) {
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
        } else if (!isValidUTF8(inputDescriptionIProd)) {
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
        } else if (!isValidUTF8(inputPriceIProd)) {
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
        } else if (!isValidUTF8(inputStockIProd)) {
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
        } else if (!isValidUTF8(inputCategoryIProd)) {
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
            document.getElementById('btnUpdateProduct').style.display = 'none';
            setShowSpinner(true);
            const productToUpdate = {
                title: inputTitleIProd?cleanString(inputTitleIProd):title,
                description: inputDescriptionIProd?cleanString(inputDescriptionIProd):description,
                price: inputPriceIProd?inputPriceIProd:price,
                stock: inputStockIProd?inputStockIProd:stock,
                category: inputCategoryIProd?cleanString(inputCategoryIProd):category
            }
            const response = await fetch(`${apiUrl}/api/products/${id}`, {
                method: 'PUT',         
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToUpdate)
            })
            const data = await response.json();
            if(response.ok) {
                toast('Has actualizado el producto correctamente!', {
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
                    handleUpdateProductModalMobile(false);
                    handleUpdateProductModalMobileLocal(false);
                    setInputChanges(false);
                }, 1500);
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
                document.getElementById('btnUpdateProduct').style.display = 'block';
                setShowSpinner(false);
            }
        }
    };

    const ConfirmationDeleteModal = () => {
        const handleBtnDelProduct = async() => {
            setShowSpinner(true);
            const response = await fetch(`${apiUrl}/api/products/${id}`, {
                method: 'DELETE'
            })
            if(response.ok) {
                toast('Has eliminado el producto correctamente!', {
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
                    handleUpdateProductModalMobile(false);
                    handleUpdateProductModalMobileLocal(false);
                    handleConfirmationDelProductsModalMobile(false);
                    setInputChanges(false);
                }, 2000);
            } else {
                toast('Has ocurrido un error al querer eliminar el producto!', {
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
            }
        };

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelProductsModalMobile(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnUpdatePartnersListModalContainerMobile'>
                    <div className='confirmationDeleteBtnUpdatePartnersListModalContainerMobile__ask'>¿Estás seguro que deseas borrar el producto?</div>
                    <div className='confirmationDeleteBtnUpdatePartnersListModalContainerMobile__askMobile'>
                        <div className='confirmationDeleteBtnUpdatePartnersListModalContainerMobile__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnUpdatePartnersListModalContainerMobile__askMobile__ask'>borrar el producto?</div>
                    </div>
                    <div className='confirmationDeleteBtnUpdatePartnersListModalContainerMobile__btns'>
                        <button onClick={handleBtnDelProduct} className='confirmationDeleteBtnUpdatePartnersListModalContainerMobile__btns__btn'>Si</button>
                        <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnUpdatePartnersListModalContainerMobile__btns__btn'>No</button>
                        {showSpinner&&<Spinner/>}
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdateProductModalMobile(false);
        handleUpdateProductModalMobileLocal(false);
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

    const tagDisabled = {
        backgroundColor: 'white',
        color: 'black'
    };

  return (
    <>
     <div className='updateProductModalContainerMobile'>
            <div className='updateProductModalContainerMobile__btnCloseModal'>
                {
                    !confirmationDelProductsModalMobile&&!inputChanges?
                    <>
                        <Link onClick={closeM} className='updateProductModalContainerMobile__btnCloseModal__prop'>
                            Cerrar
                        </Link>
                    </>
                        :
                    <>
                        <div onClick={unsavedChanges} className='updateProductModalContainerMobile__btnCloseModal__prop'>Cerrar</div>
                    </>
                }
            </div>
            {
                !confirmationDelProductsModalMobile?
                <>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Título:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input className='updateProductModalContainerMobile__labelInput__input__prop' value={!inputTitleIProd?title:inputTitleIProd}onChange={handleInputTitleIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Descripción:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input className='updateProductModalContainerMobile__labelInput__input__prop' value={!inputDescriptionIProd?description:inputDescriptionIProd}onChange={handleInputDescriptionIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Precio:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input className='updateProductModalContainerMobile__labelInput__input__prop' value={!inputPriceIProd?price:inputPriceIProd}onChange={handleInputPriceIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Stock:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input className='updateProductModalContainerMobile__labelInput__input__prop' type='email' value={!inputStockIProd?stock:inputStockIProd}onChange={handleInputStockIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Categoría:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input className='updateProductModalContainerMobile__labelInput__input__prop' type='email' value={!inputCategoryIProd?category:inputCategoryIProd}onChange={handleInputCategoryIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__btns'>
                        <button className='updateProductModalContainerMobile__btns__btn' onClick={handleBtnDelProduct}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateProductModalContainerMobile__btns'>
                        <button id='btnUpdateProduct' className='updateProductModalContainerMobile__btns__btn' onClick={handleBtnUpdProduct}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateProductModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
                :
                <>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Título:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled className='updateProductModalContainerMobile__labelInput__input__prop' value={!inputTitleIProd?title:inputTitleIProd}onChange={handleInputTitleIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Descripción:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled className='updateProductModalContainerMobile__labelInput__input__prop' value={!inputDescriptionIProd?description:inputDescriptionIProd}onChange={handleInputDescriptionIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Precio:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled className='updateProductModalContainerMobile__labelInput__input__prop' value={!inputPriceIProd?price:inputPriceIProd}onChange={handleInputPriceIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Stock:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled className='updateProductModalContainerMobile__labelInput__input__prop' type='email' value={!inputStockIProd?stock:inputStockIProd}onChange={handleInputCategoryIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__labelInput'>
                        <div className='updateProductModalContainerMobile__labelInput__label'>
                            <div className='updateProductModalContainerMobile__labelInput__label__prop'>Categoría:</div>
                        </div>
                        <div className='updateProductModalContainerMobile__labelInput__input'>
                            <input style={tagDisabled} disabled className='updateProductModalContainerMobile__labelInput__input__prop' type='email' value={!inputCategoryIProd?category:inputCategoryIProd}onChange={handleInputCategoryIProd}/>
                        </div>
                    </div>
                    <div style={{paddingTop:'2vh'}} className='updateProductModalContainerMobile__btns'>
                        <button disabled className='updateProductModalContainerMobile__btns__btn' onClick={handleBtnDelProduct}>Borrar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateProductModalContainerMobile__btns'>
                        <button disabled id='btnUpdateProduct' className='updateProductModalContainerMobile__btns__btn' onClick={handleBtnUpdProduct}>Actualizar</button>
                    </div>
                    <div style={{paddingTop:'1vh'}} className='updateProductModalContainerMobile__btns'>
                        {showSpinner&&<Spinner/>}
                    </div>
                </>
            }
            {
                confirmationDelProductsModalMobile&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
  )
}

export default ProductsListModalMobile
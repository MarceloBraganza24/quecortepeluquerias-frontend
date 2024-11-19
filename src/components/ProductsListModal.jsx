import React, {useState,useContext} from 'react'
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Spinner from './Spinner';
import {OpenModalContext} from '../context/OpenModalContext';

const ProductsListModal = ({id,title,description,price,stock,category,handleUpdateProductModalLocal}) => {
    const [inputTitleIProd, setInputTitleIProd] = useState('');
    const [inputDescriptionIProd, setinputDescriptionIProd] = useState('');
    const [inputPriceIProd, setInputPriceIProd] = useState('');
    const [inputStockIProd, setInputStockIProd] = useState('');
    const [inputCategoryIProd, setInputCategoryIProd] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const [confirmationDelProvidersModal, handleConfirmationDelProvidersModal] = useState(false);
    const {handleUpdateProductModal} = useContext(OpenModalContext);
    const [inputChanges, setInputChanges] = useState(false);
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

    const handleInputTitleIProd = (e) => {
        const inputValue = e.target.value;
        const textToSaved = cleanText(inputValue);
        setInputTitleIProd(textToSaved)
        inputValue===title?setInputChanges(false):setInputChanges(true);
        inputValue===''&&setInputChanges(false);
        if(inputDescriptionIProd!==description && inputDescriptionIProd!=='')setInputChanges(true);
        if(inputPriceIProd!=price && inputPriceIProd!='')setInputChanges(true);
        if(inputStockIProd!=stock && inputStockIProd!='')setInputChanges(true);
        if(inputCategoryIProd!==category && inputCategoryIProd!=='')setInputChanges(true);
    };

    const handleInputDescriptionIProd = (e) => {
        const inputValue = e.target.value;
        const textToSaved = cleanText(inputValue);
        setinputDescriptionIProd(textToSaved)
        inputValue===description?setInputChanges(false):setInputChanges(true);
        inputValue===''&&setInputChanges(false);
        if(inputTitleIProd!==title && inputTitleIProd!=='')setInputChanges(true);
        if(inputPriceIProd!=price && inputPriceIProd!='')setInputChanges(true);
        if(inputStockIProd!=stock && inputStockIProd!='')setInputChanges(true);
        if(inputCategoryIProd!==category && inputCategoryIProd!=='')setInputChanges(true);
    };

    const handleInputPriceIProd = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputPriceIProd(inputValue);
            Number(inputValue)===price?setInputChanges(false):setInputChanges(true);
            inputValue===''&&setInputChanges(false);
            if(inputTitleIProd!==title && inputTitleIProd!=='')setInputChanges(true);
            if(inputDescriptionIProd!==description && inputDescriptionIProd!=='')setInputChanges(true);
            if(inputStockIProd!=stock && inputStockIProd!='')setInputChanges(true);
            if(inputCategoryIProd!==category && inputCategoryIProd!=='')setInputChanges(true);
        }
    };

    const handleInputStockIProd = (e) => {
        const inputValue = e.target.value;
        if (/^\d*$/.test(inputValue)) {
            setInputStockIProd(inputValue);
            Number(inputValue)===stock?setInputChanges(false):setInputChanges(true);
            inputValue===''&&setInputChanges(false);
            if(inputTitleIProd!==title && inputTitleIProd!=='')setInputChanges(true);
            if(inputDescriptionIProd!==description && inputDescriptionIProd!=='')setInputChanges(true);
            if(inputPriceIProd!=price && inputPriceIProd!='')setInputChanges(true);
            if(inputCategoryIProd!==category && inputCategoryIProd!=='')setInputChanges(true);
        }
    };

    const handleInputCategoryIProd = (e) => {
        const inputValue = e.target.value;
        const textToSaved = cleanText(inputValue);
        setInputCategoryIProd(textToSaved)
        inputValue===category?setInputChanges(false):setInputChanges(true);
        inputValue===''&&setInputChanges(false);
        if(inputTitleIProd!==title && inputTitleIProd!=='')setInputChanges(true);
        if(inputDescriptionIProd!==description && inputDescriptionIProd!=='')setInputChanges(true);
        if(inputPriceIProd!=price && inputPriceIProd!='')setInputChanges(true);
        if(inputStockIProd!=stock && inputStockIProd!='')setInputChanges(true);
    };

    const handleBtnDelProduct = async() => {
        handleConfirmationDelProvidersModal(true)
    };

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnUpdProduct = async() => {
        if (!isValidUTF8(inputTitleIProd)) {
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
        } else if ((inputTitleIProd == title || inputTitleIProd == '') && (inputDescriptionIProd == description || inputDescriptionIProd == '') && (inputPriceIProd == price || inputPriceIProd == '') && (inputStockIProd == stock || inputStockIProd == '') && (inputCategoryIProd == category || inputCategoryIProd == '')) {
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
                    handleUpdateProductModal(false);
                    handleUpdateProductModalLocal(false);
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
                method: 'DELETE',         
                headers: {
                    'Content-Type': 'application/json',
                }
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
                    handleUpdateProductModal(false);
                    handleUpdateProductModalLocal(false);
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
            }
        };

        const handleBtnConfirmationDeleteBtnNo = () => {
            handleConfirmationDelProvidersModal(false);
        }

        return (
            <>
                <div className='confirmationDeleteBtnProductsListModalContainer'>
                    <div className='confirmationDeleteBtnProductsListModalContainer__ask'>¿Estás seguro que deseas borrar el producto?</div>
                    <div className='confirmationDeleteBtnProductsListModalContainer__askMobile'>
                        <div className='confirmationDeleteBtnProductsListModalContainer__askMobile__ask'>¿Estás seguro que deseas</div>
                        <div className='confirmationDeleteBtnProductsListModalContainer__askMobile__ask'>borrar el producto?</div>
                    </div>
                    <div className='confirmationDeleteBtnProductsListModalContainer__btnsContainer'>
                        <div className='confirmationDeleteBtnProductsListModalContainer__btnsContainer__btns'>
                            <div></div>
                        </div>
                        <div className='confirmationDeleteBtnProductsListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnDelProduct} className='confirmationDeleteBtnProductsListModalContainer__btnsContainer__btns__prop'>Si</button>
                        </div>
                        <div className='confirmationDeleteBtnProductsListModalContainer__btnsContainer__btns'>
                            <button onClick={handleBtnConfirmationDeleteBtnNo} className='confirmationDeleteBtnProductsListModalContainer__btnsContainer__btns__prop'>No</button>
                        </div>
                        <div className='confirmationDeleteBtnProductsListModalContainer__btnsContainer__btns'>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const closeM = () => {
        handleUpdateProductModal(false);
        handleUpdateProductModalLocal(false);
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
        color: '#d2b569',
        cursor: 'pointer'
    };

    return (
    <>
        <div className='productsModalContainer'>
            <div className='productsModalContainer__btnCloseModal'>
                {
                    !confirmationDelProvidersModal&&!inputChanges?
                    <Link onClick={closeM} className='productsModalContainer__btnCloseModal__prop'>
                        Cerrar
                    </Link>
                    :
                    <div onClick={unsavedChanges} className='productsModalContainer__btnCloseModal__prop'>Cerrar</div>
                }
            </div>
            <div className='productsModalContainer__header'>
                <div className='productsModalContainer__header__label'>Titulo</div>
                <div className='productsModalContainer__header__label'>Descripción</div>
                <div className='productsModalContainer__header__label'>Precio</div>
                <div className='productsModalContainer__header__label'>Stock</div>
                <div className='productsModalContainer__header__label'>Categoría</div>
            </div>
            <div className='productsModalContainer__itemProduct'>
                {
                    !confirmationDelProvidersModal?
                    <>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input className='productsModalContainer__itemProduct__input__prop' value={!inputTitleIProd?title:inputTitleIProd} onChange={handleInputTitleIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input className='productsModalContainer__itemProduct__input__prop' value={!inputDescriptionIProd?description:inputDescriptionIProd} onChange={handleInputDescriptionIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input className='productsModalContainer__itemProduct__input__prop' maxLength={8} value={!inputPriceIProd?price:inputPriceIProd} onChange={handleInputPriceIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input className='productsModalContainer__itemProduct__input__prop' maxLength={6} value={!inputStockIProd?stock:inputStockIProd} onChange={handleInputStockIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input className='productsModalContainer__itemProduct__input__prop' value={!inputCategoryIProd?category:inputCategoryIProd} onChange={handleInputCategoryIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__btns'>
                            <button className='productsModalContainer__itemProduct__btns__btn' onClick={handleBtnDelProduct}>Borrar</button>
                            <button id='btnUpdateProduct' className='productsModalContainer__itemProduct__btns__btn' onClick={handleBtnUpdProduct}>Actualizar</button>
                            {showSpinner&&<Spinner/>}
                        </div>
                    </>
                    :
                    <>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input disabled className='productsModalContainer__itemProduct__input__prop' value={!inputTitleIProd?title:inputTitleIProd} onChange={handleInputTitleIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input disabled className='productsModalContainer__itemProduct__input__prop' value={!inputDescriptionIProd?description:inputDescriptionIProd} onChange={handleInputDescriptionIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input disabled className='productsModalContainer__itemProduct__input__prop' value={!inputPriceIProd?price:inputPriceIProd} onChange={handleInputPriceIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input disabled className='productsModalContainer__itemProduct__input__prop' value={!inputStockIProd?stock:inputStockIProd} onChange={handleInputStockIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__input'>
                            <input disabled className='productsModalContainer__itemProduct__input__prop' value={!inputCategoryIProd?category:inputCategoryIProd} onChange={handleInputCategoryIProd}/>
                        </div>
                        <div className='productsModalContainer__itemProduct__btns'>
                            <button className='productsModalContainer__itemProduct__btns__btn'>Borrar</button>
                            <button disabled style={buttonDisabledStyle} id='btnCreateProduct' className='productsModalContainer__itemProduct__btns__btn'>Actualizar</button>
                        </div>
                    </>
                }
            </div>
            {
                confirmationDelProvidersModal&&<ConfirmationDeleteModal/>
            }
        </div>
    </>
    )
}

export default ProductsListModal
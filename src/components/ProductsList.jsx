import React, { useEffect, useContext, useState } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';
import { toast } from "react-toastify";
import {IsLoggedContext} from '../context/IsLoggedContext';
import {InputDataProdContext} from '../context/InputDataProdContext';
import HMenu from './HMenu';
import ItemProduct from './ItemProduct';
import { Link } from 'react-router-dom';
import {OpenModalContext} from '../context/OpenModalContext'; 
import Spinner from './Spinner';
import CreateProductModalMobile from './CreateProductModalMobile';

const ProductsList = () => {
    const { inputTitleProd, handleInputTitleProd, inputDescriptionProd, handleInputDescriptionProd, inputPriceProd, handleInputPriceProd, inputStockProd, handleInputStockProd, inputCategoryProd, handleInputCategoryProd,handleEmptyInputTitleProd,handleEmptyInputDescriptionProd,handleEmptyInputPriceProd,handleEmptyInputStockProd,handleEmptyInputCategoryProd } = useContext(InputDataProdContext);
    const {isLoggedIn, login, logout} = useContext(IsLoggedContext);
    const [user, setUser] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const [inputFilteredProducts, setInputFilteredProducts] = useState('');
    const [products, setProducts] = useState([]);
    const {menuOptionsModal,handleMenuOptionsModal,updateProductModalMobile,createProductModalMobile,updateProductsModal,handleCreateProductModalMobile} = useContext(OpenModalContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [isMonted, setIsMonted] = useState(false);
    const [isOpenCreateProductModalLocalMobile, setIsOpenCreateProductModalLocalMobile] = useState(false);
    
    function cleanString(input) {
        let trimmed = input.trim();
        let cleaned = trimmed.replace(/\s+/g, ' ');
        return cleaned;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            menuOptionsModal&&handleMenuOptionsModal(false);
            async function fetchData() {
                const response = await fetch(`${apiUrl}/api/products`)
                const productsAll = await response.json();
                setProducts(productsAll.data)
            }
            fetchData();

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
            const fetchUser = async () => {
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
            fetchUser();
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
        async function fetchData() {
            const response = await fetch(`${apiUrl}/api/products`)
            const productsAll = await response.json();
            setProducts(productsAll.data)
        }
        fetchData();

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
        const fetchUser = async () => {
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
        fetchUser();
        if(cookieValue) {
            login()
          } else {
            logout()
        }
        setTimeout(() => {
            setIsMonted(true);
        }, 10000)
    }, []);

    products.sort((a, b) => {
        return new Date(b.product_datetime) - new Date(a.product_datetime);
    });

    function filtrarPorTitulo(valorIngresado) {
        const valorMinusculas = valorIngresado.toLowerCase();
        const objetosFiltrados = products.filter(objeto => {
            const nombreMinusculas = objeto.title.toLowerCase();
            return nombreMinusculas.includes(valorMinusculas);
        });
        return objetosFiltrados;
    }
    const objetosFiltrados = filtrarPorTitulo(inputFilteredProducts);    

    function isValidUTF8(str) {
        const utf8Regex = /^[\u0000-\uD7FF\uE000-\uFFFF]*$/;
        return utf8Regex.test(str);
    }

    const handleBtnCreateProduct = async() => {
        if(!inputTitleProd || !inputDescriptionProd || !inputPriceProd || !inputStockProd || !inputCategoryProd) {
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
        } else if (!isValidUTF8(inputTitleProd)) {
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
        } else if (!isValidUTF8(inputDescriptionProd)) {
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
        } else if (!isValidUTF8(inputPriceProd)) {
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
        } else if (!isValidUTF8(inputStockProd)) {
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
        } else if (!isValidUTF8(inputCategoryProd)) {
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
                title: cleanString(inputTitleProd),
                description: cleanString(inputDescriptionProd),
                price: inputPriceProd,
                stock: inputStockProd,
                category: cleanString(inputCategoryProd),
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
                    cleanPropsCreateProduct();
                    document.getElementById('btnCreateProduct').style.display = 'block';
                    setShowSpinner(false);
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

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };

    const selectDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: 'white'
    };

    const cleanPropsCreateProduct = () => {
        handleEmptyInputTitleProd('');
        handleEmptyInputDescriptionProd('');
        handleEmptyInputPriceProd('');
        handleEmptyInputStockProd('');
        handleEmptyInputCategoryProd('');
    };

    const handleBtnCreateProductModalMobile = () => {
        setIsOpenCreateProductModalLocalMobile(true);
        handleCreateProductModalMobile(true);
    };

  return (
    <>
        <NavBar/>
        {
            isLoggedIn && user.role==='admin'?
            <>
                <div className='productsListContainer'>
                    <div className='productsListContainer__title'>- Productos -</div>
                    <div className='productsListContainer__inputFilteredProducts'>
                        {
                            !updateProductsModal&&!createProductModalMobile&&!updateProductModalMobile?
                            <input type='text' className='productsListContainer__inputFilteredProducts__prop' placeholder='Ingrese un producto' value={inputFilteredProducts} onChange={(e) => {setInputFilteredProducts(e.target.value)}}/>
                            :
                            <input disabled style={selectDisabledStyle} type='text' className='productsListContainer__inputFilteredProducts__prop' placeholder='Ingrese un producto' value={inputFilteredProducts} onChange={(e) => {setInputFilteredProducts(e.target.value)}}/>
                        }
                    </div>
                    <div className='productsListContainer__createProductMobile'>
                        <button onClick={handleBtnCreateProductModalMobile} className='productsListContainer__createProductMobile__btnCreateProduct'>Crear producto</button>
                        {isOpenCreateProductModalLocalMobile&&<CreateProductModalMobile setIsOpenCreateProductModalLocalMobile={setIsOpenCreateProductModalLocalMobile}/>}
                    </div>
                    <div className='productsListContainer__productsList'>
                        <div className='productsListContainer__productsList__lengthShifts'>
                            <div className='productsListContainer__productsList__lengthShifts__prop'>Cantidad de productos: {objetosFiltrados.length}</div>
                        </div>
                        {
                            objetosFiltrados.length!=0&&
                            <div className='productsListContainer__productsList__headerMobile'>
                                <div className='productsListContainer__productsList__headerMobile__label'>Título</div>
                                <div className='productsListContainer__productsList__headerMobile__label'>Precio</div>
                                <div className='productsListContainer__productsList__headerMobile__label'>Stock</div>
                            </div>
                        }
                        <div className='productsListContainer__productsList__header'>
                            <div className='productsListContainer__productsList__header__label'>Título</div>
                            <div className='productsListContainer__productsList__header__label'>Descripción</div>
                            <div className='productsListContainer__productsList__header__label'>Precio</div>
                            <div className='productsListContainer__productsList__header__label'>Stock</div>
                            <div className='productsListContainer__productsList__header__label'>Categoría</div>
                        </div>
                        <div className='itemCreateProduct'>
                            {
                                !updateProductsModal?
                                <>
                                    <div className='itemCreateProduct__input'>
                                        <input type='text' className='itemCreateProduct__input__prop' placeholder='-' value={inputTitleProd} onChange={handleInputTitleProd}/>
                                    </div>
                                    <div className='itemCreateProduct__input'>
                                        <input className='itemCreateProduct__input__prop' placeholder='-' value={inputDescriptionProd} onChange={handleInputDescriptionProd}/>
                                    </div>
                                    <div className='itemCreateProduct__input'>
                                        <input className='itemCreateProduct__input__prop' placeholder='-' maxLength={8} value={inputPriceProd} onChange={handleInputPriceProd}/>
                                    </div>
                                    <div className='itemCreateProduct__input'>
                                        <input className='itemCreateProduct__input__prop' placeholder='-' maxLength={6} value={inputStockProd} onChange={handleInputStockProd}/>
                                    </div>
                                    <div className='itemCreateProduct__input'>
                                        <input type='text' className='itemCreateProduct__input__prop' placeholder='-' value={inputCategoryProd} onChange={handleInputCategoryProd}/>
                                    </div>
                                    <div className='itemCreateProduct__btns'>
                                        <button id='btnCreateProduct' className='itemCreateProduct__btns__btn' onClick={handleBtnCreateProduct}>Registrar producto</button>
                                        {showSpinner&&<Spinner/>}
                                    </div>
                                </>
                                :
                                <>
                                    <div className='itemCreateProduct__input'>
                                        <input disabled type='text' className='itemCreateProduct__input__prop' placeholder='-' value={inputTitleProd} onChange={handleInputTitleProd}/>
                                    </div>
                                    <div className='itemCreateProduct__input'>
                                        <input disabled className='itemCreateProduct__input__prop' placeholder='-' value={inputDescriptionProd} onChange={handleInputDescriptionProd}/>
                                    </div>
                                    <div className='itemCreateProduct__input'>
                                        <input disabled className='itemCreateProduct__input__prop' placeholder='-' value={inputPriceProd} onChange={handleInputPriceProd}/>
                                    </div>
                                    <div className='itemCreateProduct__input'>
                                        <input disabled className='itemCreateProduct__input__prop' placeholder='-' value={inputStockProd} onChange={handleInputStockProd}/>
                                    </div>
                                    <div className='itemCreateProduct__input'>
                                        <input disabled type='text' className='itemCreateProduct__input__prop' placeholder='-' value={inputCategoryProd} onChange={handleInputCategoryProd}/>
                                    </div>
                                    <div className='itemCreateProduct__btns'>
                                        <button disabled id='btnCreateProduct' style={buttonDisabledStyle} className='itemCreateProduct__btns__btn' onClick={handleBtnCreateProduct}>Registrar producto</button>
                                    </div>
                                </>
                            }
                        </div>
                        {
                            objetosFiltrados.map((product) => {
                                return(
                                    <ItemProduct
                                    id={product._id}
                                    title={product.title}
                                    description={product.description}
                                    price={product.price}
                                    stock={product.stock}
                                    category={product.category}
                                    />
                                )
                            })
                        }
                    </div>
                        {
                            (objetosFiltrados.length == 0) &&
                            <div className='myShiftsListContainer__withoutItems'>Aún no existen productos</div>
                        }
                </div>
                {
                    (objetosFiltrados.length == 0) ?
                    <>
                        <div className='productsListContainer__blackDiv' style={{padding:'10vh 0vh'}}></div>
                        <div className='productsListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 1) ?
                    <>
                        <div className='productsListContainer__blackDiv' style={{padding:'10vh 0vh'}}></div>
                        <div className='productsListContainer__blackDivMobile' style={{padding:'15vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 2) ?
                    <>
                        <div className='productsListContainer__blackDiv' style={{padding:'8vh 0vh'}}></div>
                        <div className='productsListContainer__blackDivMobile' style={{padding:'10vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 3) ?
                    <>
                        <div className='productsListContainer__blackDiv' style={{padding:'4vh 0vh'}}></div>
                        <div className='productsListContainer__blackDivMobile' style={{padding:'5vh 0vh'}}></div>
                    </>
                    : (objetosFiltrados.length == 4) ?
                    <div className='productsListContainer__blackDivMobile' style={{padding:'1vh 0vh'}}></div>
                    : (objetosFiltrados.length == 5) &&
                    <div className='productsListContainer__blackDivMobile' style={{padding:'0vh 0vh'}}></div>
                }
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

export default ProductsList
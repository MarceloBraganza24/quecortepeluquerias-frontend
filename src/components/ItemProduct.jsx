import React, { useContext,useState } from 'react'
import ProductsListModal from './ProductsListModal';
import {OpenModalContext} from '../context/OpenModalContext'; 
import ProductsListModalMobile from './ProductsListModalMobile';

const ItemProduct = ({id,title,description,price,stock,category}) => {

    const {updateProductsModal,createProductModalMobile,updateProductModalMobile,handleUpdateProductModal,handleUpdateProductModalMobile} = useContext(OpenModalContext);
    const [updateProductModalLocal, handleUpdateProductModalLocal] = useState(false);
    const [updateProductModalMobileLocal, handleUpdateProductModalMobileLocal] = useState(false);

    const handleBtnUpdProduct = () => {
        handleUpdateProductModal(true);
        handleUpdateProductModalLocal(true);
    };

    const handleBtnUpdProductMobile = () => {
        handleUpdateProductModalMobile(true);
        handleUpdateProductModalMobileLocal(true);
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };
 
  return (
    <>
        <div className='itemProductMobile'>
            <div className='itemProductMobile__input no-scroll'>
                <div className='itemProductMobile__input__prop'>{title}</div>
            </div>
            <div className='itemProductMobile__input no-scroll'>
                <div className='itemProductMobile__input__prop'>$ {price}</div>
            </div>
            <div className='itemProductMobile__input no-scroll'>
                <div className='itemProductMobile__input__prop'>{stock}</div>
            </div>
            {
                !updateProductModalMobile&&!createProductModalMobile?
                <>
                    <div className='itemProductMobile__btns'>
                        <button className='itemProductMobile__btns__btn' onClick={handleBtnUpdProductMobile}>+</button>
                    </div>
                </>
                :
                <div className='itemProductMobile__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemProductMobile__btns__btn'>+</button>
                </div>
            }
            {
                updateProductModalMobileLocal&&
                    <ProductsListModalMobile
                    handleUpdateProductModalMobileLocal={handleUpdateProductModalMobileLocal}
                    id={id}
                    title={title}
                    description={description}
                    price={price}
                    stock={stock}
                    category={category}
                    />
            }
        </div>
        <div className='itemProduct'>
            <div className='itemProduct__input no-scroll'>
                <div className='itemProduct__input__prop'>{title}</div>
            </div>
            <div className='itemProduct__input no-scroll'>
                <div className='itemProduct__input__prop'>{description}</div>
            </div>
            <div className='itemProduct__input no-scroll'>
                <div className='itemProduct__input__prop'>$ {price}</div>
            </div>
            <div className='itemProduct__input no-scroll'>
                <div className='itemProduct__input__prop'>{stock}</div>
            </div>
            <div className='itemProduct__input no-scroll'>
                <div className='itemProduct__input__prop'>{category}</div>
            </div>
            {
                !updateProductsModal?
                <div className='itemProduct__btns'>
                    <button className='itemProduct__btns__btn' onClick={handleBtnUpdProduct}>Editar</button>
                </div>
                :
                <div className='itemProduct__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemProduct__btns__btn'>Editar</button>
                </div>
            }
        </div>
        {
            updateProductModalLocal && 
            <ProductsListModal
            handleUpdateProductModalLocal={handleUpdateProductModalLocal}
            id={id}
            title={title}
            description={description}
            price={price}
            stock={stock}
            category={category}
            />
        }
    </>
  )
}

export default ItemProduct
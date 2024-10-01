    import React, { useState, useContext } from 'react'
import PricesListModal from './PricesListModal';
import {OpenModalContext} from '../context/OpenModalContext';

const ItemPrice = ({id,priceOf,valuePriceOf,category}) => {
    const [isPricesListModalOpen, setIsPricesListModalOpen] = useState(false);
    const {updatePricesModal,handleUpdatePriceModal} = useContext(OpenModalContext);
    
    const handleBtnUpdPrice = async() => {
        handleUpdatePriceModal(true);
        setIsPricesListModalOpen(true);
    };

    const buttonDisabledStyle = {
        color: 'white',
        cursor: 'pointer',
        backgroundColor: '#04064e'
    };

    function capitalizeFirstLetter(string) {
        if (!string) return string; // Maneja el caso de una cadena vacía
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const priceOfM = capitalizeFirstLetter(priceOf);

  return (
    <div className='pricesContainerIsLoggedIn__pricesList__itemPrice'>
        <div className='pricesContainerIsLoggedIn__pricesList__itemPrice__label'>
            <div className='pricesContainerIsLoggedIn__pricesList__itemPrice__label__prop'>{priceOfM}</div>
        </div>
        <div className='pricesContainerIsLoggedIn__pricesList__itemPrice__input'>
            <div className='pricesContainerIsLoggedIn__pricesList__itemPrice__label__prop'>$ {valuePriceOf}</div>
        </div>
        {
            !updatePricesModal?
            <div className='pricesContainerIsLoggedIn__pricesList__itemPrice__btnLabels'>
                <button className='pricesContainerIsLoggedIn__pricesList__itemPrice__btnLabels__prop' onClick={handleBtnUpdPrice}>Editar</button>
            </div>
            :
            <div className='pricesContainerIsLoggedIn__pricesList__itemPrice__btnLabels'>
                <button style={buttonDisabledStyle} disabled className='pricesContainerIsLoggedIn__pricesList__itemPrice__btnLabels__prop'>Editar</button>
            </div>
        }
        {
            isPricesListModalOpen && 
            <PricesListModal
            setIsPricesListModalOpen={setIsPricesListModalOpen}
            id={id}
            priceOf={priceOf}
            valuePriceOf={valuePriceOf}
            category={category}
            />
        }
    </div>
  )
}

export default ItemPrice
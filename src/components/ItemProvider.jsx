import React, { useContext,useState } from 'react'
import ProvidersListModal from './ProvidersListModal';
import {OpenModalContext} from '../context/OpenModalContext'; 
import ProvidersListModalMobile from './ProvidersListModalMobile';

const ItemProvider = ({id,businessName,cuitCuil,phone,email}) => {
    
    const {updateProviderModal,createProviderModalMobile,updateProviderModalMobile,handleUpdateProviderModal,handleUpdateProviderModalMobile} = useContext(OpenModalContext);
    const [updateProviderModalLocal, handleUpdateProviderModalLocal] = useState(false);
    const [updateProviderModalMobileLocal, handleUpdateProviderModalMobileLocal] = useState(false);

    const handleBtnUpdProvider = () => {
        handleUpdateProviderModal(true);
        handleUpdateProviderModalLocal(true);
    };

    const handleBtnUpdProviderMobile = () => {
        handleUpdateProviderModalMobile(true);
        handleUpdateProviderModalMobileLocal(true);
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer',
        backgroundColor: '#d2b569'
    };
 
  return (
    <>
        <div className='itemProviderMobile'>
            <div className='itemProviderMobile__input no-scroll'>
                <div className='itemProviderMobile__input__prop'>{businessName}</div>
            </div>
            <div className='itemProviderMobile__input no-scroll'>
                <div className='itemProviderMobile__input__prop'>{cuitCuil}</div>
            </div>
            {
                !updateProviderModalMobile&&!createProviderModalMobile?
                <>
                    <div className='itemProviderMobile__btns'>
                        <button className='itemProviderMobile__btns__btn' onClick={handleBtnUpdProviderMobile}>+</button>
                    </div>
                </>
                :
                <div className='itemProviderMobile__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemProviderMobile__btns__btn'>+</button>
                </div>
            }
            {
                updateProviderModalMobileLocal&&
                    <ProvidersListModalMobile
                    handleUpdateProviderModalMobileLocal={handleUpdateProviderModalMobileLocal}
                    id={id}
                    business_name={businessName}
                    cuit_cuil={cuitCuil}
                    phone={phone}
                    email={email}
                    />
            }
        </div>






        <div className='itemProvider'>
            <div className='itemProvider__input no-scroll'>
                <div className='itemProvider__input__prop'>{businessName}</div>
            </div>
            <div className='itemProvider__input no-scroll'>
                <div className='itemProvider__input__prop'>{cuitCuil}</div>
            </div>
            <div className='itemProvider__input no-scroll'>
                <div className='itemProvider__input__prop'>{phone}</div>
            </div>
            <div className='itemProvider__input no-scroll'>
                <div className='itemProvider__input__prop'>{email}</div>
            </div>
            {
                !updateProviderModal?
                <div className='itemProvider__btns'>
                    <button className='itemProvider__btns__btn' onClick={handleBtnUpdProvider}>Editar</button>
                </div>
                :
                <div className='itemProvider__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemProvider__btns__btn'>Editar</button>
                </div>
            }
        </div>
        {
            updateProviderModalLocal && 
            <ProvidersListModal
            handleUpdateProviderModalLocal={handleUpdateProviderModalLocal}
            id={id}
            businessName={businessName}
            cuitCuil={cuitCuil}
            phone={phone}
            email={email}
            />
        }
    </>
  )
}

export default ItemProvider
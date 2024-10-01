import React, { useContext, useEffect, useState } from 'react'
import UsersListModal from './UsersListModal';
import {OpenModalContext} from '../context/OpenModalContext';
import UsersListModalMobile from './UsersListModalMobile';

const ItemUser = ({id,first_name,last_name,email,role}) => {

    const {updateUsersModal,handleUpdateUserModal,updateUserModalMobile,createUserModalMobile,handleUpdateUserModalMobile} = useContext(OpenModalContext);
    const [updateUsersModalLocal, handleUpdateUsersModalLocal] = useState(false);
    const [updateUserModalMobileLocal, handleUpdateUserModalMobileLocal] = useState(false);

    const [isUserRoot, setIsUserRoot] = useState(false);

    useEffect(() => {
        if(email == 'marcelo_braganza@hotmail.com')setIsUserRoot(true);
    },[])

    const handleBtnUpdUser = () => {
        handleUpdateUserModal(true);
        handleUpdateUsersModalLocal(true);
    };

    const handleBtnUpdUserMobile = () => {
        handleUpdateUserModalMobile(true);
        handleUpdateUserModalMobileLocal(true);
    };

    const buttonDisabledStyle = {
        color: 'black',
        cursor: 'pointer'
    };
 
  return (
    <>
        <div className='itemUserMobile'>
            <div className='itemUserMobile__input no-scroll'>
                <div className='itemUserMobile__input__prop'>{first_name}</div>
            </div>
            <div className='itemUserMobile__input no-scroll'>
                <div className='itemUserMobile__input__prop'>{last_name}</div>
            </div>
            <div className='itemUserMobile__input no-scroll'>
                <div className='itemUserMobile__input__prop'>{email}</div>
            </div>
            <div className='itemUserMobile__input no-scroll'>
                <div className='itemUserMobile__input__prop'>{role}</div>
            </div>
            {
                !updateUserModalMobile&&!createUserModalMobile?
                <>
                    <div className='itemUserMobile__btns'>
                        <button className='itemUserMobile__btns__btn' onClick={handleBtnUpdUserMobile}>+</button>
                    </div>
                </>
                :
                <div className='itemUserMobile__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemUserMobile__btns__btn'>+</button>
                </div>
            }
            {
                updateUserModalMobileLocal&&
                    <UsersListModalMobile
                    handleUpdateUserModalMobileLocal={handleUpdateUserModalMobileLocal}
                    id={id}
                    first_name={first_name}
                    last_name={last_name}
                    email={email}
                    role={role}
                    />
            }
        </div>



        <div className='itemUser'>
            <div className='itemUser__input no-scroll'>
                <div className='itemUser__input__prop'>{first_name}</div>
            </div>
            <div className='itemUser__input no-scroll'>
                <div className='itemUser__input__prop'>{last_name}</div>
            </div>
            <div className='itemUser__input no-scroll'>
                <div className='itemUser__input__prop'>{email}</div>
            </div>
            <div className='itemUser__input no-scroll'>
                <div className='itemUser__input__prop'>{role}</div>
            </div>
            <div className='itemUser__input'>
                <div className='itemUser__input__prop'>-</div>
            </div>
            {
                !updateUsersModalLocal&&isUserRoot?
                <div className='itemUser__btns'>
                    <button style={{backgroundColor: 'yellow'}} className='itemUser__btns__btn'>Editar</button>
                </div>
                :
                !updateUsersModal?
                <div className='itemUser__btns'>
                    <button className='itemUser__btns__btn' onClick={handleBtnUpdUser}>Editar</button>
                </div>
                :
                <div className='itemUser__btns'>
                    <button disabled style={buttonDisabledStyle} className='itemUser__btns__btn'>Editar</button>
                </div>
            }
        </div>
        {
            updateUsersModalLocal && 
            <UsersListModal
            handleUpdateUsersModalLocal={handleUpdateUsersModalLocal}
            id={id}
            first_name={first_name}
            last_name={last_name}
            email={email}
            role={role}
            />
        }
    </>
  )
}

export default ItemUser
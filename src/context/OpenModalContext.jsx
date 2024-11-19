import { createContext, useState } from "react"

export const OpenModalContext = createContext(null)

export const OpenModalContextComponent = ({children}) => {

    const [saveShiftModal, setSaveShiftModal] = useState(false);

    const [recoverShiftModal, setRecoverShiftModal] = useState(false);
    const [cancelShiftModal, setCancelShiftModal] = useState(false);

    const [cancelDayModal, setCancelDayModal] = useState(false);

    const [cancelDaysListModal, setCancelDaysListModal] = useState(false);

    const [updateShiftModal, setUpdateShiftModal] = useState(false);
    const [updateShiftModalMobile, setUpdateShiftModalMobile] = useState(false);
    const [createShiftModalMobile, setCreateShiftModalMobile] = useState(false);

    const [updateMyShiftModal, setUpdateMyShiftModal] = useState(false);
    const [updateMyShiftModalMobile, setUpdateMyShiftModalMobile] = useState(false);

    const [updatePartnerModal, setUpdatePartnerModal] = useState(false);
    const [createPartnerModalMobile, setCreatePartnerModalMobile] = useState(false);
    const [updatePartnerModalMobile, setUpdatePartnerModalMobile] = useState(false);

    const [updateProviderModal, setUpdateProviderModal] = useState(false);
    const [createProviderModalMobile, setCreateProviderModalMobile] = useState(false);
    const [updateProviderModalMobile, setUpdateProviderModalMobile] = useState(false);

    const [createProductModalMobile, setCreateProductModalMobile] = useState(false);
    const [updateProductsModal, setUpdateProductsModal] = useState(false);
    const [updateProductModalMobile, setUpdateProductModalMobile] = useState(false);

    const [updateUsersModal, setUpdateUsersModal] = useState(false);
    const [createUserModalMobile, setCreateUserModalMobile] = useState(false);
    const [updateUserModalMobile, setUpdateUserModalMobile] = useState(false);

    const [updatePricesModal, setUpdatePricesModal] = useState(false);
    const [payMembershipFeeModal, setPayMembershipFeeModal] = useState(false);

    const [myDataModal, setMyDataModal] = useState(false);
    
    const [deleteTicketModal, setDeleteTicketModal] = useState(false);

    const [menuOptionsModal, setMenuOptionsModal] = useState(false);

    const [deleteCompanyModal, setDeleteCompanyModal] = useState(false);
    const [deleteHairdresserModal, setDeleteHairdresserModal] = useState(false);
    const [updateServiceBtnIsOpen, setUpdateServiceBtnIsOpen] = useState(false);
    const [deleteServiceModal, setDeleteServiceModal] = useState(false);
    const [updatePartnersBenModal, setUpdatePartnersBenModal] = useState(false);
    const [deletePartnerBenModal, setDeletePartnerBenModal] = useState(false);
    const [updateVariousPriceModal, setUpdateVariousPriceModal] = useState(false);
    const [deleteVariouModal, setDeleteVariouModal] = useState(false);

    const handleSaveShiftModal = (boolean) => {
        setSaveShiftModal(boolean);
    };
    const handleRecoverShiftModal = (boolean) => {
        setRecoverShiftModal(boolean);
    };
    const handleCancelDaysListModal = (boolean) => {
        setCancelDaysListModal(boolean);
    };
    const handleCancelShiftModal = (boolean) => {
        setCancelShiftModal(boolean);
    };
    const handleCancelDayModal = (boolean) => {
        setCancelDayModal(boolean);
    };
    const handleUpdateMyDataModal = (boolean) => {
        setMyDataModal(boolean);
    };
    const handleUpdateShiftModal = (boolean) => {
        setUpdateShiftModal(boolean);
    };
    const handleUpdateShiftModalMobile = (boolean) => {
        setUpdateShiftModalMobile(boolean);
    };
    const handleCreateShiftModalMobile = (boolean) => {
        setCreateShiftModalMobile(boolean);
    };
    const handleUpdateMyShiftModal = (boolean) => {
        setUpdateMyShiftModal(boolean);
    };
    const handleUpdateMyShiftModalMobile = (boolean) => {
        setUpdateMyShiftModalMobile(boolean);
    };
    const handleCreatePartnerModalMobile = (boolean) => {
        setCreatePartnerModalMobile(boolean);
    };
    const handleUpdatePartnerModal = (boolean) => {
        setUpdatePartnerModal(boolean);
    };
    const handleUpdatePartnerModalMobile = (boolean) => {
        setUpdatePartnerModalMobile(boolean);
    };
    const handleUpdateProviderModalMobile = (boolean) => {
        setUpdateProviderModalMobile(boolean);
    };
    const handleUpdateProductModalMobile = (boolean) => {
        setUpdateProductModalMobile(boolean);
    };
    const handleUpdateUserModalMobile = (boolean) => {
        setUpdateUserModalMobile(boolean);
    };
    const handleCreateProviderModalMobile = (boolean) => {
        setCreateProviderModalMobile(boolean);
    };
    const handleCreateUserModalMobile = (boolean) => {
        setCreateUserModalMobile(boolean);
    };
    const handleUpdateProviderModal = (boolean) => {
        setUpdateProviderModal(boolean);
    };
    const handleCreateProductModalMobile = (boolean) => {
        setCreateProductModalMobile(boolean);
    };
    const handleUpdateProductModal = (boolean) => {
        setUpdateProductsModal(boolean);
    };
    const handleUpdateUserModal = (boolean) => {
        setUpdateUsersModal(boolean);
    };
    const handleUpdatePriceModal = (boolean) => {
        setUpdatePricesModal(boolean);
    };
    const handlePayMembershipFeeModal = (boolean) => {
        setPayMembershipFeeModal(boolean);
    };
    const handleDeleteTicketModal = (boolean) => {
        setDeleteTicketModal(boolean);
    };
    const handleMenuOptionsModal = (boolean) => {
        setMenuOptionsModal(boolean);
    };
    const handleDeleteCompanyModal = (boolean) => {
        setDeleteCompanyModal(boolean);
    };
    const handleDeleteHairdresserModal = (boolean) => {
        setDeleteHairdresserModal(boolean);
    };
    const handleUpdateServiceBtnIsOpen = (boolean) => {
        setUpdateServiceBtnIsOpen(boolean);
    };
    const handleDeleteServiceModal = (boolean) => {
        setDeleteServiceModal(boolean);
    };
    const handleUpdatePartnersBenModal = (boolean) => {
        setUpdatePartnersBenModal(boolean);
    };
    const handleDeletePartnerBenModal = (boolean) => {
        setDeletePartnerBenModal(boolean);
    };
    const handleUpdateVariousPriceModal = (boolean) => {
        setUpdateVariousPriceModal(boolean);
    };
    const handleDeleteVariouModal = (boolean) => {
        setDeleteVariouModal(boolean);
    };
    
    return (

        <OpenModalContext.Provider value={{ handleDeleteVariouModal,deleteVariouModal,handleUpdateVariousPriceModal,updateVariousPriceModal,handleDeletePartnerBenModal,deletePartnerBenModal,updatePartnersBenModal,handleUpdatePartnersBenModal,handleDeleteServiceModal,deleteServiceModal,updateServiceBtnIsOpen,handleUpdateServiceBtnIsOpen,deleteHairdresserModal,handleDeleteHairdresserModal,deleteCompanyModal,handleDeleteCompanyModal,saveShiftModal,handleSaveShiftModal,myDataModal,cancelDaysListModal,cancelShiftModal,cancelDayModal,handleCancelDaysListModal,handleCancelDayModal,recoverShiftModal,updateUserModalMobile,createUserModalMobile,updateProductModalMobile,createProductModalMobile,createProviderModalMobile,createPartnerModalMobile,createShiftModalMobile,updateShiftModal,updateProviderModalMobile,updateShiftModalMobile,updatePartnerModalMobile, updateMyShiftModal,updateMyShiftModalMobile, updatePartnerModal, updateProviderModal, updateProductsModal, updateUsersModal, updatePricesModal, payMembershipFeeModal, deleteTicketModal, menuOptionsModal, handleUpdateShiftModal,handleCreatePartnerModalMobile,handleCreateShiftModalMobile,handleUpdateShiftModalMobile,handleUpdateMyShiftModalMobile, handleUpdateMyShiftModal, handleUpdatePartnerModal, handleUpdateProviderModal, handleUpdateProductModal, handleUpdateUserModal, handleUpdatePriceModal, handlePayMembershipFeeModal, handleDeleteTicketModal, handleMenuOptionsModal,handleUpdatePartnerModalMobile,handleCreateProviderModalMobile,handleUpdateProviderModalMobile,handleCreateProductModalMobile,handleUpdateProductModalMobile,handleCreateUserModalMobile,handleUpdateUserModalMobile,handleRecoverShiftModal,handleCancelShiftModal,handleUpdateMyDataModal }}>
            {children}
        </OpenModalContext.Provider>

    )

}


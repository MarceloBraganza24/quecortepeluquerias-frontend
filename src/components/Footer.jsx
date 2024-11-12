import React, { useContext } from 'react'
import {OpenModalContext} from '../context/OpenModalContext'; 

const Footer = () => {
    const {deleteVariouModal,updateVariousPriceModal,deletePartnerBenModal,updatePartnersBenModal,updateServiceBtnIsOpen,deleteServiceModal,saveShiftModal,deleteHairdresserModal,deleteCompanyModal,myDataModal,updateShiftModal,cancelDayModal,cancelDaysListModal,recoverShiftModal,cancelShiftModal,updateMyShiftModalMobile,createUserModalMobile,createProductModalMobile,updateProviderModalMobile,updateUserModalMobile,updateProductModalMobile,createProviderModalMobile,updatePartnerModalMobile,createPartnerModalMobile,createShiftModalMobile,updateShiftModalMobile,updateMyShiftModal,updatePartnerModal,updateProviderModal,updateProductsModal,updateUsersModal,updatePricesModal,deleteTicketModal,payMembershipFeeModal} = useContext(OpenModalContext);

  return (
    <div className='footerContainer'>
        <div className='footerContainer__social-networks'>
            <div className='footerContainer__social-networks__logo-link'>
                <img className='footerContainer__social-networks__logo-link__logo' src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj53U5Xgk3kFPa85_nVDnhi_026YYTpOvc2huRoqYwyz3cD3nP4Tu8rxYUlKXmQTFymJDI62D2n47AD8pRtXzOUajRf1z9ayWlqBadpesRe_2geUEMq-TB_ZXCir0jFKv6lwUpqe57nT_lSnX_S7n4jowLc152S_R2Qiuxqb8_YXl5AmKQimxsO2ri4As8/s50/qcp-logo-face.png" alt="logo-face" />
                {
                    !updateShiftModal&&!deleteVariouModal&&!updateVariousPriceModal&&!deletePartnerBenModal&&!updatePartnersBenModal&&!deleteServiceModal&&!updateServiceBtnIsOpen&&!deleteHairdresserModal&&!deleteCompanyModal&&!saveShiftModal&&!cancelDayModal&&!myDataModal&&!cancelDaysListModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModalMobile&&!updateUserModalMobile&&!createPartnerModalMobile&&!createUserModalMobile&&!createProductModalMobile&&!createProviderModalMobile&&!updateProductModalMobile&&!updatePartnerModalMobile&&!updateProviderModalMobile&&!createShiftModalMobile&&!updateShiftModalMobile&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
                    <a href="https://www.facebook.com/Quecort" className='footerContainer__social-networks__logo-link__link'>Que Corte</a>
                    :
                    <a className='footerContainer__social-networks__logo-link__link'>Que Corte</a>
                }
            </div>
        </div>
        <div className='footerContainer__title-copyrigth'>
            <div className='footerContainer__title-copyrigth__title'>
                <div className='footerContainer__title-copyrigth__title__prop'>
                    <p className='footerContainer__title-copyrigth__title__prop__spacing'>Peluquería</p>
                    <p>Que Corte</p>
                </div>
            </div>
            <div className='footerContainer__title-copyrigth__copyrigth'>
            {
                    !updateShiftModal&&!deleteVariouModal&&!updateVariousPriceModal&&!deletePartnerBenModal&&!updatePartnersBenModal&&!deleteServiceModal&&!updateServiceBtnIsOpen&&!deleteHairdresserModal&&!deleteCompanyModal&&!saveShiftModal&&!cancelDayModal&&!myDataModal&&!cancelDaysListModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModalMobile&&!updateUserModalMobile&&!createPartnerModalMobile&&!createUserModalMobile&&!createProductModalMobile&&!createProviderModalMobile&&!updateProductModalMobile&&!updatePartnerModalMobile&&!updateProviderModalMobile&&!createShiftModalMobile&&!updateShiftModalMobile&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
                    <a href="https://mbsolucionesinformaticas.com/" className='footerContainer__title-copyrigth__copyrigth__prop'>© 2024 - MB Soluciones Informáticas</a>
                    :
                    <a className='footerContainer__title-copyrigth__copyrigth__prop'>© 2024 - MB Soluciones Informáticas</a>
            }
            </div>
        </div>
        <div className='footerContainer__social-networks'>
            <div className='footerContainer__social-networks__logo-link'>
                <img className='footerContainer__social-networks__logo-link__logo' src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjMjnBxURMsAUtgPWW0aIbooWvkl_OvFFTEv2aSB0AV55ls35auw7bPOnwlcOGeF6IuHP9Gj-u_fHZnyOcrxmUam7z5nSnAcvrKTSgBXzwG_rqUJQAiWOzO8ksMoQd2epp40oQBJ_jqYMdoOk3xWJJ0zs4bv1IA7KfFsgsplEsrA09D-EMDKCoRY8Bz_tU/s50/qcp-logo-insta.png" alt="logo-face" />
                {
                    !updateShiftModal&&!deleteVariouModal&&!updateVariousPriceModal&&!deletePartnerBenModal&&!updatePartnersBenModal&&!deleteServiceModal&&!updateServiceBtnIsOpen&&!deleteHairdresserModal&&!deleteCompanyModal&&!saveShiftModal&&!cancelDayModal&&!myDataModal&&!cancelDaysListModal&&!cancelShiftModal&&!recoverShiftModal&&!updateMyShiftModalMobile&&!updateUserModalMobile&&!createPartnerModalMobile&&!createUserModalMobile&&!createProductModalMobile&&!createProviderModalMobile&&!updateProductModalMobile&&!updatePartnerModalMobile&&!updateProviderModalMobile&&!createShiftModalMobile&&!updateShiftModalMobile&&!updateMyShiftModal&&!updatePartnerModal&&!updateProviderModal&&!updateProductsModal&&!updateUsersModal&&!updatePricesModal&&!deleteTicketModal&&!payMembershipFeeModal?
                    <a href="https://www.instagram.com/quecorte__/" className='footerContainer__social-networks__logo-link__link'>quecorte__</a>
                    :
                    <a className='footerContainer__social-networks__logo-link__link'>quecorte__</a>
                }
            </div>
        </div>
    </div>
  )
}

export default Footer
import NavBar from './NavBar'
import Footer from './Footer'
import LogOut from './LogOut';

const Cuts = () => {
  
  return (
    <>
        <NavBar/>
        {
          <>
          <div className='cutsContainer'>
            <div className='cutsContainer__cuts'>
              <div className='cutsContainer__cuts__cut'>
                <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
              </div>
              <div className='cutsContainer__cuts__cut'>
                <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte4.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
              </div>
              <div className='cutsContainer__cuts__cut'>
                <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte1.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
              </div>
              <div className='cutsContainer__cuts__cut'>
                <img src="https://storage.googleapis.com/que-corte-peluquerias-img/qcp-corte2.jpg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
              </div>
              <div className='cutsContainer__cuts__cut'>
                <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya1.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
              </div>
              <div className='cutsContainer__cuts__cut'>
                <img src="https://storage.googleapis.com/que-corte-peluquerias-img/corte-raya2.jpeg" className='cutsContainer__cuts__cut__prop' alt="imagenPeluqueria"/>
              </div>
            </div>
          </div>
          <LogOut/>
        </>
        }
        <Footer/>
    </>
  )
}

export default Cuts
import Login from './components/Login'
import SingUp from './components/SingUp';
import Home from './components/Home';
import Shifts from './components/Shifts';
import About from './components/About';
import Cuts from './components/Cuts';
import Partners from './components/Partners';
import UsersList from './components/UsersList';
import ShiftsList from './components/ShiftsList';
import PartnersList from './components/PartnersList';
import ProductsList from './components/ProductsList';
import ProvidersList from './components/ProvidersList';
import SendMailPass from './components/SendMailPass';
import { IsLoggedInContext } from './context/IsLoggedContext'
import { ParentComponent } from './context/InputDataShContext'
import { ParentPaComponent } from './context/InputDataPaContext'
import { ParentULComponent } from './context/InputDataULContext'
import { ParentPrComponent } from './context/InputDataPrContext'
import { ParentProdComponent } from './context/InputDataProdContext'
import { ParentShLComponent } from './context/InputDataShLContext'
import { BtnMPParent } from './context/BtnMPContext'
import { OpenModalContextComponent } from './context/OpenModalContext';
import { ParentPaLComponent } from './context/InputDataPaLContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyShifts from './components/MyShifts';
import ResetPass from './components/ResetPass';
import MyData from './components/MyData';
import Config from './components/Config';

function App() {

  return (

    <BrowserRouter>

      <IsLoggedInContext>

        <OpenModalContextComponent>

        <ParentPaComponent>

        <ParentPaLComponent>

        <ParentPrComponent>

        <ParentProdComponent>

        <ParentComponent>

        <ParentULComponent>

        <ParentShLComponent>

        <BtnMPParent>

          <Routes>

            <Route exact path="/login" element={<Login/>}/>
            <Route exact path="/singUp" element={<SingUp/>}/>
            <Route exact path="/" element={<Login/>}/>
            <Route exact path="/home" element={<Home/>}/>
            <Route exact path="/shifts" element={<Shifts/>}/>
            <Route exact path="/shiftsList" element={<ShiftsList/>}/>
            <Route exact path="/about" element={<About/>}/>
            <Route exact path="/cuts" element={<Cuts/>}/>
            <Route exact path="/partners" element={<Partners/>}/>
            <Route exact path="/partnersList" element={<PartnersList/>}/>
            <Route exact path="/providersList" element={<ProvidersList/>}/>
            <Route exact path="/productsList" element={<ProductsList/>}/>
            <Route exact path="/usersList" element={<UsersList/>}/>
            <Route exact path="/myShifts" element={<MyShifts/>}/>
            <Route exact path="/sendMail" element={<SendMailPass/>}/>
            <Route exact path="/resetPass" element={<ResetPass/>}/>
            <Route exact path="/myData" element={<MyData/>}/>
            <Route exact path="/config" element={<Config/>}/>

          </Routes>
          
          <ToastContainer />

        </BtnMPParent>

        </ParentShLComponent>

        </ParentULComponent>
        
        </ParentComponent>

        </ParentProdComponent>
        
        </ParentPrComponent>
        
        </ParentPaLComponent>

        </ParentPaComponent>

        </OpenModalContextComponent>

      </IsLoggedInContext>

    </BrowserRouter>

  )

}

export default App

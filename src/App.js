import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Customer from "./pages/Customer";
import Order from "./pages/Order";
import Service from "./pages/Service";
import AppBar from './components/AppBar'
import FirebaseAuth from './login/FirebaseAuth'
import FirebaseSignin from './login/FirebaseSignin';
import FirebaseResetPassword from './login/FirebaseResetPassword';
import Button from '@mui/material/Button';


import "./App.css"

const styles = {
    button: color => ({
        color,
        borderColor:color,
        backgroundColor:'transparent'
    }),
    notFound:{
        width:'100%', 
        textAlign:'center', 
        color:'232323'
    }

}

const RedirectTo = props =>  {
    window.location.replace(props.url);
    return null;
}

const RedirectToMultiple = props => {

    return(
        <>
            <div style={{width:'100%', textAlign:'center'}}>
                {Object.entries(props).map(it =>
                    <p>
                        <Button style={styles.button('#232323')} variant="outlined"  type="submit" onClick={()=>window.location.replace(it[1])}>Redirect to {it[0]}</Button>
                    </p>
                )}
            </div>
        </>
    )
}



export default function App() {
        return (
        <BrowserRouter> 
           <FirebaseAuth>
           <AppBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/customer" element={<Customer />} />
                <Route path="/order" element={<Order />} />
                <Route path="/order/:kundId/:namn" element={<Order />} />
                <Route path="/service" element={<Service />} />
                <Route path="/service/:orderId/:namn" element={<Service />} />
                <Route path="/service/:orderId/:namn" element={<Service />} />
                <Route path="signin" element={<FirebaseSignin />} />
                <Route path="resetPassword" element={<FirebaseResetPassword />} />
                <Route
                    path="*"
                    element={
                    <div style={styles.notFound}>
                        <h2>Page not found</h2>
                    </div>
                    }
                />
                </Routes>
           </FirebaseAuth>
        </BrowserRouter>
    );
  }
  
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Submission from "./pages/Submission";
import ServiceReport from "./pages/ServiceReport";
import Extradition from "./pages/Extradition";
import SubmissionReport from "./pages/SubmissionReport";
import NewOrder from "./pages/NewOrder";
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
                <Route path="/submission" element={<Submission />} />
                <Route path="/serviceReport" element={<ServiceReport />} />
                <Route path="/extradition" element={<Extradition />} />
                <Route path="/submissionReport" element={<SubmissionReport />} />
                <Route path="/newOrder" element={<NewOrder />} />
                <Route path="/newOrder/:orderId/:namn" element={<NewOrder />} />
                <Route path="/newOrder/:orderId/:kundId/:namn/:mobil" element={<NewOrder />} />
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
  
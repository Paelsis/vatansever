import React, {useState} from 'react';

import Image from '../images/tangosweden.jpg';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';


const styles = {
    container:{
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'black',
        color:'#FFFFA7',
        style:'absolute',
        height:'CALC(100vh \- 50px'
    },
    button:{
        borderWidth:'2px',
        height:50,
        color:'#FFFFA7',
        borderColor:'#FFFF87',
        backgroundColor:'transparent'
    }

}

const Home = () => {
    const navigate = useNavigate()
    const handleNavigate = lnk => {
        navigate(lnk)
    }

    return(
        <div style={styles.container}>
                <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleNavigate('/newCustomer')}>
                    Inlämning
                </Button>    
                &nbsp;
                <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleNavigate('/serviceReport')}>
                    Servicerapport 
                </Button>    
                &nbsp;
                <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleNavigate('/extradition')}>
                    Utlämning 
                </Button>    


        </div>
    )
}

export default Home


//<div style = {{...styles.img, backgroundImage: `url(${Image})`}} />

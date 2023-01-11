import React, {useState} from 'react';

import Image from '../images/tangosweden.jpg';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';


const styles = {
    container:{
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#112200',
        color:'#FFFFA7',
        style:'absolute',
        height:'CALC(100vh \- 50px'
    },
    row:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    col:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button:{
        marginLeft:'5px',
        marginRight:'5px',
        marginBottom:'10px',
        borderWidth:'2px',
        height:50,
        color:'#FFFFA7',
        borderColor:'#FFFF87',
        backgroundColor:'transparent'
    }

}

const Home = () => {
    const navigate = useNavigate()
    const handleClickLine = lnk => {
        navigate(lnk)
    }

    return(
        <div style={styles.container}>
                <div style={styles.row}>
                    <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleClickLine('/inlamning')}>
                        Inlämning
                    </Button>    
                    <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleClickLine('/utlamning')}>
                        Utlämning 
                    </Button>    
                </div>
                <p/>
                <div style={styles.col}>
                <Button variant="outlined" type="button" style={styles.button}  onClick={()=>handleClickLine('/serviceReport')}>
                    Servicerapport 
                </Button>    
                </div>
        </div>
    )
}

export default Home


//<div style = {{...styles.img, backgroundImage: `url(${Image})`}} />

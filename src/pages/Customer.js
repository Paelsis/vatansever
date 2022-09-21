import React, {useState} from 'react';
import NewRecord from '../components/NewRecord'
import Search from '../components/Search'
import EditTable from '../components/EditTable'
import {useNavigate} from 'react-router-dom'

import Button from '@mui/material/Button';
import { RttRounded } from '@mui/icons-material';



const styles = {
    container: {
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth:'100%', 
    },
}

const fields = [
    {
        type:'text',
        label:'För och efternamn',
        name:'namn',
        tooltip:'Kundens för och efternamn',
        required:true,
    },
    {
        type:'text',
        label:'Email',
        name:'email',
        tooltip:'Kundens email',
        hiddenIf:'fakturaKund'
    },
    {
        type:'text',
        label:'Email',
        name:'email',
        tooltip:'Kundens email',
        required:'true',
        notHiddenIf:'fakturaKund'
    },
    {
        type:'text',
        label:'Mobilnummer',
        name:'mobil',
        tooltip:'Kundens mobilnummer',
    },
    {
        type:'checkbox',
        label:'Kunden betalar via faktura',
        name:'fakturaKund',
        tooltip:'Kunden betalar via faktura',
    },
    {
        type:'text',
        label:'Organisationsnummer',
        name:'orgnr',
        placeholder:'Ex: 551231-4604',
        tooltip:'Kundens organisationsnummer (Ex: 551131-4672)',
        required:'true',
        notHiddenIf:'fakturaKund',
    },
]

const MODE = {
    SEARCH:1,
    NEW:2
}


const searchFields = [
    {
        type:'text',
        label:'För och efternamn',
        name:'namn',
        tooltip:'Kundens fullständiga namn',
        required:true,
    },
    {
        type:'text',
        label:'Email',
        name:'email',
        tooltip:'Kundens email',
    },
    {
        type:'text',
        label:'Mobilnummer',
        name:'mobil',
        tooltip:'Kundens mobilnummer',
    },
]
const tableName='tbl_customer'

export default () => {
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [mode, setMode] = useState(MODE.SEARCH)
    const [status, setStatus] = useState(undefined)
    const [value, setValue] = useState(undefined)

    const handleOpen = id => {
        const rec = list.find(it=> it.id === id)
        const namn = rec?rec.namn:'Inget namn'
        navigate('/order/' + id + '/' + namn)
    }    

    const handleClick = () => {
        if (mode === MODE.SEARCH) {
            setList([])
        }    
        setMode(mode&MODE.SEARCH?MODE.NEW:MODE.SEARCH)
    }

    const handleToggle = value => {
        setValue(value)
        setMode(mode&MODE.SEARCH?MODE.NEW:MODE.SEARCH)
        setList([])
    }

    const handleRedirect = record => {
        if (record.id?true:false && record.namn?true:false) {
            navigate('/order/' + record.id + '/' + (record.namn))
        } else {
            alert('ERROR: Sidan saknade kundens id och namn, kontakta WEB-administratören:' +  JSON.stringify(value))
            navigate('/order')
        }    
    } 

    return(    
        <div style={styles.container}>
            <p/>
            <h3>Sök eller skapa ny kund</h3>
            {mode&MODE.SEARCH?
                <>
                    <Search 
                        tableName={tableName} 
                        searchView={tableName} 
                        value={value} 
                        fields={searchFields} 
                        constants={undefined} 
                        list={list} 
                        setList={setList} 
                        handleToggle={handleToggle} />
                        <EditTable tableName={tableName} list={list} setList={setList} setStatus={setStatus} handleOpen={handleOpen} />  
                </>
            :mode&MODE.NEW?        
                <>
                    <NewRecord 
                        tableName={tableName} 
                        fields={fields} 
                        value={value} 
                        list={list} 
                        setList={setList} 
                        setStatus={setStatus} 
                        handleToggle={handleToggle}
                        handleRedirect={handleRedirect}
                        />
                    <EditTable 
                        tableName={tableName} 
                        list={list} 
                        setList={setList} 
                        setStatus={setStatus} 
                        handleOpen={handleOpen}/>
                </>
            :
                null    
            }   
            {status?<small>{status}</small>:null}
        </div>
    )
}    


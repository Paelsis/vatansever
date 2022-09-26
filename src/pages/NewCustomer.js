import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import NewOrSearch from '../components/NewOrSearch'
import EditTable from '../components/EditTable'
import {BUTTONS} from '../services/constants'

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
        label:'För- och efternamn',
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
        label:'Telefonnummer',
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
        label:'För- och efternamn',
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
        label:'Telefonnummer',
        name:'mobil',
        tooltip:'Kundens mobilnummer',
    },
]
const tableName='tbl_customer'
const searchView='tbl_customer'

export default () => {
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [status, setStatus] = useState({color:'blue'})
    const [value, setValue] = useState(undefined)

    const handleRedirect = record => {
        if (!record.id) {
            alert('ERROR: Denna databas rad sakaden kundens id, kontakta WEB-administratören:' +  JSON.stringify(record))
            navigate('/order')
        } else if (!record.namn) {
            alert('ERROR: Denna databas rad sakaden kundens namn, kontakta WEB-administratören:' +  JSON.stringify(record))
            navigate('/order')
        } else {
            navigate('/newOrder/' + record.id + '/' + (record.namn) + '/' +  (record.mobil)) 
        }    
    } 

    const statusMessage = (color, message) => {
        setStatus({color, message})
        let timer = setTimeout(() => setStatus({}), 1000);
    }        

    return(    
        <div style={styles.container}>
            <h3>Inlämning</h3>
                <NewOrSearch 
                    tableName={tableName} 
                    searchView={searchView}
                    searchFields={searchFields}
                    fields={fields} 
                    list={list} 
                    setList={setList} 
                    statusMessage={statusMessage}  
                    handleRedirect={handleRedirect}
                    buttons={BUTTONS.SAVE_AND_PRINT}
                    />
                <EditTable 
                    searchView={tableName} 
                    searchFields={searchFields}
                    list={list} 
                    setList={setList} 
                    statusMessage={statusMessage}  
                    handleRedirect={handleRedirect}
                    />
            <p/>    
            <div style={{color:status.color}}>{status.message}</div>
        </div>
    )
}    


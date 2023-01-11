import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import FormTemplate from '../components/FormTemplate'
import EditTable from '../components/EditTable'
import {BUTTONS} from '../services/constants'
import StatusMessage from '../components/StatusMessage'
import serverFetch from '../services/serverFetch';
import serverPost from '../services/serverPost'
import {search} from '../services/search'


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
        label:'Telefonnummer',
        name:'mobil',
        tooltip:'Kundens mobilnummer',
        required:true,

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
    const [statusMessage, setStatusMessage] = useState({})
    const [value, setValue] = useState({})

    const handleStatus = (style, message) => {
        setStatusMessage({style, message})
        let timer = setTimeout(() => setStatusMessage({}), 10000);
    }

    const handleNavigate = (orderId, kundId, namn, mobil) => {
        const irl = '/nyRapport/' + orderId + '/' + kundId + '/' + namn +'/' + mobil
        navigate(irl)
    }

    const handleSaveCallback = reply => {
        const {status, record} = reply
        handleStatus({backgroundColor:'green'}, 'Kund sparad i database')

        if (status === 'OK') {
            serverPost('/replaceRow', '', '', {tableName:'tbl_service', record:{kundId:record.id}}, val=>handleNavigate(val.id, record.id, record.namn, record.mobil))
        } else {
            const message = 'FELMEDDELANDE: Kundens uppgifter kunde inte sparas i databasen. Kontakta WEB-adbinistratören'
            setStatusMessage({backgroundColor:'red'}, message)
        }    
    }        

    const handleSave = value => {
        handleStatus({backgroundColor:'green'}, 'Sparar kund i database')
        serverPost('/replaceRow', '', '', {tableName, record:value}, handleSaveCallback)
    }


    const handleClickLine = rec => {
        // alert('handleClickLine:' + JSON.stringify(record))
        if (!rec.id) {
            alert('ERROR: Detta svar från databasen kundens kundnummer (kundId), kontakta WEB-administratören:' +  JSON.stringify(rec))
        } else if (!rec.namn) {
            alert('ERROR: Detta svar från databasen kundens namn, kontakta WEB-administratören:' +  JSON.stringify(rec))
        } else {
            handleStatus({backgroundColor:'green'}, 'Skapar inlämningsrapport med ett specifikt nummer')
            serverPost('/replaceRow', '', '', {tableName:'tbl_service', record:{kundId:rec.id}}, value=>handleNavigate(value.id, rec.id, rec.namn, rec.mobil))
        }    
    } 

    const handleSearchReply = list => {
        if (list.length === 0) {
            handleStatus({backgroundColor:'orange'}, 'Varning: Fick inget resultat vid sökning i database')    
        } if (list.length === 1) {
            handleStatus({backgroundColor:'green'}, undefined)    
            setValue(list[0])
        } else {
            handleStatus({backgroundColor:'green'}, undefined)    
            setList(list)
        }    
    }

    const handleSearch = () => {
        handleStatus({backgroundColor:'green'}, 'Söker ...') 
        search(tableName, value, handleSearchReply) 
    }

    const handleReset = () => {
        setValue({})
        setList([])
    }


    const buttons=[
        
        {
            style:{color:'black', borderColor:'black'},
            type:'button',
            label:'Sök',
            handleClick:handleSearch
        },    
        {
            style:{color:'black', borderColor:'black'},
            type:'button',
            label:'Spara',
            required:true,
            handleClick:(()=>handleSave(value))
        },    
        {
            type:'button',
            style:{color:'black', borderColor:'black'},
            label:'Rensa',
            handleClick:handleReset
        },    
    ]
    
    return(    
        <div style={styles.container}>
            <h3>Inlämning</h3>
            <>
            <FormTemplate 
                buttons={buttons}
                fields={fields} 
                value={value}
                setValue={setValue}
                handleStatus={handleStatus}
                handlePressEnter={handleSearch}
            />
            <EditTable 
                tableName={tableName}
                searchView={tableName} 
                searchFields={searchFields}
                list={list} 
                setList={setList} 
                handleStatus={handleStatus}  
                handleClickLine={handleClickLine}
            />
            </>
            <p/>    
            <StatusMessage style={statusMessage.style} message={statusMessage.message} />
        </div>
    )
}    

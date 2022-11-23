import React, {useState, useRef, useEffect} from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage'
import serverPost from '../services/serverPost'
import {search} from '../services/search'
import FormTemplate from '../components/SearchForm'
import EditTable from '../components/EditTable'

const styles = {
    container: {
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth:'100%', 
    },
}

const MODE = {
    SEARCH:1,
    NEW:2
}

const fields = [
    {
        type:'radio',
        radioValues:['Okhan', 'Johannes', 'Mats'],
        label:'Mottagare',
        name:'mottagare',
        tooltip:'Mottagare av objektet framme vid disken',
        required:true,
        hiddenIf:'annanPerson'
    },
    {
        type:'text',
        label:'Mottagare',
        name:'mottagare',
        tooltip:'Om mottagaren är annan person än Okhan, Johannes eller MatsFabrikat på inlämnad apparat',
        required:true,
        notHiddenIf:'annanPerson'
    },
    {
        type:'checkbox',
        label:'Annan',
        name:'annanPerson',
        tooltip:'Om mottagaren är annan person än dem som det finns radioknapp till ovan',
    },
    {
        type:'text',
        label:'Fabrikat',
        name:'fabrikat',
        tooltip:'Fabrikat på inlämnad apparat',
    },
    {
        type:'text',
        label:'Modell',
        name:'modell',
        tooltip:'Modell på inlämnad apparat',
    },
    {
        type:'checkbox',
        label:'Akut prioritet',
        name:'akutPrioritet',
        tooltip:'Om objektet måste repreras supersnabbt till dyrare kostad',
    },
    {
        type:'checkbox',
        label:'Felsökning',
        name:'felsokning',
        tooltip:'Om man skall först göra felsökning och ge besked till kund',
    },
    {
        type:'checkbox',
        label:'Garanti',
        name:'garanti',
        tooltip:'Om reparationen går på garanti',
    },
    {
        type:'textarea',
        label:'Felbeskrivning',
        name:'felbeskrivning',
        tooltip:'Beskrivning av felet',
    },
  
]

const extraFields = [
    {
        type:'text',
        label:'Namn',
        name:'namn',
        tooltip:'Kundens namn',
    },
    {
        type:'text',
        label:'Telefon',
        name:'mobil',
        tooltip:'Telefonnummer',
    },
    {
        type:'email',
        label:'Telefon',
        name:'email',
        tooltip:'email',
    },
]

const searchFields = [
    {label:'Service rapport', name:'id'},
    {name:'felbeskrivning'},
    {name:'mottagare'},
    {name:'namn'},
    {name:'mobil'},	
]    	

const tableName = 'tbl_service'
const searchView = 'view_service'

export default () => {
    const params = useParams()
    const navigate = useNavigate()
    const orderId = params?params.orderId?params.orderId:undefined:undefined
    const kundId = params?params.kundId?params.kundId:undefined:undefined
    const namn = params?params.namn?params.namn:undefined:undefined
    const mobil = params?params.mobil?params.mobil:undefined:undefined
    const [list, setList] = useState([])
    const [value, setValue] = useState({})
    const [statusMessage, setStatusMessage] = useState({color:'green', message:''})

    const handleStatus = (style, message) => {
        setStatusMessage({style, message})
        let timer = setTimeout(() => setStatusMessage({}), 5000);
    }        

    const handleSaveCallback = reply => {
        const {status, record} = reply

        if (status === 'OK') {
            handleStatus({backgroundColor:'green'}, undefined)
            navigate('/submission')
        } else {
            const message = 'FELMEDDELANDE: Servicerapporten kunde inte uppdateras'
            handleStatus({backgroundColor:'red'}, message)
        }    
    }        

    const handleSave = val => {
        handleStatus({backgroundColor:'green'}, 'Uppdaterar servicerapporten i databasen')
        serverPost('/updateRow', '', '', {tableName, record:val, id:orderId?orderId:val.id?val.id:undefined}, handleSaveCallback)
    }

    const handleClickLine = rec => {
        setValue(rec)
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
        // alert('value:' + JSON.stringify(value))
        handleStatus({backgroundColor:'green'}, 'Söker ...') 
        search(searchView, value, handleSearchReply) 
    }

    const handleReset = () => {
        setValue({})
        setList([])
    }

    const buttons=[
        {
            style:{color:'black', borderColor:'black'},
            label:'Print',
            print:true,
            required:true,
            onAfterPrint:()=>handleSave(value)
        },    
        {
            style:{color:'black', borderColor:'black'},
            label:'Sök',
            handleClick:handleSearch
        },    
        {
            style:{color:'black', borderColor:'black'},
            label:'Rensa',
            handleClick:handleReset
        },    
    ]

    const headerFields = ['id', 'namn', 'mobil']

    const newFields = namn?fields:[...extraFields, ...fields]

    return(    
        <div style={styles.container}>
            <h3>Inlämning</h3>
            <p/>
                <FormTemplate
                    tableName={tableName} 
                    fields={newFields} 
                    value={value} 
                    setValue={setValue}
                    handleStatus={handleStatus}  
                    handlePressEnter={handleSearch}
                    buttons={buttons}
                >
                    {orderId || value.id?<h1 style={{margin:'auto'}}>{value.id?value.id:orderId}</h1>:null}
                    {namn?<span style={{fontSize:20}}>{value.namn?value.namn:namn}</span>:null} 
                    &nbsp;&nbsp;
                    {mobil?<span style={{fontSize:20}}>Tel:{value.mobil?value.mobil:mobil}</span>:null} 
                </FormTemplate> 
                <EditTable 
                    tableName={tableName}
                    searchView={searchView} 
                    searchFields={searchFields}
                    list={list} 
                    setList={setList} 
                    handleStatus={handleStatus}  
                    handleClickLine={handleClickLine}
                />

            <p/>
            <StatusMessage style={statusMessage.style} message={statusMessage.message} />
        </div>    
    )
}

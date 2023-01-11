import React, {useState, useEffect} from 'react';
import StatusMessage from '../components/StatusMessage'
import {useNavigate, useParams } from 'react-router-dom';
import {defaultDate} from '../services/functions'
import serverPost from '../services/serverPost'
import {search} from '../services/search'
import SearchLineTemplate from '../components/SearchLineTemplate'
import FormTemplate from '../components/SearchForm'
import EditTable from '../components/EditTable'

const styles = {
    container0: {
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth:'100%', 
    },
    container:{
        display:'flex',
        paddingTop:50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor:'#112200',
        //color:'#FFFFA7',
        // height:'calc(100vh \- 50px)'
    },
    row:{
        display:'flex',
        backgroundColor:'#112200',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    col:{
        display:'flex',
        paddingTop:50,
        backgroundColor:'#112200',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
}

const fields = [
    {
        type:'rte',
        label:'Header lapp på apparat',
        name:'headerObject',
        required:true,
        tooltip:'Header på den lapp som tejpas på objected',
    },
    {
        type:'rte',
        label:'Footer på lappen till apparat',
        name:'footerObject',
        required:true,
        tooltip:'Footer på den lapp som tejpas på objected',
    },
    {
        type:'rte',
        label:'Header kundkvitto',
        name:'headerKund',
        required:true,
        tooltip:'Header på det kvitto som lämnas ut till kund',
    },
    {
        type:'rte',
        label:'Footer kundkvitto',
        name:'footerKund',
        required:true,
        tooltip:'Footer på den lapp som tejpas på objekted',
    },
]


const tableName = 'tbl_settings'
const searchView = 'view_service'

const searchFields = [
    {label:'Nummer', name:'id'},
    {label:'Felbeskrivning', name:'felbeskrivning'},
    {label:'Fabrikat', name:'fabrikat'},
    {label:'Modell', name:'modell'},
    {label:'Mottagare', name:'mottagare'},
    {label:'Tekniker', name:'tekniker'},
    {label:'Namn', name:'namn'},
    {label:'Telefon', name:'mobil'},	
]    	


export default () => {
    const navigate = useNavigate()
    const [edit, setEdit] = useState(false)
    const [value, setValue] = useState()
    const [statusMessage, setStatusMessage] = useState({})
    

    const handleSearchReply = list => {
        if (list.length === 0) {
            handleStatus({backgroundColor:'orange'}, 'Varning: Fick inget resultat vid sökning i database')    
        } if (list.length === 1) {
            handleStatus({backgroundColor:'green'}, undefined)
            setValue(list[0])
        } else {
            alert('Multiple records:' + JSON.stringify(list))
            handleStatus({backgroundColor:'red'}, 'Multiple records')    
        }    
    }
   
    useEffect(()=>{
        search(tableName, {id:1}, handleSearchReply) 
    }, []) 

    const handleStatus = (style, message) => {
        setStatusMessage({style, message})
    }

    const handleSaveCallback = reply => {
        const {status, record} = reply

        if (status === 'OK') {
            handleStatus({backgroundColor:'green'}, undefined)
        } else {
            const message = 'FELMEDDELANDE: Servicerapporten kunde inte uppdateras'
            handleStatus({backgroundColor:'red'}, message)
        }    
    }

    const handleSave = value => {
        handleStatus({backgroundColor:'lightGreen'}, 'Uppdaterar inställningar i databasen')
        serverPost('/replaceRow', '', '', {tableName, record:value, id:1}, handleSaveCallback)
    }

    const handleSearch = () => {
        handleStatus({backgroundColor:'green'}, 'Söker ...') 
        if (value.id) {
            let searchFields = {id:value.id}
        } else {


        }
        search(searchView, searchFields, handleSearchReply) 
    }


    const buttons=[
        {
            style:{color:'black', borderColor:'black'},
            type:'button',
            label:'Spara',
            handleClick:(()=>handleSave(value))
        },    
    ]

    
    return(    
        <div style={styles.container}>
                <>
                    <h2>Inställningar</h2>
                    {value?
                    <FormTemplate
                            buttons={buttons}
                            tableName={tableName} 
                            fields={fields} 
                            value={value} 
                            setValue={setValue}
                            handleStatus={handleStatus}  
                            handlePressEnter={handleSearch}
                    />
                    :<h3>Hämtar inställningar från databasen ...</h3>}
                    <StatusMessage style={statusMessage.style} message={statusMessage.message} />
                </>
        </div>
    )
} 
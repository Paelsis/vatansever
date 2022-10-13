import React, {useState, useEffect} from 'react';
import NewAndSearchLine from '../components/NewAndSearchLine'
import EditTable from '../components/EditTable'
import {useNavigate, useParams } from 'react-router-dom';
import {BUTTONS} from '../services/constants'
import serverPost from '../services/serverPost'


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
        type:'radio',
        radioValues:['Okhan', 'Johannes', 'Mats'],
        label:'Tekniker',
        name:'tekniker',
        tooltip:'Mottagare av objektet framme vid disken',
        required:true,
        hiddenIf:'annanPerson'
    },
    {
        type:'text',
        label:'Tekniker',
        name:'tekniker',
        required:true,
        notHiddenIf:'annanPerson'
    },
    {
        type:'checkbox',
        label:'Annan',
        name:'annanPerson',
        tooltip:'Kryssa i denna om teknikern är en annan person än de som det finns radio-knappar till',
    },
    {
        type:'date',
        label:'Datum då kunden accepterar reparation',
        name:'acceptDate',
        tooltip:'Datum då kunden accepterat reparation',
        notHiddenIf:'acceptRep',
        required:true,        

    },
    {
        type:'radio',
        label:'Accept via',
        name:'acceptVia',
        radioValues:['SMS', 'MUNTLIGT', 'MAIL'],
        tooltip:'Kunden har kontaktats via denna metod',
        notHiddenIf:'acceptRep',
        required:true,        
    },
    {
        type:'date',
        label:'Datum då kunden accepterar reparation',
        name:'acceptDate',
        tooltip:'Datum då kunden accepterat reparation',
        hiddenIf:'acceptRep',
    },
    {
        type:'radio',
        label:'Accept via',
        name:'acceptVia',
        radioValues:['SMS', 'MUNTLIGT', 'MAIL'],
        tooltip:'Kunden har kontaktats via denna metod',
        hiddenIf:'acceptRep',
    },
    {
        type:'rte',
        label:'Utförda åtgärder',
        name:'atgarder',
        tooltip:'Datum då kunden accepterat reparation',
    },
    {
        type:'rte',
        label:'Använt material',
        name:'material',
        tooltip:'Använt marterial vid reparation',
    },
    {
        type:'text',
        label:'Arbetstid',
        name:'arbetstid',
        tooltip:'Den totala arbetstid som gått åt vid reparationen',
    },
    {
        type:'text',
        label:'Materialkostnad',
        name:'belopp',
        tooltip:'Den totala kostnade inklusive material',
    },
    {
        type:'text',
        label:'Kostnad',
        name:'belopp',
        tooltip:'Den totala kostnade inklusive material',
    },
    {
        type:'date',
        label:'Kontaktad för avhämtning',
        name:'kontaktadAvhamtning',
        tooltip:'Kunden har kontaktats för avhämtning',
    },
    {
        type:'radio',
        radioValues:['SMS', 'MUNTLIGT', 'MAIL'],
        label:'Kunden har kontaktats för avhämtning via',
        name:'kontaktadVia',
        tooltip:'Kunden har kontaktats för avhämtning via',
    },
]


const tableName = 'tbl_service'
const searchView = 'view_service'

export default () => {
    const params = useParams()
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [value, setValue] = useState()
    const [status, setStatus] = useState({})
    
    const [constants, setConstants] = useState(params)
    useEffect(()=>setConstants(setConstants(params)), []) 
        
    const handleRedirect = record => {
        //navigate('/order/' + customerId +  '/' + rec.namn)
        alert('Har ännu ingensans att gå ...')
    }    

    const handleRowClick = value => {
        // alert('ServiceReport' + JSON.stringify(value))
        setValue(value)
        setList([])
    }
    const statusMessage = (color, message) => {
        setStatus({color, message})
        let timer = setTimeout(() => setStatus({}), 1000);
    }


    const searchFields = [
        {label:'Nummer', name:'id'},
        {label:'Felbeskrivning', name:'felbeskrivning'},
        {label:'Fabrikat', name:'fabrikat'},
        {label:'Modell', name:'modell'},
        {label:'Mottagare', name:'mottagare'},
        {label:'Tekniker', name:'tekniker'},
        {label:'Namn', name:'namn'},
        {label:'Telefon', name:'mobil'},	
        {label:'Email', name:'email'},	
    ]    	
    
   
    const header = value?{orderid:value.id}:undefined

    const handleReply = reply =>{
        // alert(JSON.stringify(reply))
        if (reply.status === 'OK') {
            const record = reply.record
            setValue(record)
            statusMessage('green', 'Servicerapport för inlämningsnummer ' + record.id + ' har sparats')
        } else {
            statusMessage('red', 'ERROR: Servicerapport kunde inte sparas')
        }    
    }

    const onBeforePrint = record => {
        const recordSave = {id:record.id}
        // Save service record
        serverPost('/replaceRow', '', '', {tableName, record:recordSave}, handleReply)
    }

    return(    

        <div style={styles.container}>
            {constants?constants.id?<h3>{'Servicerapport för id:' + constants.id + ' namn:' + constants.namn}</h3>:null:null}
            <NewAndSearchLine 
                    searchFields={searchFields}
                    tableName={tableName} 
                    searchView={searchView} 
                    value={value} 
                    header={header}
                    setValue={setValue}
                    fields={fields} 
                    list={list} 
                    setList={setList} 
                    statusMessage={statusMessage}
                    buttons={BUTTONS.SAVE|BUTTONS.PRINT}
            >
                    {value?value.id?<h3>Service rapport:{value.id}</h3>:null:null} 
                    {value?value.namn?<span>{value.namn}</span>:null:null}
                    <br/> 
                    {value?value.mobil?<span>Tel:{value.mobil}</span>:null:null} 
            </NewAndSearchLine>
            <EditTable 
                    searchFields={searchFields}
                    tableName={searchFields} 
                    list={list} 
                    setList={setList} 
                    statusMessage={statusMessage}  
                    handleRowClick={handleRowClick}
            />
            {status.message?<div style={{color:status.color?status.color:'green'}}>{status.message}</div>:null}
        </div>
    )
}    
           
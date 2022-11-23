import React, {useState, useEffect} from 'react';
import SearchLineAndForm from '../components/SearchLineAndForm'
import StatusMessage from '../components/StatusMessage'
import EditTable from '../components/EditTable'
import {useNavigate, useParams } from 'react-router-dom';
import {BUTTONS} from '../services/constants'
import serverPost from '../services/serverPost'
import {defaultDate} from '../services/functions'


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

const tableName = 'tbl_service'
const searchView = 'view_service'

export default () => {
    const params = useParams()
    const navigate = useNavigate()
    const [list, setList] = useState([])
    const [value, setValue] = useState({})
    const [statusMessage, setStatusMessage] = useState({})
        
    const [constants, setConstants] = useState(params)

    useEffect(()=>{
        setConstants(setConstants(params))
        let dates ={}
        fields.filter(it=>it.type === 'date').forEach(it=>{
                dates = {...dates, [it.name]:defaultDate()}
        }) 
        setValue({...dates})
    }, []) 

    const handleClickLine = val => {
        let dates ={}
        fields.filter(it=>it.type === 'date').forEach(it=>{
                dates = {...dates, [it.name]:val[it.name]?val[it.name]:defaultDate()}
        }) 
        setValue({...val, ...dates})

        setList([])
    }

    const handleStatus = (style, message) => {
        setStatusMessage({style, message})
        let timer = setTimeout(() => setStatusMessage({}), 10000);
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

    return(    

        <div style={styles.container}>
            {constants?constants.id?<h3>{'Servicerapport för id:' + constants.id + ' namn:' + constants.namn}</h3>:null:null}
            <SearchLineAndForm 
                    searchFields={searchFields}
                    tableName={tableName} 
                    searchView={searchView} 
                    header={header}
                    value={value} 
                    setValue={setValue}
                    fields={fields} 
                    list={list} 
                    setList={setList} 
                    handleStatus={handleStatus}
                    buttons={BUTTONS.SAVE|BUTTONS.PRINT}
            >
                    {value?value.id?<h2>Inlämningsrapport:{value.id}</h2>:null:null} 
                    {value?value.namn?<h3>{value.namn}&nbsp;{value.mobil?'Tel:' + value.mobil:null}</h3>:null:null}
            </SearchLineAndForm>
            <EditTable 
                    tableName={tableName} 
                    searchFields={searchFields}
                    list={list} 
                    setList={setList} 
                    handleStatus={handleStatus}  
                    handleClickLine={handleClickLine}
            />
            <StatusMessage style={statusMessage.style} message={statusMessage.message} />
        </div>
    )
}    
           
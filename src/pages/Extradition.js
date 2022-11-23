
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
    container: {
        paddingTop:50,
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
        label:'Utlämnad av',
        name:'utlamnadAv',
        tooltip:'Namn på personen som lämnar tillbaka objektet efter reparation eller kostnadsförslag',
        required:true,
        hiddenIf:'annanPerson'
    },
    {
        type:'text',
        label:'Utlämnad av',
        name:'utlamnadAv',
        tooltip:'Namn på personen som lämnar tillbaka objektet efter reparation eller kostnadsförslag',
        required:true,
        notHiddenIf:'annanPerson'
    },
    {
        type:'checkbox',
        label:'Annan',
        name:'annanPerson',
        tooltip:'Om den som utämnar reparerat gods är en annnan person än de 3 ovan nämnda',
    },
    {
        type:'date',
        label:'Dagens datum',
        name:'utlamnadDate',
        tooltip:'Datum då objekt lämnas tillbaka till kunden',

    },
    {
        type:'checkbox',
        label:'Reparationen har utförts på garantin',
        name:'garanti',
        tooltip:'Datum då kunden accepterat reparation',

    },
    {
        type:'text',
        label:'Kostnad',
        name:'kostnad',
        tooltip:'Totalt kostnad för reparationen',
    },
]



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
        fields.filter(it=>it.type === 'date' && (value[it.name]===null || value[it.name]===undefined)).forEach(it=>{
                dates = {...dates, [it.name]:defaultDate()}
        }) 
        setValue({...dates})
    }, []) 

    const handleStatus = (style, message) => {
        setStatusMessage({style, message})
    }

    const handleClickLine = rec => {
        let dates ={}
        fields.filter(it=>it.type === 'date' && (rec[it.name]===null || rec[it.name]===undefined)).forEach(it=>{
                dates = {...dates, [it.name]:defaultDate()}
        }) 
        // alert('Record=' + JSON.stringify(rec))
        setValue({...rec, ...dates})
        setList([])
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
        handleStatus({backgroundColor:'green'}, 'Uppdaterar servicerapporten i databasen')
        serverPost('/updateRow', '', '', {tableName, record:value, id:value.id}, handleSaveCallback)
    }

    const handleSearchReply = list => {
        if (list.length === 0) {
            handleStatus({backgroundColor:'orange'}, 'Varning: Fick inget resultat vid sökning i database')    
        } if (list.length === 1) {
            handleStatus({backgroundColor:'green'}, undefined)    
            const val = list[0]
            let dates ={}
            fields.filter(it=>it.type === 'date' && (val[it.name]===null || val[it.name]===undefined)).forEach(it=>{
                    dates = {...dates, [it.name]:defaultDate()}
            }) 
            setValue({...val, ...dates})
        } else {
            handleStatus({backgroundColor:'green'}, undefined)    
            setList(list)
        }    
    }

    const handleSearch = () => {
        handleStatus({backgroundColor:'green'}, 'Söker ...') 
        if (value.id) {
            let searchFields = {id:value.id}
        } else {


        }
        search(searchView, searchFields, handleSearchReply) 
    }

    const handleReset = () => {
        setValue({})
        setList([])
    }

    const buttons=[
        {
            style:{color:'black', borderColor:'black'},
            type:'button',
            label:'Skriv ut',
            print:true,
            required:true,
            onAfterPrint:()=>handleSave(value)
        },    
        {
            style:{color:'black', borderColor:'black'},
            type:'button',
            label:'Spara',
            required:true,
            handleClick:()=>handleSave(value)
        },    
        {
            style:{color:'black', borderColor:'black'},
            type:'button',
            label:'Rensa',
            handleClick:handleReset
        },    
    ]


    
    return(    

        <div style={styles.container}>
            {value.id?
                <>
                    <FormTemplate
                            buttons={buttons}
                            tableName={tableName} 
                            fields={fields} 
                            value={value} 
                            setValue={setValue}
                            handleStatus={handleStatus}  
                            handlePressEnter={handleSearch}
                        >
                            {value.id?<h1 style={{margin:'auto'}}>{value.id}</h1>:null}
                            {value.namn?<span style={{fontSize:20}}>{value.namn}</span>:null} 
                            &nbsp;&nbsp;
                            {value.mobil?<span style={{fontSize:20}}>Tel:{value.mobil}</span>:null} 
                    </FormTemplate> 
                    <StatusMessage style={statusMessage.style} message={statusMessage.message} />
                </>
            :
                <>
                    <SearchLineTemplate 
                        searchView={searchView}
                        searchFields={searchFields}
                        setValue={setValue} 
                        setList={setList} 
                        handleStatus={handleStatus}
                    />

                    <EditTable 
                        tableName={tableName}
                        searchView={searchView} 
                        searchFields={searchFields}
                        list={list} 
                        setList={setList} 
                        handleStatus={handleStatus}  
                        handleClickLine={handleClickLine}
                    />
                    <StatusMessage style={statusMessage.style} message={statusMessage.message} />
                </>
            }   
        </div>
    )
} 
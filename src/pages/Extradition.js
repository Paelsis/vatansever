
import {useState, useEffect} from 'react';
import {useParams } from 'react-router-dom';
import NewAndSearchLine from '../components/NewAndSearchLine'
import EditTable from '../components/EditTable'
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
        label:'Utlämnat av',
        name:'utlamnatAv',
        tooltip:'Namn på personen som lämnar tillbaka objektet efter reparation eller kostnadsförslag',
        required:true,
        hiddenIf:'annanPerson'
    },
    {
        type:'text',
        label:'Utlämnat av',
        name:'utlamnatAv',
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
        name:'utlamnadDatum',
        tooltip:'Datum då inlämnat objekt lämnas tillbaka till kunden',

    },
    {
        type:'checkbox',
        label:'Reparationen har utförts på garantin',
        name:'garanti',
        tooltip:'Datum då kunden accepterat reparation',

    },
    {
        type:'text',
        label:'Totalt belopp i SEK',
        name:'belopp',
        tooltip:'Totalt belopp för reparationen',
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
    return(
        <Kalle />
    )
}

export const Kalle = () =>  {
    const params = useParams()
    const [list, setList] = useState([])
    const [value, setValue] = useState({})
    const [status, setStatus] = useState({})
    
    const [constants, setConstants] = useState(params)

    useEffect(()=>setConstants(setConstants(params?params:{})), []) 
        
    const handleRedirect = record => {
        //navigate('/order/' + customerId +  '/' + rec.namn)
        alert('Har ännu ingensans att gå ...')
    }    

    const handleUpArrow = value => {
        // alert('ServiceReport' + JSON.stringify(value))
        setValue(value)
        setList([])
    }
    const statusMessage = (color, message) => {
        setStatus({color, message})
        let timer = setTimeout(() => setStatus({}), 2000);
    }

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

    const handleSave = record => {
        const recordSave = {id:record.id}
        // Save service record
        serverPost('/replaceRow', '', '', {tableName, record:recordSave}, handleReply)
    }

    const onBeforePrint = record => {
        const recordSave = {id:record.id}
        // Save service record
        serverPost('/replaceRow', '', '', {tableName, record:recordSave}, handleReply)
    }

    
    return(    
        <div style={styles.container}>
            {<h3>{'Utläming'}</h3>}
            <NewAndSearchLine 
                    tableName={tableName} 
                    searchView={searchView}
                    searchFields={searchFields}
                    value={value} 
                    setValue={setValue}
                    fields={fields} 
                    list={list} 
                    setList={setList} 
                    statusMessage={statusMessage}
                    buttons={BUTTONS.SAVE_AND_PRINT}
                    onBeforePrint={onBeforePrint}
            >
                {value?value.id?<h3>Inläminingsnummer:{value.id}</h3>:null:null} 
                {value?value.namn?<span>Namn:{value.namn}</span>:null:null}&nbsp;&nbsp; 
                {value?value.mobil?<span>Mobil:{value.mobil}</span>:null:null} 
                <h4>Åtgärder:</h4>
                <div dangerouslySetInnerHTML={{__html: value?value.atgarder?value.atgarder:'':''}} />
                <h4>Material:</h4>
                <div dangerouslySetInnerHTML={{__html: value?value.material?value.material:'':''}} />
                <p/>
            </NewAndSearchLine>
            <EditTable 
                    searchFields={searchFields}
                    tableName={tableName} 
                    list={list} 
                    setList={setList} 
                    statusMessage={statusMessage}  
                    handleUpArrow={handleUpArrow}
            />
            {status.message?<div style={{color:status.color?status.color:'green'}}>{status.message}</div>:null}
        </div>
    )
}

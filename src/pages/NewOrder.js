import React, {useState, useRef, useEffect} from 'react';
import NewOrSearch from '../components/NewOrSearch'
import EditTable from '../components/EditTable'
import {useNavigate, useParams } from 'react-router-dom';
import serverPost from '../services/serverPost'
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

const searchFields = [
    {label:'Service rapport', name:'id'},
    {name:'felbeskrivning'},
    {name:'mottagare'},
    {name:'namn'},
    {name:'mobil'},	
    {name:'email'},	
]    	

const tableName = 'tbl_order'

export default () => {
    const params = useParams()
    const navigate = useNavigate()
    const orderId = params.orderId?params.orderId:undefined
    const namn = params.namn?params.namn:undefined
    const mobil = params.mobil?params.mobil:undefined
    const constants=namn?{orderId, namn}:undefined
    const [list, setList] = useState([])
    const [value, setValue] = useState({})
    const [mode, setMode] = useState(MODE.NEW)
    const [status, setStatus] = useState({color:'red', message:''})

    const handleRedirect = record => {
        if (!record.id) {
            alert('ERROR: Denna databas rad sakaden kundens id, kontakta WEB-administratören:' +  JSON.stringify(record))
            navigate('/service')
        } else if (!record.namn) {
            alert('ERROR: Denna databas rad sakaden kundens namn, kontakta WEB-administratören:' +  JSON.stringify(record))
            navigate('/service')
        } else {
            navigate('/newService/' + record.id +  '/' + record.namn  +  '/' + record.mobil)
        }    
    }    
    const statusMessage = (color, message) => {
        setStatus({color, message})
        let timer = setTimeout(() => setStatus({}), 3000);
    }        

    const handleUpArrow = value => {
        setValue(value)
        setMode(mode&MODE.SEARCH?MODE.NEW:MODE.SEARCH)
        setList([])
    }

    const componentRef = useRef();

    const headerFields = ['id', 'namn', 'mobil']
    return(    
        <div style={styles.container}>
            <h3>Inlämning</h3>
            <p/>
                <NewOrSearch
                    tableName={tableName} 
                    fields={fields} 
                    value={orderId?{...value, id:orderId}:value} 
                    headerFields={headerFields}
                    setValue={setValue}
                    list={list} 
                    setList={setList} 
                    statusMessage={statusMessage}  
                    buttons={BUTTONS.SAVE_AND_PRINT}
                >
                    {orderId?<h1 style={{margin:'auto'}}>{orderId}</h1>:null}
                    {namn?<span style={{fontSize:20}}>{namn}</span>:null} 
                    &nbsp;&nbsp;
                    {mobil?<span style={{fontSize:20}}>Tel:{mobil}</span>:null} 
                </NewOrSearch> 
                <EditTable 
                    tableName={tableName} 
                    list={list} 
                    setList={setList} 
                    handleUpArrow={handleUpArrow}
                />
                <p/>
                {status.message?<h4 style={{color:status.color?status.color:'green'}}>{status.message}</h4>:null}
        </div>    
    )
}

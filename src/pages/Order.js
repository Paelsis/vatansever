import React, {useState, useRef, useEffect} from 'react';
import NewRecord from '../components/NewRecord'
import Search from '../components/Search'
import ShowTable from '../components/ShowTable'
import EditTable from '../components/EditTable'
import {useNavigate, useParams } from 'react-router-dom';
import { SettingsInputHdmiTwoTone } from '@mui/icons-material';
import Button from '@mui/material/Button';
import {useReactToPrint} from 'react-to-print';


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
        radioValues:['Okhan', 'Johannes', 'Mats', 'Annan Person'],
        label:'Mottagare',
        name:'mottagare',
        tooltip:'Mottagare av objektet framme vid disken',
        required:true,
    },
    {
        type:'text',
        label:'Typ av objekt',
        name:'objektTyp',
        tooltip:'Kundens e-mail adress',
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
    {name:'id'},
    {name:'felbeskrivning'},
    {name:'mottagare'},
    {name:'namn'},
    {name:'mobil'},	
    {name:'email'},	
]    	

const searchView = 'view_order'
const tableName = 'tbl_order'

export default () => {
    const params = useParams()
    const navigate = useNavigate()
    const kundId = params.kundId?params.kundId:undefined
    const namn = params.namn?params.namn:undefined
    const constants=namn?{kundId, namn}:undefined
    const [status, setStatus] = useState()
    const [list, setList] = useState([])
    const [value, setValue] = useState({})
    const [mode, setMode] = useState(MODE.SEARCH)

    const handleEdit = row => { 
        setValue(row)
    }    
    const handleOpen = id => {
        const rec = list.find(it=> it.id === id)
        const orderId = id
        navigate('/service/' + orderId +  '/' + rec.namn)
    }    
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    const handleToggle = value => {
        setValue(value)
        setMode(mode&MODE.SEARCH_CUSTOMER?MODE.NEW_CUSTOMER:MODE.SEARCH_CUSTOMER)
        setList([])
    }

        
    return(    
    <div style={styles.container}>
        {status?<h4>{status}</h4>:null}
        {namn?kundId?
            <div>

                <h3>Inlämning av nytt objekt {namn?'för ' + namn:null}</h3>
                <small>Inlämningsnummer:{kundId} namn:{namn}</small>
                <Button color="inherit" type="button" variant="outlined"  onClick={handlePrint}>Print</Button>
                <NewRecord 
                   ref={componentRef} 
                    tableName={tableName} 
                    constants={constants} 
                    fields={fields} 
                    value={value} 
                    list={list} 
                    setList={setList} 
                    setStatus={setStatus} 
                    handleToggle={handleToggle}
                    handleOpen={handleOpen}/>
            </div>
        :null:null}
        <div>
            <h3>Sök objekt {constants?'för ' + namn:null}</h3>
            <Search tableName={tableName} 
                searchView={searchView} 
                fields={searchFields} 
                constants={constants} 
                handleToggle={handleToggle}
                setList={setList} 
            />
            <EditTable 
                tableName={tableName} 
                constants={constants} 
                fields={fields} 
                value={value} 
                list={list} 
                setList={setList} 
                handleEdit={handleEdit} 
                setStatus={setStatus} 
                handleOpen={handleOpen}
            />  
        </div>    
    </div>
    )
}    

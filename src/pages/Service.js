import React, {useState, useEffect} from 'react';
import NewRecord from '../components/NewRecord'
import Search from '../components/Search'
import ShowTable from '../components/ShowTable'
import EditTable from '../components/EditTable'
import {useNavigate, useParams } from 'react-router-dom';
import { KeyRounded } from '@mui/icons-material';
import Button from '@mui/material/Button';


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
        radioValues:['Okhan', 'Johannes', 'Mats', 'Annan Person'],
        label:'Tekniker',
        name:'tekniker',
        tooltip:'Den tekniker som utför jobbet',
        required:true,
    },
    {
        type:'checkbox',
        label:'Kunden har accepterat reparation efter felsökning',
        name:'acceptRep',
        tooltip:'Kunden har accepterat att repation sker efter det att hen fått svar på felsökning',
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
        radioValues:['MAIL', 'MUNTLIGT', 'SMS'],
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
        radioValues:['MAIL', 'MUNTLIGT', 'SMS'],
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
        label:'Total kostnad',
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
        radioValues:['MAIL', 'MUNTLIGT', 'SMS'],
        label:'Kunden har kontaktats för avhämtning via',
        name:'kontaktadVia',
        tooltip:'Kunden har kontaktats för avhämtning via',
    },
]

const searchFields = [
    {
        name:'id'
    },
    {
        name:'felbeskrivning'
    },
    {
        name:'mottagare'
    },
    {
        name:'namn'
    },
    {
        name:'mobil'
    },	
    {
        name:'email'
    },	
    {
        name:'orderId'
    },
]    	

const searchView = 'view_service'
const tableName = 'tbl_service'

export default () => {
    const params = useParams()
    const navigate = useNavigate()
    const orderId = params.orderId?params.orderId:undefined
    const namn = params.namn?params.namn:undefined
    const constants=namn?{orderId, namn}:undefined
    const [status, setStatus] = useState()
    const [list, setList] = useState([])
    const [value, setValue] = useState()

    const handleEdit = row => { 
        setValue(row)
    }    
    const handleOpen = id => {
        //navigate('/order/' + customerId +  '/' + rec.namn)
        alert('Service rapport id '  + id + ' har ingenstans att gå ännuu')    }    

        

    return(    
    <div style={styles.container}>
        {status?<small>{status}</small>:null}
        {namn || orderId || value?
            <div>

                <h3>Service rapport {namn?'för ' + namn:null}</h3>
                <small>Inlämningsnummer:{orderId} namn:{namn}</small>
                <NewRecord tableName={tableName} constants={constants} fields={fields} value={value} list={list} setList={setList} setStatus={setStatus} handleOpen={handleOpen}/>
            </div>
        :null}
        <div>
            <h3>Sök i service rapporter {constants?'för ' + namn:null}</h3>
            <Search tableName={tableName} 
                searchView={searchView} 
                fields={searchFields} 
                constants={constants} 
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

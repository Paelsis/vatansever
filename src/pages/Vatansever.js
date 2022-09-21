import React, {useState, useEffect} from 'react';
import  {Component } from 'react'
import FormTemplate from '../components/FormTemplate';
import EditTable from '../components/EditTable';
import Search from '../components/Search';
import Button from '@mui/material/Button';
import {useLocation} from 'react-router-dom'
import moment from 'moment-with-locales-es6'
import { textAlign } from '@mui/system';
import Tooltip from '@mui/material/Tooltip';
import { AirlineSeatIndividualSuite, AirlineSeatReclineExtra, Description } from '@mui/icons-material';
import { getAuth, onAuthStateChanged} from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import serverPost from '../services/serverPost'
import serverFetch from '../services/serverFetch';

const styles={
    container: color=>({
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth:'100%', 
        color,
        borderColor:color,   
    }),
    button:{
        color:'black',
        border:'1px solid red'
    }    
}

const searchFields = [
   {
        name:'name',
        placeholder:'Sök namn'   
   },
   {
         name:'phone',
         placeholder:'Sök telefon'   
   },
   {
        name:'id',
        placeholder:'Sök kundnummer'   
   }
]


const viewTable = list =>
    <table>
        <thead>
            <tr>    
                {Object.keys(list[0]).map(key=>
                    <th>{key}</th>
                )}
            </tr>
        </thead>
        <tbody>
        {list.map(obj=>
            <tr>
                {Object.entries(list[0]).map(obj=><td>{obj[1]}</td>)}
            </tr>
        )}
        </tbody>
    </table>


const fields = [
    {
        type:'text',
        label:'Order id (genereras)',
        name:'orderId',
        placeholder:'Ett id nummer som genereras automatiskt',
        tooltip:'Order id genereras vid när rapporten sparas första gången i databasen'
    },
    {
        type:'text',
        label:'Namn',
        name:'name',
        tooltip:'Kundens för- och efternamn',
        required:true,
    },
    {
        type:'text',
        label:'Telefonnummer',
        name:'phone',
        tooltip:'Kundens telefonnummer',
        required:true,
    },
    {
        type:'text',
        label:'email adress',
        name:'email',
        tooltip:'Kundens e-mail adress',
    },
    {
        type:'text',
        label:'Rubrik',
        name:'title',
        // required:true,

        tooltip:'Rubrik på reparationen',
    },
    {
        type:'textareaSimple',
        label:'Felbeskrivning',
        name:'description',
        tooltip:'Bekrivning av felet och dess karraktär',
        //required:true,
    },
    {
        type:'checkbox',
        label:'Reparation påbörjats',
        name:'repairStarted',
        tooltip:'Kryssas i när reparation påbörjats'
    },
    {
        label:'Åtgärder',
        type:'textareaSimple',
        name:'repairs',
        tooltip:'Åtgärder på objektet',
        notHiddenIf:'repairStarted',
        required:true,
    },
    {
        type:'datetime-local',
        label:'Lämnat till kund',
        name:'outDate',
        hiddenIf:'changeAll',
        tooltip:'När kunden fått varan i return'
    },
    {
        type:'checkbox',
        label:'Betalat',
        name:'payed',
        tooltip:'När kunden betalat'
    },
    {
        type:'text',
        label:'Belopp i SEK',
        name:'amount',
        tooltip:'Kunden har betalat ett visst belopp',
        notHiddenIf:'payed',
        required:true,
    },
    {
        type:'checkbox',
        label:'Färdigreparerad',
        name:'ready',
        tooltip:'När objektet är färdigreparerat skall denna ruta fyllas i'
    },
    {
        type:'checkbox',
        label:'I retur till oss',
        name:'returned',
        tooltip:'Om objektet returnerats från kunde pga att åtgärden inte hjälpt'
    },
    {
        type:'date',
        label:'Returdatum',
        name:'returnedDate',
        notHiddenIf:'returned',
        tooltip:'Change start date and time for single event',
        required:true,
    },
    {
        type:'textareaSimple',
        label:'Åtgärder efter retur',
        name:'returnedRepairs',
        tooltip:'Om objektet returnerats från kunde pga att åtgärden inte hjälpt',
        notHiddenIf:'returned',
    },
]
const init={name:'Per Eskilson', email:'paelsis@hotmail.com', phone:'0733780740'}
const customerNumber=12
const tableName = 'tbl_customer'
  
export default (state) => {
   const [color, setColor] = useState('green')
   const [list, setList] = useState([])
   const [edit, setEdit] = useState([])
   const [search, setSearch] = useState({})
   useEffect(()=>{serverFetch('/fetchRows?tableName=tbl_customer', '', '', list=>setList(list))},[]);
   const navigate = useNavigate() 
   const location = useLocation();
   const handleReply = reply =>{
        if (reply.status ==='OK') {
            setColor('green')
        } else {
            alert('Reply:', JSON.stringify(reply))
        }    
    }     
   const handleDelete = (e, value) => {serverPost('/deleteRecord', '', '', {tableName, value}, handleReply)}
   const handleUpdate =  (id) => {serverPost('/replaceRow', '', '', {tableName, record:list.find(it=>it.id === id)}, handleReply)}
   const handleEdit = ed => {
        const foundObj = Object.entries(edit).find(obj=>obj[1]===true)
        if (foundObj) {
            handleUpdate(foundObj[0])
        }   
        setEdit(ed)
      }
   return (
        <div style={styles.container(color)}>
            <>
                <h1>Vatansever Ljud</h1>
                <Search tableName={tableName} searchFields={searchFields} list={list} setList={setList} />
                <FormTemplate 
                    init={init}
                    fields={fields} 
                    handleSubmit={handleUpdate}
                    handleDelete={handleDelete}
                    submitTooltipTitle={'SPARA fältet'}
                    submitButtonText={'SPARA'}
                    update={true}
                />
                <EditTable list={list} setList={setList} edit={edit} handleEdit={handleEdit} />
                </>
        </div>
    )
}

//{list.length >0?viewTable(list):<h1>No data in table</h1>}

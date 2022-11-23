import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormField from './FormField';
import getTypeFromColumnType from '../services/getTypeFromColumnType'
import {BUTTONS} from '../services/constants'
import ReactToPrint from 'react-to-print';
import {defaultDate} from '../services/functions'
import serverFetch from '../services/serverFetch';
import serverPost from '../services/serverPost'
import {search} from '../services/search'


const TEXTS={
    BUTTON:'Send registration'
}

const getField = column => {
    const name = column.Field    
    const type = getTypeFromColumnType(column)
    return {type, name, label:name, tooltip:'No helptext', names:undefined,  required:false}
}    

// FormTemplate.js
export default props => {
    const componentRef=useRef()
    const navigate = useNavigate()
    const {tableName, value, setValue, fields, buttons, handleStatus} = props

    const handleRensa = () => {
        //setList([])
        setValue({})
    }    

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            search(props)
        }
    }

    const callback = reply => {
        navigate('/home)')
    }

    // Callback after save 
    const handleNavigate = reply => {
        if (reply.status==='OK') {
            if (props.handleStatus) {
                handleStatus({backgroundColor:'green'}, undefined)
            }    
            // setList(replaceOrInsertList(reply.record, list))
            if (handleNavigate) {
                handleNavigate(reply.record)
            }    
        } else {
            if (props.handleStatus) {
                handleStatus({backgroundColor:'red'}, 'NewAndSearchLineError when inserting record. Reply message:' + JSON.stringify(reply.message))
            }    
        }    
    }    

    // Callback after print and save
    const handleAfterPrint = reply => {
        if (reply.status==='OK') {
            if (props.handleStatus) {
                props.handleStatus({backgroundColor:'green'}, 'Gå vidare till hem')
            }    
            // setList(replaceOrInsertList(reply.record, list))
            if (navigate) {
                navigate('/home')
            }    
        } else {
            if (props.handleStatus) {
                props.handleStatus({backgroundColor:'red'}, 'NewAndSearchLineError when inserting record. Reply message:' + JSON.stringify(reply))
            }    
        }    
    }    


    const handleSave = (value, handleReply) => {
        // The variable safe=true will be added to the call to tell that we shall perform safe insert, i.e. only insert existing columns 
        if (props.handleStatus) {
            props.handleStatus({color:'orange'}, 'Sätter in i databasen ...') 
        }    
        serverPost('/replaceRow', '', '', {tableName, record:value}, handleReply)
    }

    const fetchSearchView = columns =>
    {
        let args =""
        Object.entries(columns).map(it=> {
            if (it[1]) {
                args += '&'
                args += it[0] +  '=' + it[1]
            }
        })
        if (props.handleStatus) {
            props.handleStatus({backgroundColor:'green'}, 'Söker ...')
        }
       
        if (props.setList) {
            props.setList([])
        }    
        const link = '/fetchRows?tableName=' + props.searchView + args
        serverFetch(link, '', '', list=>{
            if (list.length > 0) {
                if (props.handleStatus) {
                    props.handleStatus({backgroundColor:'green'}, undefined)
                }
                if (props.setList) {
                    props.setList(list.sort((a,b) => b.id - a.id))
                }    
            } else {
                if (props.handleStatus) {
                    props.handleStatus({backgroundColor:'green'}, 'Not found with link:' + link)
                }
            }   
        })
    }        

    const handleSearch = value => {
        const constants = props.constants?props.constant:{}
        const searchValues = {...value, ...constants}
        fetchSearchView(searchValues)
    }    

    const disabled = fields?fields.map(fld => fld.required?fld.required===true?value[fld.name]?false:true:false:false).find(it=>it === true)?true:undefined:undefined    
    return(
        <div>   
                <form>
                    <div ref={componentRef}>
                        {props.children}
                        {fields.map((fld, index) => 
                        <>
                            <FormField key={index}  fld={fld} value={value} setValue={setValue} handleKeyPress={handleKeyPress} />
                        </>
                    )}
                    </div>
                    {props.searchFields && handleSearch?<><Button color="inherit" type="button" variant="outlined" onClick={()=>search(props)} >Sök</Button>&nbsp;</>:null}
                    {buttons&BUTTONS.SAVE?<><Button color="inherit" type="button" disabled={disabled} variant="outlined" onClick={()=>handleSave(value, handleNavigate)} >Spara</Button>&nbsp;</>:null}    
                    {buttons&BUTTONS.PRINT?
                        <>
                        <ReactToPrint
                            trigger={() => <Button color="inherit" type="button" disabled={disabled} variant="outlined">Skriv ut</Button>}
                            onAfterPrint={()=>navigate('/home')}
                            onPrintError={()=>{
                                if (props.handleStatus) {
                                    handleStatus({backgroundColor:'red'}, 'Print failed')
                                }
                            }}
                            content={() => componentRef.current} 
                        />
                        &nbsp;
                        </>
                    :null}
                    {buttons&BUTTONS.SAVE_AND_PRINT?
                        <>
                        <ReactToPrint
                            trigger={() => <Button color="inherit" type="button" disabled={disabled} variant="outlined">Skriv ut</Button>}
                            onBeforePrint={()=>handleStatus({backgroundColor:'green'}, 'Printar ut ...')}
                            onAfterPrint={()=>handleSave(value, handleAfterPrint)}
                            onPrintError={()=>{
                                if (props.handleStatus) {
                                    handleStatus({backgroundColor:'red'}, 'Print failed')
                                }
                            }}
                            content={() => componentRef.current} 
                        />
                        &nbsp;
                        </>
                    :null}
                    <Button color="inherit" type="button" variant="outlined" onClick={()=>handleRensa()}>Rensa</Button>
                </form>
        </div>
    )
}


//{JSON.stringify(fld)}




import React, {useState, useRef, useEffect} from 'react';
import Button from '@mui/material/Button';
import FormField from './FormField';
import getTypeFromColumnType from '../services/getTypeFromColumnType'
import {BUTTONS} from '../services/constants'
import ReactToPrint from 'react-to-print';

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
    const [value_local, setValue_local] = useState({})
    const {fields, handleSearch, setList, buttons, handleSave, setStatus} = props
    const value = props.value?props.value:value_local
    const setValue = props.setValue?props.setValue:setValue_local

    const handleSubmit = (e, value) => {
        e.preventDefault()        

        handleSave(value)
    }

    const handleRensa = () => {
        setList([])
        setValue({})
    }    
    
    return(
        <div>
                <form onSubmit={e=>handleSubmit(e, value)}>
                    <div ref={componentRef}>
                    {props.children}
                    {fields.map(fld => 
                        <FormField fld={fld} value={value} setValue={setValue} />
                    )}
                    </div>
                    {handleSearch?<><Button color="inherit" type="button" variant="outlined" onClick={()=>handleSearch(value)} >Sök</Button>&nbsp;</>:null}
                    {buttons&BUTTONS.SAVE?<><Button color="inherit" type="submit" variant="outlined" >Spara</Button>&nbsp;</>:null}    
                    {buttons&BUTTONS.PRINT?
                        <>
                        <ReactToPrint
                            trigger={() => <Button color="inherit" type="button" variant="outlined">Skriv ut</Button>}
                            onAfterPrint={()=>setStatus('green', 'Print is ready')}
                            onPrintError={()=>setStatus('red', 'Print failed')}
                            content={() => componentRef.current} 
                        />
                        &nbsp;
                        </>
                    :null}
                    {buttons&BUTTONS.SAVE_AND_PRINT?
                        <>
                        <ReactToPrint
                            trigger={() => <Button color="inherit" type="button" variant="outlined">Skriv ut</Button>}
                            onBeforeGetContent={()=>handleSave(value)}
                            onAfterPrint={()=>setStatus('green', 'Print is ready')}
                            onPrintError={()=>setStatus('red', 'Print failed')}
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




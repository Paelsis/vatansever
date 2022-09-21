import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import moment from 'moment-with-locales-es6'
import getTypeFromColumnType from '../services/getTypeFromColumnType'
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import RteEditor from './RteEditor'
import {isAndroidOperatingSystem} from '../services/isAndroid'
import FormField, {RenderField1} from './FormField'

const TEXTS={
    BUTTON:'Send registration'
}

const DEV_TEST_OBJECT = {
    title:'Test titel',
    description:'Test desc ...',
    startDate:moment().format('YYYY-MM-DD'),
    startTime:'19:00',
    endTime:'20:30',
    location:'Malmö',
    repeat:false,
}

const PROD_OBJECT = {
    repeat:false,
    frequency:1,
    interval:'weeks',
    until:moment().add(4, 'weeks').add(1,'days').format('YYYY-MM-DD')
}

const getField = column => {
    const name = column.Field    
    const type = getTypeFromColumnType(column)
    return {type, name, label:name, tooltip:'No helptext', names:undefined,  required:false}
}    

const FormTemplate = props => {
    const [value, setValue] = useState({})
    const {fields, columns, handleSubmit, handleToggle} = props
    const foundName = name => columns?columns.length > 0?columns.find(it=>it.Field === name)?true:false:true:true

    useEffect(()=>{
        if (props.value) {
            setValue(props.value)
        }    
    }, [props.value])

    
   
    return(
        <form onSubmit={e=>handleSubmit(e, value)}>
                {fields?
                    fields.map(fld => 
                        foundName(fld.name)?
                           <FormField fld={fld} value={value} setValue={setValue} />
                        :    
                            <p style={{color:'red'}}>{fld.label}:Variablen {fld.name} saknas i tabell-definitionen</p>
                    )
                :columns?
                    columns.length === 0 ?<h3 >No fields and no columns</h3>:<h3 >No fields and no columns</h3>
                    :columns.map(col => <FormField fld={getField(col)} value={value} setValue={setValue} />)
                } 
                <Button color="inherit" type="submit" variant="outlined" >Spara</Button>
                &nbsp;
                {handleToggle?<Button color="inherit" type="button" onClick={()=>handleToggle(value)} variant="outlined" >Sök</Button>:null}
                &nbsp;
                <Button color="inherit" type="button" onClick={()=>setValue({})} variant="outlined" >Clear</Button>
        </form>
    )
}
//:columns.map(col => <RenderField1 fld={getField(col)} value={value[col.Field]} setValue={setValue} />)


export default FormTemplate


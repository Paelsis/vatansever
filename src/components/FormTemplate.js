import React, {useState, useRef, useEffect} from 'react';
import ReactToPrint from 'react-to-print';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import Button, { buttonClasses } from '@mui/material/Button';
import FormField from './FormField';
import getTypeFromColumnType from '../services/getTypeFromColumnType'
import {defaultDate} from '../services/functions'
import serverFetch from '../services/serverFetch';
import serverPost from '../services/serverPost'
import {search} from '../services/search'
import PrintComponent from './PrintComponent';
import { mergeBreakpointsInOrder } from '@mui/system';


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
    const {fields, buttons, value, setValue} = props
    const componentRef=useRef()
    const handleKeyPress = e => {
        if (e.key === 'Enter' && !!props.handlePressEnter) {
            props.handlePressEnter()
        }
    }


    const PrintComponent = props => {
        const uniqueFields = () => {
            let unique = [fields[0]]    
            for (let i=1; i < fields.length; i++) {
                let found = false;
                for (let j=0; j <= i-1; j++) {
                    if (fields[i].label===fields[j].label) {
                        found = true
                    }    
                }
                if (!found) {
                    unique = [...unique, fields[i]]
                }    
            }
            return unique                        
        }    
        return(    
            <div>
                {props.children}
                <p/>
                <tab>
                {uniqueFields().map(fld=>
                    value[fld.name]?
                        <tr>
                            <td style={{overflowWrap:'break-word', width:80}} >{fld.label}</td><td>{<div dangerouslySetInnerHTML={{__html:value[fld.name]}}/>}</td>            
                        </tr>
                    :
                        null
                )}    
                </tab>
            </div>
        )
    }
    
    const disabled = fields?fields.map(fld => fld.required?fld.required===true?value[fld.name]?false:true:false:false).find(it=>it === true)?true:undefined:undefined    
    return(
        <div>   
                <form>
                    <div style={{display:'none'}}>
                        <div ref={componentRef}>
                            <PrintComponent {...props} />
                        </div>
                    </div>
                    <div>
                        {props.children}
                        {fields.map((fld, index) => 
                            <>
                                <FormField key={index}  fld={fld} value={value} setValue={setValue} handleKeyPress={handleKeyPress} />
                            </>
                        )}
                    </div>
                    {buttonClasses?
                        <>
                            {buttons.map(button =>
                                <span style={button.style}>
                                    {button.print?
                                        <ReactToPrint
                                            trigger={() => 
                                                <Button
                                                    variant="outlined" 
                                                    color="inherit" 
                                                    type={button.type} 
                                                    disabled={button.required?disabled:false}
                                                >
                                                    {button.label}
                                                </Button>
                                            }
                                            content={()=>componentRef.current}
                                            onAfterPrint={button.onAfterPrint}
                                        />    
                                    :
                                        <Button 
                                            variant="outlined" 
                                            color="inherit" 
                                            type={button.type} 
                                            disabled={button.required?disabled:false}
                                            onClick={button.handleClick}
                                        >
                                            {button.label}
                                        </Button>
                                    }                       
                                    &nbsp;

                                </span>
                            )}
                        </>
                    :<h1>No buttons</h1>}    
                </form>
        </div>
    )
}


//{JSON.stringify(fld)}




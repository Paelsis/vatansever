import { useNavigate } from 'react-router-dom';
import Button, { buttonClasses } from '@mui/material/Button';
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
    const {fields, buttons, value, setValue} = props
    const componentRef=useRef()
    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            props.search(props)
        }
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
                    {buttonClasses?
                        <>
                            {buttons.map(button =>
                                <Button 
                                    variant='outlined' 
                                    type={button.type} 
                                    disabled={button.required?disabled:false}
                                    onClick={button.handleClick}
                                >
                                    {button.label}
                                </Button>
                            )}
                        </>
                    :<h1>No buttons</h1>}    
                </form>
        </div>
    )
}


//{JSON.stringify(fld)}




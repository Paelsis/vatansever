
import React, {useState, useEffect} from 'react';
import RteEditor from './RteEditor'
import Tooltip from '@mui/material/Tooltip';
import {isAndroidOperatingSystem} from '../services/isAndroid'
import moment from 'moment'

const isAndroid = isAndroidOperatingSystem()

// FormField 
export default ({fld, key, value, setValue, handleKeyPress})=> {
    const show = (fld.hiddenIf?value[fld.hiddenIf]?false:true:true) && (fld.notHiddenIf?value[fld.notHiddenIf]?true:false:true)
    const radioValues = fld.radioValues?fld.radioValues.map(it=>it.trim()):fld.values?fld.values:undefined
    const selectValues = fld.selectValues?fld.selectValues.map(it=>it.trim()):undefined
    const label = fld.label?fld.label:'No label'
    const tooltip=fld['tooltip']?fld['tooltip']:''
    const handleChange = e => setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    //const handleChange = e => alert(JSON.stringify(e.target))
    const handleChangeRte = (fld, val) => setValue({...value, [fld]:val})
    const defaultDate = () =>{
        const today = new Date();
        const date = today.setDate(today.getDate()); 
        const defaultValue = new Date(date).toISOString().split('T')[0] // yyyy-mm-dd
        return defaultValue
    } 
    // const defaultDate = moment().format()
    if (show) {
        switch (fld.type) {
            case 'checkbox':
                    return(
                        <p>
                            <label>
                                <Tooltip title={fld['tooltip']?fld['tooltip']:''}>
                                <input 
                                    key={key}
                                    size={200} 
                                    type={fld.type} 
                                    checked={value[fld.name]?true:false} 
                                    name={fld.name} style={fld.style}  
                                    required={fld.required} 
                                    onChange={handleChange}
                                />
                                </Tooltip>
                                {label}&nbsp;&nbsp;&nbsp;&nbsp;{fld.required?<sup style={{color:'red'}}>*</sup>:null}
                            </label> 
                        </p>
                    )
            case 'checkboxes':
                return(
                    <p>
                        {label}&nbsp;{fld.required?<sup style={{color:'red'}}>*</sup>:null}
                        <br/>
                        {fld.names?fld.names.map(name =>
                            <label>
                                {name}&nbsp;
                                <Tooltip title={tooltip}>
                                <input 
                                    key={key}
                                    keytype={'checkbox'} 
                                    name={name} 
                                    checked={value[fld.name]?true:false} 
                                    required={fld.required} 
                                    onChange={handleChange}
                                />
                                </Tooltip>
                            </label>
                        ):null}
                    </p> 
                )
            case 'radio':
                return(
                    <p>
                        {label}&nbsp;{fld.required?<sup style={{color:'red'}}>*</sup>:null}
                        <br/>
                        {radioValues?radioValues.map(val =>
                            <label>
                                <Tooltip title={fld['tooltip']?fld['tooltip']:''}>
                                <input 
                                    key={key}
                                    type={fld.type}
                                    value={val} 
                                    name={fld.name} 
                                    required={fld.required}
                                    checked={value[fld.name] === val}
                                    onChange={handleChange}
                                />
                                </Tooltip>
                                &nbsp;{val}
                            </label>
                        ):[]}
                    </p> 
                )
            case 'select':
                return(
                <p>        
                    {label}&nbsp;{fld.required?<sup style={{color:'red'}}>*</sup>:null}
                    <select 
                        key={key}
                        name={fld.name} 
                        value={value[fld.name]} 
                        required={fld.required} 
                        onChange={handleChange}
                    >
                        <option selected disabled value={""}>Välj</option>
                        {selectValues?selectValues.map(val => (      
                            <option value={val}>{val}</option>
                        )):[]}
                    </select>
                    </p>
                )
            case 'rte':
                return(
                    <label>
                            {label}&nbsp;{fld.required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;<br/>
                            {isAndroid?
                                <textarea 
                                    key={key}
                                    rows={5} 
                                    cols={40} 
                                    name={fld.name} 
                                    value={value[fld.name]} 
                                    onChange={handleChange}
                                />
                            :
                                <RteEditor value={value[fld.name]} name={fld.name} style={fld.style} onChange={val => handleChangeRte(fld.name, val)} />
                            }
                    </label>
                    
                )    
                case 'date':
                    return(
                        <p>
                            <label>
                            {label}&nbsp;{fld.required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;<br/>
                            <input 
                                key={key}
                                {...fld} 
                                type={fld.type} 
                                size={40}
                                value={value[fld.name]?value[fld.name]:defaultDate()} 
                                name={fld.name}
                                style={fld.style} 
                                required={fld.required}
                                onChange={handleChange} 
                            />
                            </label>    
                        </p>
                        
                    )    
                case 'textarea':
                    return(
                        <p>
                                {label}&nbsp;{fld.required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;<br/>
                                <textarea 
                                    key={key}
                                    rows={5} 
                                    cols={40} 
                                    name={fld.name} 
                                    required={fld.required} 
                                    value={value[fld.name]}
                                    onChange={handleChange} 
                                    onKeyPress={handleKeyPress} 
                                />
                       </p>
                        
                    )    
            default:
                return(
                    <p>
                        {label}&nbsp;{fld.required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;<br/>
                        <Tooltip title={fld['tooltip']?fld['tooltip']:'No help text'}>
                                <input 
                                {...fld} 
                                    key={key}
                                    type={fld.type}
                                    size={40}
                                    value={value[fld.name]?value[fld.name]:''} 
                                    name={fld.name} style={fld.style} 
                                    required={fld.required} 
                                    onChange={handleChange}
                                    onKeyPress={handleKeyPress}
                                />
                        </Tooltip>
                    </p>
                )
        }
    } else {
            return(null)
    }    
}

/*
export const RenderField1 = ({fld, value, setValue}) => {
    const handleChange = e => setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    return(    
        <input {...fld} type={fld.type} size={40} value={value[fld.name]?value[fld.name]:''} name={fld.name} style={fld.style} required={fld.required} onChange={handleChange} />
    )
}

*/
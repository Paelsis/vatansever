
import React, {useState, useEffect} from 'react';
import RteEditor from './RteEditor'
import Tooltip from '@mui/material/Tooltip';
import {isAndroidOperatingSystem} from '../services/isAndroid'

const isAndroid = isAndroidOperatingSystem()

export default ({fld, value, setValue})=> {
    const show = (fld.hiddenIf?value[fld.hiddenIf]?false:true:true) && (fld.notHiddenIf?value[fld.notHiddenIf]?true:false:true)
    const radioValues = fld.radioValues?fld.radioValues.map(it=>it.trim()):fld.values?fld.values:undefined
    const selectValues = fld.selectValues?fld.selectValues.map(it=>it.trim()):undefined
    const label = fld.label?fld.label:'No label'
    const tooltip=fld['tooltip']?fld['tooltip']:''
    const handleChange = e => setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    //const handleChange = e => alert(JSON.stringify(e.target))
    const defaultDate = () =>{
        const today = new Date();
        const numberOfDaysToAdd = 3;
        const date = today.setDate(today.getDate() + numberOfDaysToAdd); 
        const defaultValue = new Date(date).toISOString().split('T')[0] // yyyy-mm-dd
        return defaultValue
    }    
    if (show) {
        switch (fld.type) {
            case 'checkbox':
                    return(
                        <>
                        {label}&nbsp;{fld.label?fld.label:fld.name?<sup style={{color:'red'}}>*</sup>:null}&nbsp;<br/>
                        <input size={200} type={fld.type} checked={value[fld.name]?true:false} name={fld.name} style={fld.style}  placeholder={fld.label?fld.label:fld.name} onChange={handleChange} />
                        </>
                    )
            case 'checkboxes':
                return(
                        <>
                            {fld.names?fld.names.map(name =>
                                <>
                                    <input keytype={'checkbox'} name={name} checked={value[fld.name]?true:false} placeholder={fld.label?fld.label:fld.name} onChange={handleChange}/>
                                </>
                            ):null}
                        </>
                )
            case 'radio':
                return(
                    <>
                        {label}&nbsp;{fld.label?fld.label:fld.name?<sup style={{color:'red'}}>*</sup>:null}&nbsp;<br/>
                        {radioValues?radioValues.map(val =>
                            <>
                                <input type={fld.type} value={val} name={fld.name} placeholder={fld.label?fld.label:fld.name} checked={value[fld.name] === val} onChange={handleChange}/>
                                &nbsp;{val}
                            </>
                        ):[]}
                    </> 
                )
            case 'select':
                return(
                    <>        
                        <select name={fld.name} value={value[fld.name]} placeholder={fld.label?fld.label:fld.name} onChange={handleChange}>
                            <option selected disabled value={""}>Välj</option>
                            {selectValues?selectValues.map(val => (      
                                <option value={val}>{val}</option>
                            )):[]}
                        </select>
                    </>
                )
            case 'rte':
                return(
                    <>
                        <textarea rows={5} cols={40} name={fld.name} value={value[fld.name]} onChange={handleChange}/>
                    </>
                    
                )    
            case 'textarea':
                    return(
                        <>
                                <textarea rows={5} cols={40} name={fld.name} placeholder={fld.label?fld.label:fld.name} value={value[fld.name]} onChange={handleChange}/>
                       </>
                    )    
            case 'date':
                return(
                    <>
                        {label}&nbsp;{fld.label?fld.label:fld.name?<sup style={{color:'red'}}>*</sup>:null}&nbsp;<br/>
                        <input {...fld} type={fld.type} size={40} value={value[fld.name]?value[fld.name]:defaultDate()} name={fld.name} style={fld.style} placeholder={fld.label?fld.label:fld.name} onChange={handleChange} />
                    </>
                    
                )    
            default:
                return(
                    <>
                        <Tooltip title={fld['tooltip']?fld['tooltip']:'No help text'}>
                                <input {...fld} type={fld.type} size={10} value={value[fld.name]?value[fld.name]:''} name={fld.name} style={fld.style} placeholder={fld.label?fld.label:fld.name} onChange={handleChange} />
                        </Tooltip>
                    </>
                )
        }
    } else {
            return(null)
    }    
}


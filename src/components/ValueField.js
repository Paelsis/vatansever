
import React, {useState, useEffect} from 'react';
import RteEditor from './RteEditor'
import {isAndroidOperatingSystem} from '../services/isAndroid'
import moment from 'moment'

const isAndroid = isAndroidOperatingSystem()

// FormField 
const FormField = props => {
    const {fld, key, value, setValue, handleKeyPress} = props
    const show = (fld.hiddenIf?value[fld.hiddenIf]?false:true:true) && (fld.notHiddenIf?value[fld.notHiddenIf]?true:false:true)
    const radioValues = fld.radioValues?fld.radioValues.map(it=>it.trim()):[]
    const selectValues = fld.selectValues?fld.selectValues.map(it=>it.trim()):[]
    const label = fld.label?fld.label:'No label'
    const tooltip=fld.tooltip?fld.tooltip:'Ingen hjälptext'
    const handleChange = e => setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    const required = fld.required?true:false
    //const handleChange = e => alert(JSON.stringify(e.target))

    //const defaultDate = moment().format()
    if (show) {
        switch (fld.type) {
            case 'checkbox':
                    return(
                        <p>
                            <label>
                                <input 
                                    key={key}
                                    size={200} 
                                    type={fld.type} 
                                    checked={value[fld.name]?true:false} 
                                    name={fld.name} style={fld.style}  
                                    required={required} 
                                    onChange={handleChange}
                                />
                                {label}&nbsp;&nbsp;&nbsp;&nbsp;{required?<sup style={{color:'red'}}>*</sup>:null}
                            </label> 
                        </p>
                    )
            case 'checkboxes':
                return(
                    <p>
                        <label>
                                {label}&nbsp;{required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        {fld.names?fld.names.map(name =>
                            <label>
                                {name}&nbsp;
                                <input 
                                    key={key}
                                    type={'checkbox'} 
                                    name={name} 
                                    checked={value[fld.name]?true:false} 
                                    required={required} 
                                    onChange={handleChange}
                                />
                            </label>
                        ):null}
                    </p> 
                )
            case 'radio':
                return(
                    <p>
                        <label>
                                {label}&nbsp;{required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        {radioValues.map((val, idx) =>
                            <label>
                                <input 
                                    key={val + idx}
                                    type={fld.type}
                                    value={val} 
                                    name={fld.name} 
                                    required={fld.required}
                                    checked={value[fld.name] === val}
                                    onChange={handleChange}
                                />
                                &nbsp;{val}
                            </label>
                        )}
                    </p> 
                )
            case 'select':
                return(
                     <p>      
                        <label>
                                {label}&nbsp;{required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        <select 
                            key={key}
                            name={fld.name} 
                            value={value[fld.name]?value[fld.name]:''} 
                            required={required} 
                            onChange={handleChange}
                        >
                            <option selected disabled value={""}>Välj</option>
                            {selectValues.map(val => <option value={val}>{val}</option>)}
                        </select>
                    </p>
                )
            case 'rte':
                return(
                    <p>
                        <label>
                                {label}&nbsp;{required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        {isAndroid?
                            <textarea 
                                key={key}
                                rows={5} 
                                cols={40} 
                                name={fld.name} 
                                value={value[fld.name]?value[fld.name]:''} 
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            />
                        :
                            <RteEditor 
                                style={fld.style}
                                name={fld.name} 
                                value={value[fld.name]?value[fld.name]:''}
                                onChange={val => setValue({...value, [fld.name]:val})}
                            />
                        }
                    </p>
                )    
            case 'date':
                    return(
                        <p>
                            <label>
                                    {label}&nbsp;{required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;
                            </label>    
                            <br/>
                            <input 
                                key={key}
                                {...fld} 
                                type={fld.type} 
                                size={40}
                                value={value[fld.name]} 
                                name={fld.name}
                                style={fld.style} 
                                required={required}
                                onChange={handleChange} 
                            />
                        </p>
                    )    
            case 'textarea':
                    return(
                        <p>
                                <label>
                                        {label}&nbsp;{required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;
                                </label>    
                                <br/>
                                <textarea 
                                    key={key}
                                    rows={5} 
                                    cols={40} 
                                    name={fld.name} 
                                    required={required} 
                                    value={value[fld.name]?value[fld.name]:''}
                                    onChange={handleChange} 
                                    onKeyPress={handleKeyPress} 
                                />
                       </p>
                    )    
                case 'comment':
                        return(
                            <p>
                                    <label>
                                            {label}
                                    </label>    
                                    <br/>
                                    {value[fld.name]?value[fld.name]:''}
                           </p>
                        )    
                default:
                return(
                    <p>
                        <label>
                                {label}&nbsp;{required?<sup style={{color:'red'}}>*</sup>:null}&nbsp;
                        </label>    
                        <br/>
                        <input 
                            {...fld} 
                            key={key}
                            type={fld.type}
                            size={40}
                            name={fld.name} style={fld.style} 
                            value={value[fld.name]?value[fld.name]:''} 
                            required={required} 
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                        />
                    </p>
                )
        }
    } else {
        return null
    }    
}

const FormField1 = props => {
    return(
    <p>
        <h1 style={{color:'red'}}>Before</h1>
        {JSON.stringify(props)}    
        <h1>After</h1>
        <p/>
    </p>
    )
}

export default FormField

/*
export const RenderField1 = ({fld, value, setValue}) => {
    const handleChange = e => setValue({...value, [e.target.name]:e.target.type==='checkbox'?e.target.checked:e.target.value})
    return(    
        <input {...fld} type={fld.type} size={40} value={value[fld.name]?value[fld.name]:''} name={fld.name} style={fld.style} required={fld.required} onChange={handleChange} />
    )
}

*/
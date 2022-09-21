import React, {useState, useEffect} from 'react';
import serverFetch from '../services/serverFetch';
import serverPost from '../services/serverPost'
import getTypeFromColumnType from '../services/getTypeFromColumnType'
import Button from '@mui/material/Button';


const getField = column => {
    const name = column.Field
    const label = capitalizeFirsLettert(column.Field)    
    const type = getTypeFromColumnType(column)
    return {type, name, label, tooltip:'No helptext', names:undefined,  required:false}
}    

const capitalizeFirsLettert = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default props =>
{    
    const [value, setValue] = useState({})
    const [columns, setColumns] = useState([])
    const {searchView, tableName, constants, fields, setStatus, setList, handleToggle} = props

    const searchRecords = searchValues =>
    {
        let args =""
        Object.entries(searchValues).map(it=> {
            if (it[1]) {
                args += '&'
                args += it[0] +  '=' + it[1]
            }
        })
        const link = '/fetchRows?tableName=' + searchView + args
        if (setStatus) {setStatus('Searching ...')}
        setList([])
        serverFetch(link, '', '', list=>{
            if (list.length > 0) {
                if (setStatus) {setStatus('')}
                setList(list.sort((a,b) => b.id - a.id))
            } else {
                if (setStatus) {setStatus('Not found')}
            }   
        })
    }        
    
    useEffect(()=>{
        const link = '/getColumns?tableName=' + tableName
        serverFetch(link, '', '', cols=>{
            if (cols.length > 0) {
                const dbColumns = cols.filter(it => it.Type !== 'timestamp' && it.Key !== 'PRI')
                setColumns(dbColumns)
            } else {
                setColumns([])
            }
        })   
        setValue(props.value?props.value:{})
        if (!!constants) {
            searchRecords(constants)
        }    
    },[searchView, fields])

    const handleSearch = e => {
        e.preventDefault()
        const values = {...value, ...constants}
        searchRecords(values)
    }    

    const renderField = fld =>
    <>
        <input type={fld.type?fld.type:'text'} name={fld.name} value={value[fld.name]?value[fld.name]:undefined} placeholder={fld.label?fld.label:fld.name} onChange={handleChange} />
        &nbsp;
    </>

    const handleChange = e => setValue({...value, [e.target.name]:e.target.value})
    const dynamicFields = fields.filter(it=>constants?constants[it.name]?false:true:true)

    return (
        <>
        {Array.isArray(constants)?
            <h1>Variable constants should be an object</h1>
        :!Array.isArray(fields)?
            <h1>Variable fields should be an array</h1>
        :columns.length > 0?
            <form onSubmit={handleSearch}>
                {
                    dynamicFields?
                        dynamicFields.map(fld=>renderField(fld)) 
                    :    
                        columns.map(col=>renderField(getField(col))
                )
                }
                <Button type='submit' color="inherit" variant="outlined" >Sök</Button>
                {handleToggle?<Button type='button' color="inherit" variant="outlined" onClick={()=>handleToggle(value)}>Skapa ny</Button>:null}
            </form>
        :<h3>No search columns</h3>}
        </>   
    )
}



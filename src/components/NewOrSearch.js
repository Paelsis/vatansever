import React from 'react';
import FormTemplate from './FormTemplate';
import serverFetch from '../services/serverFetch';
import serverPost from '../services/serverPost'

// NewRecord  
export default props => {
   const {tableName, searchView, searchFields, setList, constants} = props


   const _dbRecord = (constants, record) => {
        let dbRecord = record
        Object.entries(record).forEach(it => {
            if (it[1]===true) {
                dbRecord = {...dbRecord, [it[0]]:1}
            } else if  (it[1]===false) {
                dbRecord = {...dbRecord, [it[0]]:0}
            } 
        })
       return constants?{...dbRecord, ...constants}:dbRecord
    }

    const replaceOrInsertList = (value, list) => {
        let found = false
        const newList = list.map(it => {   
            if (parseInt(it.id) == parseInt(value.id)) {
                found = true
                return value 
            } else {
                return it
            }
        })
        // If not found in list, add recird
        if (found)  {
            return(newList)
        } else {
            return([...list, value])
        }    
    }    

    const handleSaveCallback = reply => {
        // alert('handleSaveCallback XXXX:' + JSON.stringify(reply))
        if (reply.status==="OK") {
            if (props.handleRedirect) {
                props.statusMessage('green', 'Successful insert of record')
                props.handleRedirect(reply.record)
            } else if (props.handleUpArrow) {
                props.setList([])
            } if (props.statusMessage) {
                props.setValue({...props.value, id:reply.id})
                props.statusMessage('green', 'Sparad i databasen')
            }    
        } else {
            alert('NewOrSearch: Error when inserting record. Status:' + reply.status + ' message:' + reply.message) 
        }    
    }    

    const handleSave = value => {
        // props.statusMessage('green', 'Sätt in i databasen värdet:' + JSON.stringify(value)) 
        const insertValue = {tableName, record:_dbRecord(constants, value)}
        serverPost('/replaceRow', '', '', insertValue, handleSaveCallback)
    }

    const fetchRows = searchValues =>
    {
        let args =""
        Object.entries(searchValues).forEach(it=> {
            if (it[1]) {
                args += '&'
                args += it[0] +  '=' + it[1]
            }
        })
        const link = '/fetchRows?tableName=' + searchView + args
        if (props.statusMessage) {props.statusMessage('green', 'Searching ...')}
        setList([])
        serverFetch(link, '', '', list=>{
            if (list.length > 0) {
                if (props.statusMessage) {props.statusMessage('green', '')}
                setList(list.sort((a,b) => b.id - a.id))
            } else {
                if (props.statusMessage) {
                    props.statusMessage('green', 'Not found')
                }
            }   
        })
    }        
    

    const handleSearch = value => {
        const searchValues = {...value, ...constants}
        fetchRows(searchValues)
    }    

    return (
        <FormTemplate {...props} handleSearch={searchFields?handleSearch:undefined} handleSave={handleSave} />
    )    
}


import React, {useState, useEffect} from 'react';
import FormTemplate from './FormTemplate';
import SearchLineTemplate from './SearchLineTemplate';
import serverFetch from '../services/serverFetch';
import serverPost from '../services/serverPost'

// NewRecord  
export default props => {
   const {tableName, searchView, searchFields, list, setList, constants, statusMessage, handleRedirect} = props

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

    const handleSaveReply = reply => {
        if (reply.status==='OK') {
            if (list !== undefined && setList !== undefined) {
                statusMessage('green', 'Sparad i databasen')
                // setList(replaceOrInsertList(reply.record, list))
                if (handleRedirect) {
                    handleRedirect(reply.record)
                }    
            } else {
                
                statusMessage('orange', 'WARNING: Values could not be inserted, reply:' + reply)
            }  
        } else {
            statusMessage('red', 'Error when insering record. Reply message:' + JSON.stringify(reply.message))
        }    
    }    

    const handleSave = value => {
        // The variable safe=true will be added to the call to tell that we shall perform safe insert, i.e. only insert existing columns 
        // statusMessage('orange', 'Before insert of database record:' + JSON.stringify(value)) 
        serverPost('/replaceRow', '', '', {tableName, record:_dbRecord(constants, value)}, handleSaveReply)
    }

    const fetchRows = searchValues =>
    {
        let args =""
        Object.entries(searchValues).map(it=> {
            if (it[1]) {
                args += '&'
                args += it[0] +  '=' + it[1]
            }
        })
        const link = '/fetchRows?tableName=' + searchView + args
        if (statusMessage) {statusMessage('green', 'Searching ...')}
        setList([])
        serverFetch(link, '', '', list=>{
            if (list.length > 0) {
                if (statusMessage) {statusMessage('green', '')}
                setList(list.sort((a,b) => b.id - a.id))
            } else {
                if (statusMessage) {statusMessage('green', 'Not found')}
            }   
        })
    }        

    const handleSearch = value => {
        const searchValues = {...value, ...constants}
        fetchRows(searchValues)
    }    

    return (
        <div >
            <SearchLineTemplate {...props} handleSave={handleSave} handleSearch={searchFields?handleSearch:undefined} />
            <FormTemplate {...props} handleSave={handleSave} />
        </div>       
    )
}


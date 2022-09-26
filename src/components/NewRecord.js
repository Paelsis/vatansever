import React, {useState, useEffect} from 'react';
import FormTemplate from './FormTemplate';
import serverPost from '../services/serverPost'
import missingColumns from '../services/missingColumns'
//const init={name:'Per Eskilson', email:'paelsis@hotmail.com', phone:'0733780740'}

const ShowValue = ({value}) =>
<table>
    <tbody>
    {Object.values(value).map(it =>
        <tr>
            <td>{it}</td>
        </tr>
    )}
    </tbody>
</table>

// NewRecord  
export default props => {
   const {tableName, list, setList, constants, statusMessage, handleRedirect} = props

   const _dbRecord = (constants, record) => {
        let dbRecord = record
        Object.entries(record).forEach(it => {
            if (it[1]===true) {
                dbRecord = {...dbRecord, [it[0]]:1}
            } else if  (it[1]===false) {
                dbRecord = {...dbRecord, [it[0]]:0}
            } 
        })
        return {...dbRecord, ...constants}
    }
   
    const handleReply = reply => {
        if (reply.status==='OK') {
            if (list !== undefined && setList !== undefined) {
                let found = false
                const updatedList = list.map(it => {   
                    if (parseInt(it.id) == parseInt(reply.record.id)) {
                        found = true;
                        return reply.record 
                    } else {
                        return it
                    }
                }) 
                // If not found in list, add recird
                if (found === true)  {
                    setList(updatedList)
                } else {
                    setList([...list, reply.record])
                }    

                if (props.handleSave) {
                    handleSave(reply.record)
                } if (handleRedirect) {
                    handleRedirect(reply.record)
                } else if (statusMessage) {
                    statusMessage('green', 'Sparad i databasen med id ' + reply.id)
                }
            } else {
                statusMessage('green', 'Values could not be inserted, reply:' + reply)
            }  
        } else {
            statusMessage('green', 'Error when insering record. Reply message:' + JSON.stringify(reply))
        }    
    }    

    const handleSubmit = (e, record) => {
        e.preventDefault(); 
        statusMessage('green', 'Insert into database record:' + JSON.stringify(record)) 
        serverPost('/replaceRow', '', '', {tableName:tableName, record:_dbRecord(constants, record)}, handleReply)
    }

    const handleReplyDelete = reply => {
        if (reply.status==='OK') {
            const id=reply.id
            setList(list.filter(it=>it.id !==id))
            if (statusMessage) {
                statusMessage('green', 'Record with id=' + id + ' removed')
            }    
        } else {
            if (statusMessage) {
                statusMessage('green', 'Fel vid borttagande av kund. Meddelande:' + JSON.stringify(reply))
            }    
        }    
    }    
    const handleDelete = id => {
        if (statusMessage) {
            statusMessage('green', 'Remove from database ...'); 
        }    
        serverPost('/deleteRow', '', '', {tableName:tableName, 'id':id}, handleReplyDelete)
    }


    return (
        <div >
            <FormTemplate {...props} handleSubmit={handleSubmit} />
        </div>       
    )
}


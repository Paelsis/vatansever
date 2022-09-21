import React, {useState, useEffect} from 'react';
import FormTemplate from './FormTemplate';
import serverPost from '../services/serverPost'
import serverFetch from '../services/serverFetch';
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
   const [style, setStyle] = useState({})
   const [columns, setColumns] = useState([])
   const {tableName, list, setList, constants, value, fields, handleToggle, setStatus, handleRedirect} = props

   useEffect(()=>{
        const link = '/getColumns?tableName=' + props.tableName
        serverFetch(link, '', '', cols=>{
            if (cols.length > 0) {
                const dbColumns = cols.filter(it => it.Type !== 'timestamp' && it.Key !== 'PRI')
                setColumns(dbColumns)
                    //.filter(it=>(it.Type?it.Type !== 'timestamp':true && it.Key?it.Key !== 'PRI':true)))
            } else {
                setColumns([])
            }
        })   
    }, [])



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

                setStyle({color:'blue', borderColor:'blue'})
                setStatus('Saved in database with id ' + reply.id)
                if (handleRedirect) {
                    handleRedirect(reply.record)
                }    
            } else {
                setStyle({color:'blue', borderColor:'blue'})
                setStatus('Values could not be inserted, reply:' + reply)
            }  
        } else {
            setStatus('Error when insering. Reply message:' + JSON.stringify(reply))
            setStyle({color:'red', borderColor:'red'})
        }    
    }    

    const handleSubmit = (e, record) => {
        e.preventDefault(); 
        setStyle({color:'orange', borderColor:'orange'})
        setStatus('Insert into database record:' + JSON.stringify(record)) 
        serverPost('/replaceRow', '', '', {tableName:tableName, record:_dbRecord(constants, record)}, handleReply)
    }

    const handleReplyDelete = reply => {
        if (reply.status==='OK') {
            const id=reply.id
            setList(list.filter(it=>it.id !==id))
            setStyle({color:'blue', borderColor:'blue'})
            setStatus('Record with id=' + id + ' removed')
        } else {
            setStatus('Fel vid borttagande av kund. Meddelande:' + JSON.stringify(reply))
            setStyle({color:'red', borderColor:'red'})
        }    
    }    
    const handleDelete = id => {
        setStyle({color:'orange', borderColor:'orange'})
        setStatus('Remove from database ...'); 
        serverPost('/deleteRow', '', '', {tableName:tableName, 'id':id}, handleReplyDelete)
    }


    return (
        <div >
            <FormTemplate fields={fields} columns={columns} value={value} handleSubmit={handleSubmit} handleToggle={handleToggle} setStatus={setStatus} update={true}/>
        </div>       
    )
}


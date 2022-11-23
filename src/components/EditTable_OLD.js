import React, {useState, useEffect} from 'react';
import serverPost from '../services/serverPost'
import SaveIcon from '@mui/icons-material/Save';
import EditIconOutlined from '@mui/icons-material/EditOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';


const styles={
    container: {
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth:'100%', 
    },
    button:{
        color:'black',
        border:'1px solid red'
    }    
}

  
export default props => {
    const [edit, setEdit] = useState([])
    const {tableName, list, setList, fields, constants, handleStatus} = props;

        
    const handleReplySave = reply => {
        if (reply.status==='OK') {
            setEdit({})
            handleStatus({color:'white', backgroundColor:'green'}, 'Data sparade med id=' + reply.id)
        } else {
            handleStatus({color:'white', backgroundColor:'green'}, 'Fel vid sparande av data. Meddelande:' + JSON.stringify(reply))
        }    
    }    
    const handleSave = record => {
        let recordSave = {}
        if (fields) {
            fields.forEach(it => {
                if (record[it.name]!==undefined) {
                    recordSave = {...recordSave, [it.name]:record[it.name]}
                }
            })
            recordSave = {id:record.id?record.id:0, ...recordSave, ...constants}
            alert('Saving' + JSON.stringify(recordSave))
        } else {
            recordSave = record;
        }   

        serverPost('/replaceRow', '', '', {tableName:tableName, record:recordSave}, handleReplySave)
    }

    const handleReplyDelete = reply => {
        if (reply.status==='OK') {
            const id=reply.id
            setList(list.filter(it=>it.id !==id))
            handleStatus({color:'white', backgroundColor:'green'}, 'Rad med id=' + id + ' borttagen')
        } else {
            handleStatus({color:'white', backgroundColor:'green'}, 'Fel vid borttagande av kund. Meddelande:' + JSON.stringify(reply))
        }    
    }    
    const handleDelete = id => {
        let name = list.find(it=>it.id === id).name
        let text = 'Tag bort bort id=' + id + ' från tabell ' + (tableName?tableName:'No table') + '\nVälj OK eller Cancel.'
        // eslint-disable-next-line no-restricted-globals
        if (confirm(text)) {
            handleStatus({color:'white', backgroundColor:'green'}, 'Remove from database ...'); 
            serverPost('/deleteRow', '', '', {tableName:'tbl_customer', 'id':id}, handleReplyDelete)
        }
    }

    const handleChange = (e, id) => setList(list.map(it=>{
        if (it.id===id) {
            return {...it,  [e.target.name]:e.target.value}
        } else {
            return it
        }    
    }
    ))
    const toggleEdit = id =>  {
        if (edit[id]===true) {
            setEdit({...edit, [id]:false})    
            if (handleSave) {
                const record = list.find(it=>it.id === id)
                handleSave(record)            
            }
        } else {
            setEdit({...edit, [id]:true})    
        }   
    }    

    const renderHeader = row => {
        return(
            Object.entries(row).filter(obj=>(constants?constants[(obj[0])]?false:true:true) && (obj[0]!='id')).map(obj=><th>{obj[0].slice(0,8)}</th>)
        )    
    }    

    const renderRow = row => {
        
    return(
            <tr>
                {Object.entries(row).filter(obj=>(constants?constants[obj[0]]?false:true:true && obj[0] !=='id' && obj[0] !== 'creaTimestamp' && obj[0] !== 'updTimestamp')).map(obj =>
                    <td>
                        {(edit[row.id]===true)?
                            <input type='text' name={obj[0]} value={obj[1]} onChange={e=>handleChange(e, row.id)} />
                        :
                        obj[1]}
                    </td>)
                }
                {!props.handleUpArrow?
                    <td>
                        {edit[row.id]===true?<SaveIcon onClick={()=>toggleEdit(row.id)} />:<EditIcon onClick={()=>toggleEdit(row.id)} />}
                    </td>
                :
                    null        
                }
                {handleDelete?
                    <td>
                        <DeleteIcon onClick={()=>handleDelete(row.id)} />
                    </td>
                :
                    null        
                }
                {props.handleUpArrow?
                    <td>
                        <ArrowUpwardIcon onClick={()=>props.handleUpArrow(row)} />
                    </td>
                :
                    null        
                }
                {props.handleClickLine?
                    <td>
                        <OpenInNewIcon onClick={()=>props.handleClickLine(row)} />
                    </td>
                :
                    null        
                }
            </tr>
        )
    }

    const getLabel = name => {
        if (fields) {
            const found = fields.find(fld => fld.name===name)
            const label = found?found.name:name
            return label
        } else {
            return name
        }    
    }

    return (
        list?list.length > 0?
            <div>
                <>
                    <table style={{border:'1px solid lightGrey', margin:10, maxWidth:'50vh'}}>
                        <thead style={{bottomBorder:'1px solid lightGrey', margin:10}}>
                            {renderHeader(list[0])}
                        </thead>
                        <tbody style={{border:'1px solid lightGrey', margin:10}}>
                            {list.map(li=>renderRow(li))}    
                        </tbody>
                    </table>
                </>
        </div>
        :
            null:null
    )
}



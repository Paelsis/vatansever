import React from 'react';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileOpenIcon from '@mui/icons-material/FileOpen';

export default ({searchFields, list, setList, edit, setEdit, handleDelete, handleSave, handleOpen}) => {

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

    const renderRow1 = li => <tr><td>{JSON.stringify(li)}</td></tr>    
    return(        
        <>
        {list.length >0?

            <table style={{border:'1px solid lightGrey', margin:10}}>
                <thead>
                        {Object.entries(list[0]).map(it=><th>{it[0]}</th>)}
                </thead>
                <tbody>
                    {list.map(li=>
                            {renderRow1(li)}
                    )}    
                </tbody>

            </table>
        :null}
        </>
    )
}

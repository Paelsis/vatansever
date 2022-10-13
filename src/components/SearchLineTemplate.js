import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import SearchLineField from './SearchLineField';
import getTypeFromColumnType from '../services/getTypeFromColumnType'


export default props => {
    const [value_local, setValue_local] = useState({})
    const {searchFields, handleSave, handleSearch, setList} = props
    //const value = props.value?props.value:value_local
    //const setValue = props.setValue?props.setValue:setValue_local
    const value = value_local
    const setValue = setValue_local  
    
    const handleSubmit = (e, value) => {
        e.preventDefault()        
        handleSave(value)
    }

    const handleRensa = () => {
        setList([])
        setValue({})
    }    

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleSearch(value)
        }
    }
    
    return(
        <>
        {searchFields?
            <form onSubmit={e=>handleSubmit(e, value)}>
                    {searchFields.map(fld => 
                        <SearchLineField fld={fld} value={value} setValue={setValue} handleKeyPress={handleKeyPress} />
                    )}
                    {handleSearch?<Button color="inherit" type="button" variant="outlined" onClick={()=>handleSearch(value)} >Sök</Button>:null}
                    <Button color="inherit" type="button" variant="outlined" onClick={()=>handleRensa()}>Rensa</Button>
            </form>
        :
            <h3>No search fields</h3>
        }
        </>
    )
}


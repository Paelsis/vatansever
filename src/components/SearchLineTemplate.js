import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import SearchLineField from './SearchLineField';
import getTypeFromColumnType from '../services/getTypeFromColumnType'
import {search} from '../services/search'
import {defaultDate} from '../services/functions'

export default props => {
    const [searchValue, setSearchValue] = useState({})
    const {searchView, searchFields, setValue, setList, handleStatus} = props

    const handleRensa = () => {
        setList([])
        setSearchValue({})
    }    

    const handleSearchReply = list => {
        if (list.length === 0) {
            handleStatus({backgroundColor:'orange'}, 'Varning: Fick inget resultat vid sökning i database')    
        } else if (list.length === 1) {
            handleStatus({backgroundColor:'green'}, undefined)    
            let rec = list[0]
            let dates = {}
            searchFields.filter(it=>it.type === 'date' && (rec[it.name]===null || rec[it.name]===undefined)).forEach(it=>{
                dates = {...dates, [it.name]:defaultDate()}
            }) 
            rec = {...rec, ...dates}
            setValue(rec)
            setList([])
        } else {
            handleStatus({backgroundColor:'green'}, undefined)    
            setValue({})
            setList(list)
        }    
    }

    const handleSearch = () => {
        handleStatus({backgroundColor:'green'}, "Söker ...")
        search(searchView, searchValue, handleSearchReply) 
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }
    
    return(
        <>
        {searchFields?
            <form>
                    {searchFields.map(fld => 
                        <SearchLineField fld={fld} value={searchValue} setValue={setSearchValue} handleKeyPress={handleKeyPress} />
                    )}
                    <Button type="button" color="inherit" variant="outlined" onClick={handleSearch} >Sök</Button>
                    <Button type="button" color="inherit" variant="outlined" onClick={handleRensa}>Rensa</Button>
            </form>
        :
            <h3>Sökfält saknas</h3>            
        }
        </>
    )
}


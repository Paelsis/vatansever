import React, {useState, useEffect} from 'react';
import FormTemplate from './FormTemplate';
import SearchLineTemplate from './SearchLineTemplate';

// SearchLineAndForm  
export default props => {
   return (
        <div >
            <SearchLineTemplate {...props} />
            {props.list?props.list.length === 0?<FormTemplate {...props} />:null:alert('No list to SearchLineAndForm')}
        </div>       
    )
}


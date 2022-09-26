import React, {useState, useEffect} from 'react';
import Search from './Search';
import ShowTable from './ShowTable';

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
   return (
        columns.length > 0? 
            <div>
                    {list.length>0?<ShowTable list={list}  handleOpen={props.handleOpen} />:null}   
            </div>
        :null
    )
}

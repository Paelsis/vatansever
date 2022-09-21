import React, {useState, useEffect} from 'react';
import Search from './Search';
import ShowTable from './ShowTable';
import serverPost from '../services/serverPost'
import serverFetch from '../services/serverFetch'

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
    const [style, setStyle] = useState(props.style?props.style:{color:'blue', borderColor:'blue'})
    const [list, setList] = useState([])
    const [status, setStatus] = useState(undefined)
    const [columns, setColumns] = useState([])
    
    const {tableName, init} = props

   return (
        columns.length > 0? 
            <div>
                    <h3  style={style}>{status}</h3>
                    <p/>
                    {list.length>0?<ShowTable list={list}  handleOpen={props.handleOpen} />:null}   
            </div>
        :null
    )
}

import React, {useState, useEffect} from 'react';
import FileOpenIcon from '@mui/icons-material/FileOpen';

export default ({list, init, handleOpen, style}) => 
<div style={style}>
  {list.length > 0?  
  <table style={{border:'1px solid lightGrey', margin:10}} >
      <thead>
         {Object.entries(list[0]).map(it=><th>{it[0]}</th>)}
      </thead>          
      <tbody>
          {list.map(row => 
                <tr>
                    {Object.entries(row).map(it=>
                        init?init.includes(it[0])?null
                        :
                            <td>
                                <div dangerouslySetInnerHTML={{__html: it[1]}} />
                            </td>
                        :
                            <td>
                                <div dangerouslySetInnerHTML={{__html: it[1]}} />
                            </td>
                    )}        
                    {handleOpen?<td><FileOpenIcon onClick={()=>handleOpen(row.id)} /></td>:null}
                  </tr>            
              )
          }      
      </tbody>    
  </table>
  :null}
</div>


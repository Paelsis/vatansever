import React from 'react';

// Print first children components and then unique fields
export default props => {
  const {fields, value, children} = props
  const uniqueFields = () => {
      let unique = [fields[0]]    
      for (let i=1; i < fields.length; i++) {
          let found = false;
          for (let j=0; j <= i-1; j++) {
              if (fields[i].label===fields[j].label) {
                  found = true
              }    
          }
          if (!found) {
              unique = [...unique, fields[i]]
          }    
      }
      return unique
  }    
  return(    
      <div>
          {children}
          <p/>
          <tab>
          {uniqueFields().map(fld=>
              value[fld.name]?
                  <tr>
                      <td style={{overflowWrap:'break-word', width:80}} >{fld.label}</td><td>{<div dangerouslySetInnerHTML={{__html:value[fld.name]}}/>}</td>            
                  </tr>
              :
                  null
          )}    
          </tab>
      </div>
  )
}

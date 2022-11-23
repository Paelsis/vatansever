import React from 'react';
import FormTemplate from './FormTemplate';
import serverFetch from '../services/serverFetch';
import serverPost from '../services/serverPost'

// SearchForm  
export default props => {
   const _dbRecord = (constants, record) => {
        let dbRecord = record
        Object.entries(record).forEach(it => {
            if (it[1]===true) {
                dbRecord = {...dbRecord, [it[0]]:1}
            } else if  (it[1]===false) {
                dbRecord = {...dbRecord, [it[0]]:0}
            } 
        })
       return constants?{...dbRecord, ...constants}:dbRecord
    }

    return (
        <>
            <FormTemplate {...props} />
        </>
    )    
}


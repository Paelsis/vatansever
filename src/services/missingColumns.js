
import serverFetch from './serverFetch';

// missingColumns
export default (tableName, obj) => {
    const link = '/getColumns?tableName=' + tableName
    const columnsNotFound = []
    serverFetch(link, '', '', dbColumns=>{
        const obj1 = {...obj, kalle:3}
        Object.entries(obj1).forEach(it=> {
            let found = false
            dbColumns.forEach(dbCol=>{
                if (dbCol.Field === it[0]) {
                    found = true
                }    
            })    
            if (!found) {
                columnsNotFound = [...columnsNotFound, it[0]]
            }                
        })
    })    
    if (columnsNotFound.length === 0) {
        return null
    } else {    
        return columnsNotFound
    }
}
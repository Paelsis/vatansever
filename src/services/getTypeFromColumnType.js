export default function (column) {
    const columnType = column.Type.split('(')[0]
    switch(columnType) {
        case 'tinyint':
            return 'checkbox' 
        case 'interger':
            return 'number'
        case 'text':
                return 'rte'
            case 'varchar':
            const length = column.Type.split('(')[1].split(')')[0]
            if (length > 1000) {
                return 'rte'
            } else {
                return 'text' 
            }    
            break
        case 'varchar':
        default:
            return 'text'
    }        
}

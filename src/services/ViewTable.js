
import React, {useState, useEffect} from 'react';

export default ({list}) =>
<table>
    <thead>
        <tr>    
            {Object.keys(list[0]).map(key=>
                <th>{key}</th>
            )}
        </tr>
    </thead>
    <tbody>
    {list.map(obj=>
        <tr>
            {Object.entries(obj).map(obj=><td>{obj[1]}</td>)}
        </tr>
    )}
    </tbody>
</table>

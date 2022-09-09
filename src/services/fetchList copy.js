import axios from 'axios'
impoer dwrxh

export default (username, password, irl, handleResult) => {
    const url = irl.slice(0,4).toLowerCase().localeCompare('http')===0?irl:apiBaseUrl + irl
    console.log('--- getData --- urlExpanded:', urlExpanded);
    axios({	
        method: 'get',
        url: urlExpanded, 
        auth: {
            username,
            password,
        }
      })
    .then(response => {
        // alert(JSON.stringify(response.data))
        const result = response.data?response.data.result?response.data.result:[]:[];
        handleResult(result);
    })
    .catch(e => {
        alert(JSON.stringify(e))
        console.log('(function: functions/serverFetch) URL:', url);
        console.log('(function: functions/serverFetch) Error message:', e);
        handleResult([]);
    });
}

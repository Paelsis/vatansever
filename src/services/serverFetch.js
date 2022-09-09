import axios from 'axios'
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

export default function (irl, username, password, handleResult) {
    const url= irl.slice(0,4).toLowerCase().localeCompare('http')===0?irl:apiBaseUrl + irl
    console.log('fetch url:', url);
    axios({	
        method: 'get',
        url,
        auth: {
            username,
            password,
        }
      })
    .then(response => {
        //alert(JSON.stringify(response.data))
        const result = response.data?response.data.result?response.data.result:[]:[];
        handleResult(result);
    })
    .catch(e => {
        alert(JSON.stringify(e))
        console.log('(function: functions/fetch) URL:', url);
        console.log('(function: functions/fetch) Error message:', e);
        handleResult([]);
    });
}


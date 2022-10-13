import axios from 'axios'

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL

const serverPost = (irl, username, password, data, handleReply) => {
    const url = irl.slice(0,4).toLowerCase().localeCompare('http')===0?irl:apiBaseUrl + irl
    console.log('--- serverPost --- url:', url, ' data:', data);
    axios.post(url, data, {auth: {username, password}})
    .then(response => {
        if (response.status === 200) {
            if (response.data.status) {
                if (response.data.status ==='OK') {
                    // statusMessage(STATUS_OK, 'OK: database modified successfully (response.data.status=' + response.data.status + 'JSON:'+ JSON.stringify(response.data) + ')');
                    console.log('response', JSON.stringify(response.data))
                } else {
                    console.log('response', JSON.stringify(response.data))
                }    
            } else {
                console.log('response', JSON.stringify(response.data))
            }
        } else {    
            console.log('WARNING: serverPost responed back status code:', JSON.stringify(response.data));
        }    
        handleReply(response.data);
    })
    .catch((e) => {
        console.log('ERROR: Failed in function serverPost for url ', url);
        console.log('Error message:', e); // Error
        handleReply({status:'ERROR', data:data,  message:e});
    });
}

export default serverPost;


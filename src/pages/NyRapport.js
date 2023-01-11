import React, {useState, useRef, useEffect} from 'react';
import {useNavigate, useParams } from 'react-router-dom';
import StatusMessage from '../components/StatusMessage'
import serverPost from '../services/serverPost'
import {search} from '../services/search'
import FormTemplate from '../components/SearchForm'
import EditTable from '../components/EditTable'
import {PrintKvitto, PrintLapp, OrderHeader} from '../components/PrintComponentVatansever'
import moment from 'moment'
import logo from '../images/logo.png'
import {useReactToPrint} from 'react-to-print'

const styles = {
    container: {
        display: 'flex',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth:'100%', 
    },
}

const MODE = {
    SEARCH:1,
    NEW:2
}

const fields = [
    {
        type:'radio',
        radioValues:['Okhan', 'Johannes', 'Mats'],
        label:'Mottagare',
        name:'mottagare',
        tooltip:'Mottagare av objektet framme vid disken',
        required:true,
        hiddenIf:'annanPerson'
    },
    {
        type:'text',
        label:'Mottagare',
        name:'mottagare',
        tooltip:'Om mottagaren är annan person än Okhan, Johannes eller MatsFabrikat på inlämnad apparat',
        required:true,
        notHiddenIf:'annanPerson'
    },
    {
        type:'checkbox',
        label:'Annan',
        name:'annanPerson',
        tooltip:'Om mottagaren är annan person än dem som det finns radioknapp till ovan',
    },
    {
        type:'text',
        label:'Fabrikat',
        name:'fabrikat',
        tooltip:'Fabrikat på inlämnad apparat',
    },
    {
        type:'text',
        label:'Modell',
        name:'modell',
        tooltip:'Modell på inlämnad apparat',
    },
    {
        type:'checkbox',
        label:'Akut prioritet',
        name:'akutPrioritet',
        tooltip:'Om objektet måste repreras supersnabbt till dyrare kostad',
    },
    {
        type:'checkbox',
        label:'Felsökning',
        name:'felsokning',
        tooltip:'Om man skall först göra felsökning och ge besked till kund',
    },
    {
        type:'checkbox',
        label:'Garanti',
        name:'garanti',
        tooltip:'Om reparationen går på garanti',
    },
    {
        type:'textarea',
        label:'Felbeskrivning',
        name:'felbeskrivning',
        required:true,
        tooltip:'Beskrivning av felet',
    },
  
]

const extraFields = [
    {
        type:'text',
        label:'Namn',
        name:'namn',
        tooltip:'Kundens namn',
    },
    {
        type:'text',
        label:'Telefon',
        name:'mobil',
        tooltip:'Telefonnummer',
    },
    {
        type:'email',
        label:'Telefon',
        name:'email',
        tooltip:'email',
    },
]

const searchFields = [
    {label:'Service rapport', name:'id'},
    {name:'felbeskrivning'},
    {name:'mottagare'},
    {name:'namn'},
    {name:'mobil'},	
]    	

const tableName = 'tbl_service'
const searchView = 'view_service'

moment.locale('sv', {week:{dow : 1}})


export default () => {
    const params = useParams()
    const navigate = useNavigate()
    const orderId = params?params.orderId?params.orderId:undefined:undefined
    const kundId = params?params.kundId?params.kundId:undefined:undefined
    const namn = params?params.namn?params.namn:undefined:undefined
    const mobil = params?params.mobil?params.mobil:undefined:undefined
    const [list, setList] = useState([])
    const [value, setValue] = useState({})
    const [statusMessage, setStatusMessage] = useState({color:'green', message:''})
    const componentRefKvitto = useRef();
    const componentRefLapp = useRef();


    const handleStatus = (style, message) => {
        setStatusMessage({style, message})
        let timer = setTimeout(() => setStatusMessage({}), 5000);
    }        

    const handleSaveCallback = reply => {
        const {status, record} = reply

        if (status === 'OK') {
            handleStatus({backgroundColor:'green'}, undefined)
            navigate('/home')
        } else {
            const message = 'FELMEDDELANDE: Servicerapporten kunde inte uppdateras'
            handleStatus({backgroundColor:'red'}, message)
        }    
    }        

    const handleSave = val => {
        handleStatus({backgroundColor:'green'}, 'Uppdaterar servicerapporten i databasen')
        serverPost('/updateRow', '', '', {tableName, record:val, id:orderId?orderId:val.id?val.id:undefined}, handleSaveCallback)
    }

    const handleClickLine = rec => {
        setValue(rec)
    }
    
    const handleSearchReply = list => {
        if (list.length === 0) {
            handleStatus({backgroundColor:'orange'}, 'Varning: Fick inget resultat vid sökning i database')    
        } if (list.length === 1) {
            handleStatus({backgroundColor:'green'}, undefined)    
            setValue(list[0])
        } else {
            handleStatus({backgroundColor:'green'}, undefined)    
            setList(list)
        }    
    }

    const handleSearch = () => {
        // alert('value:' + JSON.stringify(value))
        handleStatus({backgroundColor:'green'}, 'Söker ...') 
        search(searchView, value, handleSearchReply) 
    }

    const handleReset = () => {
        setValue({})
        setList([])
    }

    const handlePrintKvitto = useReactToPrint({
      content: () => componentRefKvitto.current,
    });

    const handlePrintLapp = useReactToPrint({
        content: () => componentRefLapp.current,
      });
    
  
    const buttons=[
        {
            style:{color:'black', borderColor:'black'},
            label:'Lapp',
            required:true,
            handleClick:handlePrintLapp
        },    
        {
            style:{color:'black', borderColor:'black'},
            label:'Kvitto',
            required:true,
            handleClick:handlePrintKvitto
        },    
        /*
        {
            style:{color:'black', borderColor:'black'},
            label:'Sök',
            handleClick:handleSearch
        },
        */    
        {
            style:{color:'black', borderColor:'black'},
            label:'Rensa',
            handleClick:handleReset
        },    
    ]

    const headerFields = ['id', 'namn', 'mobil']

    const newFields = namn?fields:[...extraFields, ...fields]

    const now = moment().format('Do MMM YY')

    return(    
        <div style={styles.container}>
            <h3>Inlämning</h3>
            <PrintKvitto  ref={componentRefKvitto} orderId={orderId} namn={namn} mobil={mobil} value={value} />
            <PrintLapp  ref={componentRefLapp} orderId={orderId} namn={namn} mobil={mobil} value={value} />
            <p/>
                <FormTemplate
                    tableName={tableName} 
                    fields={newFields} 
                    value={value} 
                    setValue={setValue}
                    handleStatus={handleStatus}  
                    handlePressEnter={handleSearch}
                    buttons={buttons}
                >
                    <OrderHeader orderId={orderId} namn={namn} mobil={mobil} value={value} />
                </FormTemplate> 
                <EditTable 
                    tableName={tableName}
                    searchView={searchView} 
                    searchFields={searchFields}
                    list={list} 
                    setList={setList} 
                    handleStatus={handleStatus}  
                    handleClickLine={handleClickLine}
                />

            <p/>
            <StatusMessage style={statusMessage.style} message={statusMessage.message} />
        </div>    
    )
}

/*
<img style={{width:300}} src={logo} />
<p/>
{orderId || value.id?<span style={{margin:'auto', fontSize:48}}>{(value.id?value.id:orderId)}</span>:null}
<span style={{marginLeft:50, fontSize:24}}>{now}</span>
<br/>
{namn?<span style={{fontSize:20}}>{value.namn?value.namn:namn}</span>:null} 
&nbsp;&nbsp;
{mobil?<span style={{fontSize:20}}>Tel:{value.mobil?value.mobil:mobil}</span>:null} 
*/
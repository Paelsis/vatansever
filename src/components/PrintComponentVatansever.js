import React, {useState, useEffect} from 'react';
import logo from '../images/logo.png'
import moment from 'moment'
import {search} from '../services/search'

moment.locale('sv', {week:{dow : 1}})

export const OrderHeader = ({orderId, namn, mobil, email, value})=> {
    const now = moment().format('Do MMM YYYY')
    return(
        <>
            {(orderId || value.id)?<span style={{margin:'auto'}}>Inlämningsnummer:{value.id?value.id:orderId}</span>:null}
            <br/>
            <span>Inlämningsdatum:{now}</span>
            {namn?<><br/>Namn:{namn}</>:null} 
            {mobil?<><br/>Telefonnr:{mobil}</>:null} 
            {value.fakturakund?<><br/>Fakturakund</>:null}
            {email?<><br/>email:{email}</>:null} 
        </>
    )
}

const OrderHeaderLapp = ({orderId, namn, mobil, email, value})=> {
    const now = moment().format('Do MMM YYYY')
    return(
        <>
            {(orderId || value.id)?<span style={{margin:'auto', fontSize:value.akutPrioritet?48:36}}>{(value.id?value.id:orderId)}&nbsp;{value.akutPrioritet?'AKUT':null}</span>:null}
            <br/>
            <span style={{fontSize:24}}>{now}</span>
            {namn?<><br/>Namn:{namn}</>:null}
            {mobil?<><br/>Telefonnr:{mobil}</>:null}
            {value.fakturakund?<><br/>Fakturakund</>:null}
            {email?<><br/>email:{email}</>:null} 
        </>
    )
}

const OrderHeaderKvitto = ({orderId, namn, mobil, email, value})=> {
    const now = moment().format('Do MMM YYYY')
    return(
        <>
            Datum:{now}
            {orderId?<><br/>Inlämningsnummer:{orderId}</>:null} 
            <br/>Kunduppgifter:
            {namn?<><br/>Namn:{namn}</>:null} 
            {mobil?<><br/>Telefonnr:{mobil}</>:null} 
            {value.fakturakund?<><br/>Fakturakund</>:null}
            {email?<><br/>Email:{email}</>:null} 
        </>
    )
}

export const PrintKvitto = React.forwardRef((props, ref) => {
    const [record, setRecord] = useState()
    const handleSearchReply = list => {
        alert(JSON.stringify(list))
        if (list.length === 0) {
            alert('Varning: Fick inget resultat vid sökning i database')
        } if (list.length === 1) {
            setRecord(list[0])
        } else {
            alert('Multiple records:' + JSON.stringify(list))
        }    
    }
    useEffect(()=>{
        const tableName = 'tbl_settings'
        search(tableName, {id:1}, handleSearchReply) 
    }, []) 
    const {value} = props
    return(
        <div  style={{display:'none'}}>
            <div ref={ref}>
                <img style={{width:300}} src={logo} />
                {record?record.headerKund?<div dangerouslySetInnerHTML={{__html: record.headerKund}} />:null:null}
                <OrderHeaderKvitto {...props} />
                <br/>Inlämnat object:
                {value.fabrikat?<><br/>Fabrikat: {value.fabrikat}</>:null}
                {value.modell?<><br/>Modell: {value.modell}</>:null}
                {value.felsokning?<><br/>Vi tar kontakt efter felsökning</>:null}
                {value.garanti?<><br/>Garantiärende</>:null}
                {value.akutPrioritet?<><br/>Reparationen utföres akut mot extra avgift</>:null}
                {value.felbeskrivning?<><br/>Felbeskrivning:<br/>{value.felbeskrivning}</>:'Felbeskrivning saknas'} 
                {record?record.footerKund?<div dangerouslySetInnerHTML={{__html: record.footerKund}} />:null:null}
             </div>
        </div>
    )
})

export const PrintLapp = React.forwardRef((props, ref) => {
    const {value} = props
    return(
        <div  style={{display:'none'}}>
            <div ref={ref}>
                <OrderHeaderLapp {...props} />
                {value.fabrikat?<><br/>Fabrikat:{value.fabrikat}</>:null}
                {value.modell?<><br/>Modell: {value.modell}</>:null}
                {value.felsokning?<><br/>Vi tar kontakt efter felsökning</>:null}
                {value.garanti?<><br/>Garantiärende</>:null}
                {value.akutPrioritet?<><br/>Reparationen utföres akut mot extra avgift</>:null}
                {value.felbeskrivning?<><br/>Felbeskrivning:<br/>{value.felbeskrivning}</>:'Felbeskrivning saknas'} 
            </div>
        </div>
    )
})
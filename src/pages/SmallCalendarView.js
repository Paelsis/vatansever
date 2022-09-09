import React, {Component} from 'react';

import { withRouter } from "react-router-dom";
import teal from '@material-ui/core/colors/teal'
import pink from '@material-ui/core/colors/pink'
//import moment from 'moment';
import moment from 'moment-with-locales-es6'



const language = 'SV'


const CULTURE = (language) => language==='SV'?'sv':language==='ES'?'es':'en'
const highlight = pink[100];

const TEXTS = {
    button:{
        SV:'Info',
        ES:'Info',
        EN:'Info',
    },
    GO_BACK:{
        SV:'Stäng',
        ES:'Cerrer',
        EN:'Close',
    },
    REG:{
        SV:'Anmälan',
        ES:'Registrar',
        EN:'Register',
    },
    DANCE:{
        SV:'Dansa',
        ES:'Bailar',
        EN:'Dance',
    },
    CLASSES:{
        SV:'Lektioner',
        ES:'Clases',
        EN:'Classes',
    },
    ENDED:{
        SV:'Slutade',
        ES:'Terminó',
        EN:'Ended',
    },
    WHOLE_DAY:{
        SV:'hela dagen', 
        EN:'all day',
        ES:'toto el dia'
    }
}

let styles = {
    table: {
        width:'100%',
        marginRight:'auto',
        marginLeft:'auto',
        borderSpacing:1,
        color: 'white',
        border:'2px solid',
        borderColor:'transparent',
        backgroundColor:'transparent',
    },
    tbody: {
        cellpadding:30,
    },
    tr: isToday => ({
        height:isToday?30:25,
        verticalAlign:'center',
        fontSize:isToday?'large':'medium',
        fontWeight:isToday?'normal':300,
    }),
    tdDate: (eventStatus) => ({
        opacity:eventStatus==='FULL'?0.8
        :eventStatus==='OPEN'?1.0
        :1.0    
    }),
};

/**
 * This example allows you to set a date range, and to toggle `autoOk`, and `disableYearSelection`.
 */
class SmallCalendarView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fontSize:'small',
            events:[],
            open:false,
            title:'',
            location:'',
            desc:'',
            name:undefined,
        };
        this.onClick = this.onClick.bind(this);
        this.renderEvent = this.renderEvent.bind(this);
        this.renderAllEvents = this.renderAllEvents.bind(this);
    }
 


    // invoked immediately after a component is mounted
    componentDidMount () {
        moment.locale(CULTURE(language));
    }


    onClick() {
        this.setState({fontSize: this.state.fontSize==='small'?'large':'small'})
    }


    renderEvent = event => {
        const {handleEvent} = this.props;
        const mstart = moment(event.start)
        const mend = moment(event.end).add(event.start.length <= 10?-1:0, 'days') 
        let weekday = mstart.format('dddd')
        let weekdayEnd = mend.format('dddd')
        weekday = weekday.toUpperCase().charAt(0) + weekday.slice(1,3)
        weekdayEnd = weekdayEnd.toUpperCase().charAt(0) + weekdayEnd.slice(1,3)
        const dateRange =event.sameDate?
            null
        :
            weekday + ' ' + mstart.format('D/M') + (mstart.format('D/M') !== mend.format('D/M')?(' - ' +  weekdayEnd + ' ' + mend.format('D/M')):'')
        const style = event.style
        const styleDate = {...style, ...styles.tdDate(event.eventStatus)}
        const timeRange = event.start.length > 10?(mstart.format('LT') + '-' + mend.format('LT')):TEXTS.WHOLE_DAY['EN']
        const timeEnd = mend.format('LT')
        const useRegistrationButton = event.useRegistrationButton
        return(
                moment() <= mend?
                    <tr key={'Row' + event.productId} style={styles.tr(event.isToday)} > 
                        <td style={styleDate} onClick={()=>this.props.handleEvent(event)} >  
                            <small>
                                {dateRange}
                            </small>
                        </td>
                        <td style={style} onClick={()=>this.props.handleEvent(event)} >  
                            <small>
                                {timeRange}    
                            </small>
                        </td>
                        <td colspan={useRegistrationButton?1:2}style={style} onClick={()=>handleEvent(event)} >  
                            <small>{event.title}</small>
                        </td>
                    </tr>
               
                :    

                    <tr key={'Row' + event.productId} style={styles.tr(event.isToday)}> 
                        <td style={{...styleDate, opacity:0.3}} >  
                            {dateRange}
                        </td>
                        <td style={{...style, opacity:0.3}}>  
                            <small>{TEXTS.ENDED[language] + ' ' + mend.format('LT')}</small>
                        </td>
                        <td style={{...style, opacity:0.3}}>  
                           <small>{event.title}</small>
                        </td>
                    </tr>
        )
    }    

    renderAllEvents = (events) => (events.map(event =>this.renderEvent(event)))

    render() {
        const {language, events} = this.props
        return (
            <table style={styles.table}>
                <tbody style={styles.tbody}>
                    {this.renderAllEvents(events)}
                </tbody>
            </table>
        )
    }
} 

export default SmallCalendarView

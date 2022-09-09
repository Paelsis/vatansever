import request from 'superagent'
import moment from 'moment-with-locales-es6'
import getStyle from './getStyle'
import serverFetch from './serverFetch'

const CULTURE = (language) => language===LANGUAGE_SV?'sv':language===LANGUAGE_ES?'es':'en'
const LANGUAGE_SV='SV'
const LANGUAGE_ES='ES'

const findParameter = (s, val) => {
  const idx = s.indexOf(val)  
  /* console.log('findParameter', val, 'idx',  idx) */
  if (idx !== -1) {
    const value = s.slice(idx).match(/(\d+)/)[0]
    return value
  } else {
    return undefined
  }  
}  

function createEvent(props)  {
  const {start, end, title, description, location, email, company, hideLocationAndTime} = props
  const mstart=moment(start)
  const mend=moment(end).add(start.length <= 10?-1:0, 'days')
  const maxPar = Number(findParameter(description, 'MAX_PAR'))
  const maxInd = Number(findParameter(description, 'MAX_IND'))
  const dateShift =  moment(start).dayOfYear() - moment(end).dayOfYear() !== 0
  return ({
    ...props,
    start,
    end,
    mstart,
    mend,
    maxInd,
    maxPar,
    isToday:moment().isSame(moment(start), 'day')?true:false,
    isWeekend:moment(start).isoWeekday() >=6,
    hideLocationAndTime,
    calendar:moment(start).calendar(),
    location:location?location:'No given location',
    city: cityForEvent(title, location),
    weekNumber: moment(start).isoWeek(),
    dayOfYearStart: moment(start).dayOfYear(),
    dayOfYearEnd: moment(end).dayOfYear(),
    timeRange: start.length > 10?(mstart.format('LT') + '-' + mend.format('LT')):'Whole day',
    timeRangeWithDay: dateShift?(mstart.format('ddd LT') + '-' + mend.format('ddd LT')):(mstart.format('LT') + '-' + mend.format('LT')),
    style: getStyle(company, title, description),

    /* Registration props */
    maxRegistrants : Number(maxInd?maxInd:maxPar?(maxPar*2):500),
    useRegistrationButton: description?(description.indexOf('MAX_IND')!==-1 || description.indexOf('MAX_PAR')!==-1):false,
  })
}

function cityForEvent (title, location) {
  if ((title.toLowerCase().indexOf('malmö') !== -1) ||
      (title.toLowerCase().indexOf('lund') !== -1)) {
      return undefined 
  } else {        
      return location?(location.toLowerCase().indexOf('malmö') !== -1)?'Malmö'
             :(location.toLowerCase().indexOf('lund') !== -1)?'Lund'
             :(location.toLowerCase().indexOf('michael') !== -1)?'Lund'
             :(location.toLowerCase().indexOf('tangokompaniet') !== -1)?'Malmö'
             :(location.toLowerCase().indexOf('studio') !== -1)?'Malmö'
             :undefined:undefined          
  }    
}    

// export means that this function will be available to any module that imports this module
export function getEvents (calendarId, apiKey, timeMin, timeMax, language, company, callback) {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=${true}&orderBy=startTime`
  request
    .get(url)
    .end((err, resp) => {
      if (!err) {
        // create array to push events into
        const events = []
        let event={}
        // in practice, this block should be wrapped in a try/catch block, 
        // because as with any external API, we can't be sure if the data will be what we expect
        moment.locale(CULTURE(language))
        JSON.parse(resp.text).items.map(it => {
          const start = it.start.dateTime?it.start.dateTime:it.start.date
          const end = it.end.dateTime?it.end.dateTime:it.end.date
          const title = it.summary?it.summary:'No Title'
          const description = it.description?it.description:''
          const location = it.location?it.location.replace(/Tangokompaniet, |, 212 11 |, 224 64|, 223 63|, Sverige|Stiftelsen Michael Hansens Kollegium, /g, ' ').replace('Fredriksbergsgatan','Fredriksbergsg.'):'Plats ej angiven'
          const eventId = it.id

          event = createEvent({start, end, company, title, description, location, eventId, email:'daniel@tangokompaniet.com', hideLocationAndTime:false})

          events.push(event)
        })
        callback(events)
      } 
    })
}

export function getEventsTable (irl, callback, timeMin, timeMax, language) {
  moment.locale(CULTURE(language))
  let event = {}
  const events = []
  serverFetch(irl, '', '', list => {
    list.map(it => {
      const start = it.startDateTime?it.startDateTime:it.startDate
      const end = it.endDateTime?it.endDateTime:it.endDate
      const location = it.location?it.location.replace(/Tangokompaniet, |, 212 11 |, 224 64|, 223 63|, Sverige|Stiftelsen Michael Hansens Kollegium, /g, ' ').replace('Fredriksbergsgatan','Fredriksbergsg.'):'No location given'

      event = createEvent({...it, start, end, location})
      events.push(event)

    })
    // alert(JSON.stringify(events))
    callback(events)
  })
}


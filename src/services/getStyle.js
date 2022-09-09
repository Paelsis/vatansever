import casaBlanca from '../images/VitaHuset.jpg';
  
  const stylesByCompany = [
    {
      searchString:'NYDALA',
      // style:{color:"yellow", backgroundImage: `url(${Dance})`},  
      style:{color:"blue", background: 'linear-gradient(to bottom right, #FF61D2, #FE9090'}
    },
    {
      searchString:'TANGOKOMPANIET',
      // style:{color:"yellow", backgroundImage: `url(${Dance})`},  
      style:{color:"#f2e2e9", background: 'linear-gradient(-45deg, #360946 0%, #81185B 100%'}
    },
    {
      searchString:'HOMERO',
      style:{color:'red', height:'100%', background: 'linear-gradient(-45deg, #ffee62 0%, #ffffdd 100%', fontWeight:700}
    },
    {
      searchString:'MARCELA',
      style:{color:'yellow', background: 'linear-gradient(-45deg, black 0%, brown 50%'},
    },  
    {
      searchString:'JUANJO PASSO',
      style:{color:'blue', background: 'linear-gradient(-45deg, #9895d3 0%, lightBlue 100%'},
    },  
    {
      searchString:'IVAN',
      style:{color:'yellow', background: 'linear-gradient(-45deg, darkRed 0%, red 100%'},
    },  
    {
      searchString:'STREET TANGO',
      style:{color:'yellow', background: 'linear-gradient(-45deg, grey 0%, teal 100%'},
    },
    {
      searchString:'STREET-TANGO',
      style:{color:'yellow', background: 'linear-gradient(-45deg, grey 0%, teal 100%'},
    },
    {
      searchString:'CAMARIN',
      style:{background: 'linear-gradient(-45deg, #BB0000 50%, black 100%)'},
    },
    {
      searchString:'ARRIBA',
      //style:{backgroundColor:'green'},
      style:{color:"#ffe2e6", background: 'linear-gradient(-45deg, #301939 0%, #5491c8 100%'}
    },
    {
      searchString:'URBANA',
      style:{color:'#FFD8B1', background:'linear-gradient(-45deg, #232323 0%, blue 100%'},
    },
    {
      searchString:'CASA BLANCA',
      style:{color:"white", backgroundSize:'25% 100%', fontWeight:800, backgroundImage: `url(${casaBlanca})`},  
      // style:{color:'#232323', background:'linear-gradient(-45deg, #cc5500 0%, orange 50%'},
    },
    {
      searchString:'DEFAULT',
      style:{color:"darkBlue", background: 'linear-gradient(to bottom right, #009245, #FCEE21'}
    }
  ]
    
  const getCompanyStyle = val => val?stylesByCompany.find(it => val.toUpperCase().indexOf(it.searchString.toUpperCase()) > -1):undefined


  export default (company, title, description) => {
    let companyStyle=getCompanyStyle(company) // If company given, try this first
    if (companyStyle) {
      return {...companyStyle.style, padding:2}
    }  

    companyStyle=getCompanyStyle(title)  // Try to figure out company by title text
    if (companyStyle) {
      return {...companyStyle.style, padding:2}
    }  
    
    companyStyle=getCompanyStyle(description) // Try to figure out company by desc text
    if (companyStyle) {
      return {...companyStyle.style, padding:2}
    }  

    companyStyle=stylesByCompany[stylesByCompany.length-1]  // Use default style
    return {...companyStyle.style, padding:2}
  }  


  
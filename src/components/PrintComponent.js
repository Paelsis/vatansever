import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

const PrintComponent = props => {
  const {restProps, componentToPrint} = props
  const ComponentToPrint = componentToPrint
  const componentRef = useRef();
  return (
    <>
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      <div ref={componentRef}>
        <ComponentToPrint {...restProps} />
      </div>  
    </>
  );
};

const TestComponent = () => <h1>Hello 01234567889</h1>
export const PrintTest = () => {

    return(
          <PrintComponent componentToPrint={TestComponent} />
    )      
}

export default PrintComponent

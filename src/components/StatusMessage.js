
import React, { useState, useEffect } from 'react';

export default ({milliseconds, style, message}) => {
    const [show, setShow]=useState(true)    
    const timeout = milliseconds?milliseconds:2000
    useEffect(() => {
        const timer = setTimeout(() => {
          setShow(undefined);
        }, timeout);
        return () => clearTimeout(timer);
    }, [message]); 
    return (
      show?<h3 style={style?style:null}>{message}</h3>:null

    );
};


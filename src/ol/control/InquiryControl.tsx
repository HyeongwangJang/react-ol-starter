import { useContext, useEffect } from 'react';

import Control from 'ol/control/Control';

import OLContext from '../OLContext';

// @ts-ignore
const InquiryControl = () => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if (!map) return;

    const control = new Inquiry({});

    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

export default InquiryControl;

class Inquiry extends Control {
  
}
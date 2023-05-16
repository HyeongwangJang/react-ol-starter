import { FC, useContext, useEffect } from 'react';

import OLContext from 'ol-custom/OLContext';
import Inquiry, { Options } from 'ol-custom/control/Inquiry'

type Props = {
  options?: Options
}

// @ts-ignore
const InquiryControl: FC<Props> = ({ options }) => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if (!map) return;

    (options as Options).map = map

    const control = new Inquiry(options);
    
    map.addControl(control);
    
    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

export default InquiryControl;
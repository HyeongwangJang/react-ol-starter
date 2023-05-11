import { useContext, useEffect } from 'react';

import { FullScreen } from 'ol/control';

import OLContext from '../OLContext';

// @ts-ignore
const FullScreenControl = () => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if (!map) return;

    const control = new FullScreen({});

    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

export default FullScreenControl;

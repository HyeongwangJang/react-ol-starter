import { FC, useContext, useEffect } from 'react';

import ZoomSlider, { Options } from 'ol/control/ZoomSlider';

import OLContext from '../OLContext';

type Props = {
  options?: Options;
};

const ZoomSliderControl: FC<Props> = ({ options = {} }) => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if (!map) return;

    const control = new ZoomSlider(options);

    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

export default ZoomSliderControl;

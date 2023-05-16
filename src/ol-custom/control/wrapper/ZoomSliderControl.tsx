import { FC, useContext, useEffect } from 'react';

import ZoomSlider, { Options } from 'ol/control/ZoomSlider';

import OLContext from 'src/ol-custom/OLContext';

type Props = {
  options?: Options;
};

/**
 * @example https://openlayers.org/en/latest/examples/zoomslider.html
 */
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

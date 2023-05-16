import { FC, useContext, useEffect } from 'react';

import OverviewMap, { Options } from 'ol/control/OverviewMap';

import OLContext from 'ol-custom/OLContext';

type Props = {
  options?: Options;
};

/**
 * @example https://openlayers.org/en/latest/examples/overviewmap.html
 */
const OverviewMapControl: FC<Props> = ({ options = {} }) => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if (!map) return;

    const control = new OverviewMap(options);

    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

export default OverviewMapControl;

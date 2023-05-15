import { FC, useContext, useEffect } from 'react';

import OverviewMap, { Options } from 'ol/control/OverviewMap';

import OLContext from '../OLContext';

type Props = {
  options?: Options;
};

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

import { FC, useContext, useEffect } from 'react';
import Measurement, { Options } from '../Measurement'
import OLContext from '../../OLContext';

type Props = {
  options?: Options
}

// @ts-ignore
const MeasurementControl: FC<Props> = ({ options }) => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if (!map) return;

    (options as Options).map = map

    const control = new Measurement(options);

    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
};

export default MeasurementControl;
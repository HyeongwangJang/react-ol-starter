import { FC, useContext, useEffect } from 'react';

import OLContext from 'src/ol-custom/OLContext';
import Measurement, { Options } from 'src/ol-custom/control/Measurement'

type Props = {
  options?: Options
}

/**
 * @description
 * MeasurementControl 사용시
 * Map에서 useMeasurement를 활성화 해주세요.
 */
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
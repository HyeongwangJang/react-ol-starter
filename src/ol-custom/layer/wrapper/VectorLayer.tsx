import { FC, useContext, useEffect } from 'react';

import OLVectorLayer from 'ol/layer/Vector';
import { Options } from 'ol/layer/BaseVector';
import VectorSourceType from 'ol/source/Vector';

import OLContext from 'ol-custom/OLContext';

type Props = {
  options: Options<VectorSourceType>;
  id: string;
  zIndex: number;
};

const VectorLayer: FC<Props> = ({ options, id, zIndex }) => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if (!map) return;

    const layer = new OLVectorLayer(options);

    layer.set('id', id);
    layer.setZIndex(zIndex);

    map.addLayer(layer);

    return () => {
      if (map) {
        map.removeLayer(layer);
      }
    };
  }, [map]);

  return null;
};

export default VectorLayer;

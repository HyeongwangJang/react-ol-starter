import { FC, useContext, useEffect } from 'react';

import OLTileLayer from 'ol/layer/Tile';
import { Options } from 'ol/layer/BaseTile';
import TileSourceType from 'ol/source/Tile';

import OLContext from 'ol-custom/OLContext';

type Props = {
  options: Options<TileSourceType>;
  id: string;
  zIndex: number;
};

const TileLayer: FC<Props> = ({ options, id, zIndex }) => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if (!map) return;

    const layer = new OLTileLayer(options);

    layer.setZIndex(zIndex);
    layer.set('id', id);

    map.addLayer(layer);

    return () => {
      if (map) {
        map.removeLayer(layer);
      }
    };
  }, [map, options, id, zIndex]);

  return null;
};

export default TileLayer;

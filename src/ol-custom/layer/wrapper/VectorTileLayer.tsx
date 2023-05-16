import { ReactNode, FC, useContext, useEffect, useState } from "react";

import OLVectorTileLayer, { Options } from "ol/layer/VectorTile";

import OLContext from "ol-custom/OLContext";

type Props = {
  children: ReactNode;
  options: Options;
  id: string;
  zIndex: number;
};

const VectorTileLayer: FC<Props> = ({ children, options, id, zIndex }) => {
  const { map } = useContext(OLContext);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!map) return;

    const layer = new OLVectorTileLayer(options);

    layer.setZIndex(zIndex);
    layer.set('id', id);

    map.addLayer(layer);
    setAdded(true);

    return () => {
      if (map) {
        map.removeLayer(layer);
      }
    };
  }, [map, options, id, zIndex]);

  return <>{added && children}</>;
};

export default VectorTileLayer;

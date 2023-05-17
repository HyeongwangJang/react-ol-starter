import { FC, useContext, useEffect } from "react";

import OLVectorTileLayer from "ol/layer/VectorTile";
import OLVectorTileSource, { Options } from 'ol/source/VectorTile'

import OLContext from "src/ol-custom/OLContext";
import { getLayerById } from "src/ol-custom/util";

type Props = {
  options: Options
  layerId: string
}

const VectorTileSource: FC<Props> = (props) => {
  const { map } = useContext(OLContext);

  useEffect(() => {
    if(!map) return
    
    const layer = getLayerById<OLVectorTileLayer>(map, props.layerId);
    const source = new OLVectorTileSource(props.options)
    
    layer.setSource(source)
  }, [map, props])

  return null;
};

export default VectorTileSource;

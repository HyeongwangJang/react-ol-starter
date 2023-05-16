import React from 'react';
import Map from 'ol/Map';

type Context = {
  map: Map | undefined;
};

const OLContext = React.createContext<Context>({} as Context);

export default OLContext;

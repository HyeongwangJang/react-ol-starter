import { ReactNode, useEffect, useState } from 'react';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

import 'ol/ol.css';
import './App.css';

type Props = {
  children: ReactNode
}

function App({ children }: Props) {

  const [ready, setReady] = useState(false)

  useEffect(() => {
    proj4.defs("EPSG:5186", "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs");
    register(proj4);

    setReady(true)
  }, [])
  
  return (
    <div>
      {ready && children}
    </div>
  );
}

export default App;

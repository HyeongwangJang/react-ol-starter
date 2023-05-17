import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import proj4 from 'proj4';
import { get } from 'ol/proj';
import { register } from 'ol/proj/proj4';

import 'ol/ol.css';
import './App.css';

function App() {

  useEffect(() => {
    proj4.defs([
      ['EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps']
    ]);
    register(proj4);
  }, [])
  
  return (
    <div>
      <h1>목차</h1>
      <ul>
        <li>
          <Link to={'/example1'}>Example1: 우리가 누구인가</Link>
        </li>
        <li>
          <Link to={'example2'}>Example2: 우리는 소망한다</Link>
        </li>
      </ul>
    </div>
  );
}

export default App;

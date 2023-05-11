import { Link } from 'react-router-dom';

import './App.css';
import 'ol/ol.css';

function App() {
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

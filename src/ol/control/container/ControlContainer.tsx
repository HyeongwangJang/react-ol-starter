import { FC, ReactNode, useContext, useEffect, useState } from 'react';
import OLContext from '../../OLContext';

type Props = {
  children: ReactNode;
};

const ControlContainer: FC<Props> = ({ children }) => {

  const { map } = useContext(OLContext);

  const [active, setActive] = useState()

  useEffect(() => {
    if (!map) return

  }, [map])
  
  return (
    <div>
      {children}
    </div>
  );
};

export default ControlContainer;

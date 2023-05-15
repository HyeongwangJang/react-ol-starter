import { FC, ReactNode, useContext, useEffect, useState } from 'react';
import OLContext from '../../OLContext';

type Props = {
  children: ReactNode;
};

const ControlContainer: FC<Props> = ({ children }) => {

  const { map } = useContext(OLContext);

  return (
    <div>
      {children}
    </div>
  );
};

export default ControlContainer;

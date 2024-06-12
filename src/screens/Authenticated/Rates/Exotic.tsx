import { RateForScreen } from 'interfaces/screens';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { initialScreenRate } from '../initialStates';
import { getPlaneObjectData } from 'utils/localStorage';

const Exotic = () => {
  const [exoticRates, setExoticRates] = useState<RateForScreen[]>([initialScreenRate]);
  useEffect(() => {
    async function getInfoRates() {
      const response = await getPlaneObjectData('exoticRates');
      setExoticRates(response);
    }
    getInfoRates();
  }, []);
  return <View />;
};

export default Exotic;

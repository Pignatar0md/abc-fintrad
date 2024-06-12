import { RateForScreen } from 'interfaces/screens';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getPlaneObjectData } from 'utils/localStorage';
import { initialScreenRate } from '../initialStates';

const Minor = () => {
  const [minorRates, setMinorRates] = useState<RateForScreen[]>([initialScreenRate]);
  useEffect(() => {
    async function getInfoRates() {
      const response = await getPlaneObjectData('minorRates');
      setMinorRates(response);
    }
    getInfoRates();
  }, []);
  return <View />;
};

export default Minor;

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { initialScreenRate } from '../initialStates';
import { RateForScreen } from 'interfaces/screens';
import { getPlaneObjectData } from 'utils/localStorage';

const All = () => {
  const [allRates, setAllRates] = useState<RateForScreen[]>([initialScreenRate]);
  useEffect(() => {
    async function getInfoRates() {
      const response = await getPlaneObjectData('allRates');
      setAllRates(response);
    }
    getInfoRates();
  }, []);

  return <View />;
};

export default All;

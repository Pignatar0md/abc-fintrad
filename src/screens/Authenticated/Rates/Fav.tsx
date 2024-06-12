import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { getPlaneObjectData } from 'utils/localStorage';
import { initialScreenRate } from '../initialStates';
import { RateForScreen } from 'interfaces/screens';

const Fav = () => {
  const [favRates, setFavRates] = useState<RateForScreen[]>([initialScreenRate]);
  useEffect(() => {
    async function getInfoRates() {
      const response = await getPlaneObjectData('favRates');
      setFavRates(response);
    }
    getInfoRates();
  }, []);

  return <View />;
};

export default Fav;

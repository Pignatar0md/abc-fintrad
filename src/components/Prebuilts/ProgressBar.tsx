import React, { FC, ReactElement, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { colors, fontSizes } from 'styles';

const { green } = colors;

const ProgressBar: FC<{
  time: number;
  active: boolean;
  onTimeOut: () => void;
}> = ({ time, active, onTimeOut }): ReactElement => {
  const [timer, setTimer] = useState(time);
  const [progressBarFillPercentage, setProgressBarFillPercentage] = useState(1);
  const timerRef = React.useRef(timer);
  const barRef = React.useRef(1);
  const { text } = styles;

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | undefined = undefined;
    if (active) {
      timerId = setInterval(() => {
        timerRef.current -= 1;
        barRef.current -= 0.05;
        if (timerRef.current < 0) {
          clearInterval(timerId);
          setTimer(timer);
          setProgressBarFillPercentage(1);
          timerRef.current = timer;
          barRef.current = 1;
          onTimeOut();
        } else {
          setProgressBarFillPercentage(barRef.current);
          setTimer(timerRef.current);
        }
      }, 1000);
    } else {
      setProgressBarFillPercentage(1);
      setTimer(time);
    }

    return () => {
      timerRef.current = 20;
      barRef.current = 1;
      clearInterval(timerId);
    };
  }, [active]);

  return (
    <View style={styles.container}>
      <Progress.Bar
        progress={progressBarFillPercentage}
        height={8}
        width={290}
        borderRadius={5}
        color={active ? green.c750 : green.c200}
        unfilledColor={colors.grey.A100}
        borderColor={active ? green.c750 : green.c200}
      />
      <Text style={active ? [text, { color: green.c750 }] : text}>
        00:{timer < 10 ? `0${timer}` : timer}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 20 },
  text: {
    color: colors.green.c200,
    marginTop: 14,
    fontSize: fontSizes.medium16,
    fontFamily: 'OpenSans-Regular',
  },
});

export default ProgressBar;

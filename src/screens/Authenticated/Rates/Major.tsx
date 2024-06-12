import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

import Line from 'components/Figures/Line';
import Row from 'components/Table/Rates/Row';
import AntDesigns from 'components/Icons/AntDesigns';
import BodyCell from 'components/Texts/Rates/BodyCell';
import MaterialIcon from 'components/Icons/MaterialIcon';
import ModalWindow from 'components/Prebuilts/ModalWindow';
import HeaderCell from 'components/Texts/Rates/HeaderCell';
import ActionButton from 'components/Table/ActionButton';
import NoTransactionsText from 'components/Texts/NoTransactionsText';

import { MajorNavigationProp } from 'types/types';
import { UserDetailsContext } from 'state/UserDetailsContext';
import { RatesContext } from 'state/RatesContext';
import { colors, fontSizes } from 'styles';

import { RateForScreen } from 'interfaces/screens';
import { getPlaneObjectData } from 'utils/localStorage';
import { initialScreenRate } from '../initialStates';
import { getVariationValue } from 'utils/rates';
import { registerToMarketData } from 'api/WebSocketMarketData';
import { sendDebugLog, sendErrorLog } from 'api/LoggerRequests';
import { AxiosResponse } from 'axios';
// import signalr from 'react-native-signalr';

const Major: FC<MajorNavigationProp> = ({ navigation }): ReactElement => {
  const { t } = useTranslation();
  const { userInfo } = useContext(UserDetailsContext);
  const { ratesInfo } = useContext(RatesContext);
  const [showModalValidate, setShowModalValidate] = useState<boolean>(false);
  const [majorRates, setMajorRates] = useState<RateForScreen[]>([initialScreenRate]);

  useEffect(() => {
    async function getInfoRates() {
      const response = await getPlaneObjectData('majorRates');
      setMajorRates(response);
      const wsResponse: AxiosResponse<{ m_Item3: string; m_Item4: string ;m_Item5: string; status: number }> = await registerToMarketData();
      if (wsResponse.status === 200) {
        const token = wsResponse.data.m_Item3;
        const scriptToInject = wsResponse.data.m_Item4;
        const proxyHub = wsResponse.data.m_Item5;
        //onSuccess => "Client:"+clientID+";User:"+userID+"; Success:"+msg
        //onError => "Client:"+clientID+";User:"+userID+"; Error: "+JSON.stringify(error)
        //onUpdatePrice => line 864 RatesController.js
        //onUpdateBid => line 881 RatesController.js
        //onUpdateAsk => line 903 RatesController.js
        //onReconnected => Ux.Logger.Service.Report.Debug("Client:"+clientID+";User:"+userID+"; Reconnected");
        //onDisconnected => "Client:"+clientID+";User:"+userID+"; Disconnected from MarketData:"+reason
      } else {
        await sendErrorLog({
          event: 'getInfoRates - registerToMarketData - Major',
          detail: `Failed connecting to MarketData: ${JSON.stringify(response)}`,
        });
      }
    }
    getInfoRates();
    getWsData();

    if (
      userInfo.userInformation.PINRequired &&
      userInfo.userInformation.AddressVerificationMode === 0
    ) {
      setShowModalValidate(true);
    }
  }, []);
  const getWsData = async () => {
    const wsResponse: AxiosResponse<{ m_Item5: string; m_Item3: string; status: number }> = await registerToMarketData();
    if (wsResponse.status === 200) {
      connectWs(wsResponse.data.m_Item5 as string, wsResponse.data.m_Item3 as string);
    } else {
      await sendErrorLog({
        event: 'getInfoRates - registerToMarketData - Major',
        detail: `Failed connecting to MarketData: ${JSON.stringify(wsResponse)}`,
      });
    }
  };

  const connectWs = async (hub: string, token: string) => {
    // const connection = signalr.hubConnection(hub);
    const storedInfo = await getPlaneObjectData('userData');
    // connection.qs = {
    //   clientID: `${storedInfo.clientID}_${storedInfo.userID}`,
    //   authToken: token,
    // };
    // connection.logging = true;
    // const proxy = connection.createHubProxy('marketDataHub');
    const proxy = {}; //DELETE THIS

    proxy.on('onSuccess', async (msg: string) => {
      await sendDebugLog({
        event: 'connectWsMarketData',
        detail: `Client: ${storedInfo.clientID};User: ${storedInfo.userID}; Success: ${msg}`,
      });
    });

    proxy.on('onError', async (errorMessage: object) => {
      console.log('On_ERROR => ', errorMessage);
      await sendDebugLog({
        event: '',
        detail: `Client: ${storedInfo.clientID};User: ${storedInfo.userID}; Error: ${JSON.stringify(
          errorMessage,
        )}`,
      });
    });
    proxy.on('onUpdatePrice', async (data: any) => {
      //'Price', response.Value
      console.log('UPDATE_PRICE', data);
    });
    proxy.on('onUpdateBid', async (data: any) => {
      console.log('ONupdateBID', data);
      // await applySpread('bid', data.Value, record.get('Decimals'), 0, 1);
      //'BidIncrement', parseFloat(record.get('Bid')) <= parseFloat(valueWithSpread));
      //'Bid', valueWithSpread);
    });
    proxy.on('onUpdateAsk', async (data: any) => {
      // line 903 RatesController.js
      console.log('onUPDATEtask', data);
    });
    proxy.on('onReconnected', async (data: any) => {
      // Ux.Logger.Service.Report.Debug("Client:"+clientID+";User:"+userID+"; Reconnected");
      console.log('REconectado');
    });
    proxy.on('onDisconnected', async (data: any) => {
      console.log('desconectado');
      // "Client:"+clientID+";User:"+userID+"; Disconnected from MarketData:"+reason
    });
    connection
      .start()
      .done(() => {
        console.log(`Now connected, connection ID= ${connection.id}`);
        proxy
          .invoke('registerPairs', [
            'EURJPY',
            'EURUSD',
            'GBPCHF',
            'GBPEUR',
            'GBPJPY',
            'GBPUSD',
            'USDCHF',
            'USDJPY',
          ])
          .done((directResponse: any) => console.log('direct-response-from-server', directResponse))
          .fail((error: any) => {
            console.warn(
              'Something went wrong when calling server, it might not be up and running?',
              error,
            );
          });
      })
      .fail((error: any) => {
        console.log('Failed: ', error);
      });
    connection.connectionSlow((a) => {
      console.log('connection.connectionSlow! => ', a);
    });

    connection.error((error: any) => {
      const errorMessage = error.message;
      let detailedError = '';
      if (error.source && error.source._response) {
        detailedError = error.source._response;
      }
      console.debug('SignalR error: ' + errorMessage, detailedError);
    });
  };

  const getInfoRates = async () => {
    const response = await getPlaneObjectData('majorRates');
    setMajorRates(response);
  };

  let row: number[] = [];
  let prevOpenedRow: any;
  const closeRow = (index: number) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const renderRightView = (item: RateForScreen) => {
    const { backRightBtnRight, backRightBtnCenter } = styles;
    return (
      <View style={styles.buySellButtonsWrapper}>
        <ActionButton
          buttonText={t('buyCapital')}
          onPress={() =>
            navigation.navigate('Trade', {
              op: 'buy',
              balance: Number(item.Bid),
              CCY: item.Pair,
            })
          }
          customStyle={backRightBtnCenter}
        />
        <ActionButton
          buttonText={t('sellCapital')}
          onPress={() => {
            return navigation.navigate('Trade', {
              op: 'sell',
              balance: Number(item.Bid),
              CCY: item.Pair,
            });
          }}
          customStyle={backRightBtnRight}
        />
      </View>
    );
  };

  const renderRow = ({ item, index }: { item: RateForScreen; index: number }) => {
    const symbol = index % 3 === 0 ? '-' : '+';
    const customColor = symbol === '-' ? colors.red.c550 : colors.blue.c650;
    const realIndex = index + 1;
    const calculatedVariation = getVariationValue(item.OpenPrice, item.Price);
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => renderRightView(item)}
        onSwipeableOpen={() => closeRow(index)}
        ref={(ref: any) => (row[index] = ref)}>
        <Row id={realIndex} testId={`major.RowNumber${realIndex}`}>
          <BodyCell size={'small'} color={colors.grey.c750} alignment={'left'}>
            <MaterialIcon
              testId="component.imageButton"
              icon={item.Fav ? 'star-rate' : 'star-outline'}
              color={colors.blueGrey.c400}
              size={fontSizes.medium16}
            />
          </BodyCell>
          <BodyCell size={'large'} color={colors.grey.c750} alignment={'left'}>
            {String(item.Pair)}
          </BodyCell>
          <BodyCell size={'medium'} color={customColor} alignment={'left'}>
            {String(item.Bid)}
          </BodyCell>
          <BodyCell size={'medium'} color={customColor} alignment={'center'}>
            {String(item.Ask)}
          </BodyCell>
          <BodyCell size={'medium'} color={customColor} alignment={'center'}>
            {calculatedVariation}
          </BodyCell>
          <View style={styles.arrowAndHiddenButtonsWrapper}>
            <MaterialIcon
              icon={'keyboard-arrow-right'}
              color={colors.blueGrey.c250}
              size={20}
              testId={'major.iconButton.OpenRateArrow'}
            />
          </View>
        </Row>
      </Swipeable>
    );
  };

  return (
    <View testID="major.mainWrapper" style={styles.container}>
      <ModalWindow
        testId={'major.ModalSecurityCode'}
        isVisible={showModalValidate}
        icon={
          <AntDesigns
            testId="major.exclamationWarning"
            color={colors.amber.c800}
            size={46}
            icon="exclamationcircle"
          />
        }
        title={t('dontHaveFullAccess')}
        text={t('enterCodeWelcomeLetter')}
        buttonAcceptText={t('Ok')}
        buttonCancelText={t('skipCapital') as string}
        onButtonAcceptPress={() => {
          navigation.navigate('AccountValidation');
          setShowModalValidate(!showModalValidate);
        }}
        onButtonCancelPress={() => setShowModalValidate(!showModalValidate)}
      />
      <View style={styles.tableHeaderWrapper}>
        <HeaderCell flex={1} align="left" text="" />
        <HeaderCell flex={1} align="left" text={t('ccy')} />
        <HeaderCell flex={1} align="left" text={t('bid')} />
        <HeaderCell flex={1} align="right" text={t('offer')} />
        <HeaderCell flex={1} align="left" text="" />
        <HeaderCell flex={1} align="left" text="" />
      </View>
      <Line />
      <View testID="major.flatList">
        {majorRates?.length <= 1 ? (
          <View style={{ flex: 1, backgroundColor: colors.grey.A100 }}>
            <NoTransactionsText
              customTextStyle={
                (!!ratesInfo.errorMessage as boolean)
                  ? { color: colors.red.c900, marginHorizontal: 20 }
                  : undefined
              }
              message={
                (!!ratesInfo.errorMessage as boolean)
                  ? `${ratesInfo.errorMessage}`
                  : t('noRatesFound')
              }
            />
          </View>
        ) : (
          <FlatList data={majorRates} renderItem={renderRow} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grey.A100 },
  tableHeaderWrapper: {
    paddingVertical: 10,
    backgroundColor: colors.grey.A100,
    flexDirection: 'row',
  },
  buySellButtonsWrapper: { marginLeft: 152, flexDirection: 'row' },
  arrowAndHiddenButtonsWrapper: { flexDirection: 'row', alignItems: 'center' },
  backRightBtnCenter: {
    backgroundColor: colors.blue.c650,
    right: 74,
  },
  backRightBtnRight: {
    backgroundColor: colors.blue.c650,
    right: 2,
  },
});

export default Major;

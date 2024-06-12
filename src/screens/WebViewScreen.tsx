import React, { FC, ReactElement, useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import LoadingIndicator from 'components/LoadingIndicator';
import { WebViewScreenNavigationProp } from 'types/types';
import SafeAreaWrapper from 'components/Wrappers/SafeAreaWrapper';
import BackButton from 'components/Buttons/BackButton';

const WebViewScreen: FC<WebViewScreenNavigationProp> = ({ navigation, route }): ReactElement => {
  const [link, setLink] = useState<string>('');

  useEffect(() => {
    route?.params?.url && setLink(route?.params?.url);
  }, []);

  if (!link) {
    return (
      <LoadingIndicator size={'large'} background="white" testId={'webView.loadingIndicator'} />
    );
  }

  return (
    <SafeAreaWrapper>
      <BackButton onPress={() => navigation.goBack()} text="Back" />
      <WebView source={{ uri: link }} scalesPageToFit={false} />
    </SafeAreaWrapper>
  );
};

export default WebViewScreen;

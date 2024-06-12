import React, { FC, ReactElement, useRef } from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';

const WebViewComponent: FC<{ url: string; jsCode: string }> = ({ url, jsCode }): ReactElement => {
  const theWebView = useRef({});

  const _onMessage = (event: any) => {
    console.log('_onMessage', JSON.parse(event.nativeEvent.data));
    const res = JSON.parse(event.nativeEvent.data);
    if (res.message === 'ok') {
      console.log('button clicked');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={(ref) => {
          theWebView.current = ref;
        }}
        source={{ uri: url }}
        originWhitelist={['*']}
        javaScriptEnabledAndroid={true}
        injectedJavaScript={jsCode}
        onMessage={_onMessage}
      />
    </View>
  );
};

export default WebViewComponent;

import React, { RefObject } from 'react';
import { Navigation } from 'types/types';

export const navigationRef: RefObject<Navigation> = React.createRef();

export const isReadyRef: RefObject<boolean> = React.createRef();

export function navigate(name: string, params?: object) {
  navigationRef.current?.navigate(name, params);
}

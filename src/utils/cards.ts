export const getCardType = (cardNumber: string) => {
  // 2-Visa, 3-MasterCard, 4-American Express, 5- Visa Master Card , 6- Diners Club Card, 7= Discover Card, 8 JCB Card, 9 Maestro Card        0 - not found
  let typeID = 0;
  let typeName = 'Card';

  const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
  const masterCardRegex = /^5[1-5][0-9]{14}$/;
  const amexCardRegex = /^3[47][0-9]{13}$/;
  const visaMasterCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$/;
  const dinersClubCardRegex = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
  const discoverCardRegex =
    /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/;
  const JCBCardRegex = /^(?:2131|1800|35\d{3})\d{11}$/;
  const maestroCardRegex = /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/;

  if (visaRegex.test(cardNumber)) {
    typeID = 2;
    typeName = 'Visa';
  } else if (masterCardRegex.test(cardNumber)) {
    typeID = 3;
    typeName = 'MasterCard';
  } else if (amexCardRegex.test(cardNumber)) {
    typeID = 4;
    typeName = 'American Express';
  } else if (visaMasterCardRegex.test(cardNumber)) {
    typeID = 5;
    typeName = 'Visa Master Card';
  } else if (dinersClubCardRegex.test(cardNumber)) {
    typeID = 6;
    typeName = 'Diners Club Card';
  } else if (discoverCardRegex.test(cardNumber)) {
    typeID = 7;
    typeName = 'Discover Card';
  } else if (JCBCardRegex.test(cardNumber)) {
    typeID = 8;
    typeName = 'JCB Card';
  } else if (maestroCardRegex.test(cardNumber)) {
    typeID = 9;
    typeName = 'Maestro Card';
  }

  return {
    type: typeID,
    typeName: typeName,
  };
};

export const getCardImageByType = (cardType: number) => {
  const imageByType = {
    2: require('../../assets/img/Visa-Logo.jpeg'),
    3: require('../../assets/img/Mastercard-logo.jpeg'),
    4: require('../../assets/img/American-Express-Logo.webp'),
    5: require('../../assets/img/Visa-Mastercard-Logo.jpeg'),
    6: require('../../assets/img/Diners-.webp'),
    7: require('../../assets/img/Discover-Logo.png'),
    8: require('../../assets/img/jcb-card-logo.jpeg'),
    9: require('../../assets/img/Maestro-Logo.png'),
    0: require('../../assets/img/not-found-logo.png'),
  };

  return imageByType[cardType as keyof object];
};

export const getCardNameByType = (cardType: number) => {
  const imageByType = {
    2: 'Visa',
    3: 'Mastercard',
    4: 'American Express',
    5: 'Visa Mastercard',
    6: 'Diners Club',
    7: 'Discover',
    8: 'JCB',
    9: 'Maestro',
    0: 'Unknown',
  };

  return imageByType[cardType as keyof object];
};

export const formatCardNumberValue = (value: string) => {
  const v = value
    .replace(/\s+/g, '')
    .replace(/[^0-9]/gi, '')
    .substr(0, 16);
  const parts = [];

  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substr(i, 4));
  }

  return parts.length > 1 ? parts.join('-') : value;
};

export const regExpCard = new RegExp(
  '^((4\\d{3})|(5[1-5]\\d{2})|(6011))-?\\d{4}-?\\d{4}-?\\d{4}|3[4,7][\\d\\s-]{15}$',
);

import { Country } from 'types/forms';

export const getCountryName = (countryCode: string, countryList: Country[]) => {
  const countryObj = countryList.find((country) => {
    return country.ID === countryCode ? country.Name : '';
  });
  return countryObj?.Name;
};

export const returnApiErrorMessage = (
  errorCode: number,
  callBack1: (a: string) => void,
  callBack2: (a: string) => void,
  messages: {
    title: { processing: string };
    content: {
      processing: string;
      invalidIban: string;
      invalidSwift: string;
      invalidAccountNumber: string;
      invalidSortCode: string;
      invalidBranchCode: string;
      invalidCountry: string;
    };
  },
  selectedCountryId?: string,
) => {
  const { title, content } = messages;
  if (errorCode === 1004) {
    callBack1(title.processing);
    callBack2(content.processing);
  }
  if (errorCode === 1001) {
    callBack2(content.invalidIban);
  }
  if (errorCode === 1002) {
    callBack2(content.invalidSwift);
  }
  if (errorCode === 1003) {
    callBack2(content.invalidAccountNumber);
  }
  if (errorCode === 1028) {
    if (selectedCountryId !== 'CA') {
      callBack2(content.invalidSortCode);
    } else {
      callBack2(content.invalidBranchCode);
    }
  }
  if (errorCode === 1019) {
    callBack2(content.invalidCountry);
  }
};

export const defineRoutingBankFieldLabel = (
  selectedCcy: string,
  labelValues: string[],
  selectedCountry?: string,
) => {
  let label = labelValues[0];
  if (selectedCcy === 'US') {
    label = labelValues[1];
  } else if (selectedCcy === 'INR') {
    label = labelValues[2];
  } else if (selectedCcy === 'CNY' && selectedCountry !== 'HK') {
    label = labelValues[3];
  }
  return label;
};

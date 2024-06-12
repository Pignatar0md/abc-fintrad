export const validateIBAN = (country: string, iban: string) => {
  //Regex by country code
  let re;
  switch (country) {
    case 'AD': //Andorra
      re = /^AD[0-9]{2}[0-9]{4}[0-9]{4}[A-Z0-9]{12}$/;
      return re.test(iban);
    case 'AE': //United Arab Emirates
      re = /^AE[0-9]{2}[0-9]{3}[0-9]{16}$/;
      return re.test(iban);
    case 'AL': //Albania
      re = /^AL[0-9]{2}[0-9]{8}[A-Z0-9]{16}$/;
      return re.test(iban);
    case 'AO': //Angola
      re = /^AO[0-9]{2}[0-9]{21}$/;
      return re.test(iban);
    case 'AT': //Austria
      re = /^AT[0-9]{2}[0-9]{5}[0-9]{11}$/;
      return re.test(iban);
    case 'AZ': //Azerbaijan
      re = /^AZ[0-9]{2}[A-Z]{4}[A-Z0-9]{20}$/;
      return re.test(iban);
    case 'BA': //Bosnia and Herzegovina
      re = /^BA[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{8}[0-9]{2}$/;
      return re.test(iban);
    case 'BE': //Belgium
      re = /^BE[0-9]{2}[0-9]{3}[0-9]{7}[0-9]{2}$/;
      return re.test(iban);
    case 'BF': //Burkina Faso
      re = /^BF[0-9]{2}[0-9]{23}$/;
      return re.test(iban);
    case 'BG': //Bulgaria
      re = /^BG[0-9]{2}[A-Z]{4}[0-9]{4}[0-9]{2}[A-Z0-9]{8}$/;
      return re.test(iban);
    case 'BH': //Bahrain
      re = /^BH[0-9]{2}[A-Z]{4}[A-Z0-9]{14}$/;
      return re.test(iban);
    case 'BI': //Burundi
      re = /^BI[0-9]{2}[0-9]{12}$/;
      return re.test(iban);
    case 'BJ': //Benin
      re = /^BJ[0-9]{2}[A-Z]{1}[0-9]{23}$/;
      return re.test(iban);
    case 'BR': //Brazil
      re = /^BR[0-9]{2}[0-9]{8}[0-9]{5}[0-9]{10}[A-Z][A-Z0-9]$/;
      return re.test(iban);
    case 'CH': //Switzerland
      re = /^CH[0-9]{2}[0-9]{5}[A-Z0-9]{12}$/;
      return re.test(iban);
    case 'CI': //Ivory Coast
      re = /^CI[0-9]{2}[A-Z]{1}[0-9]{23}$/;
      return re.test(iban);
    case 'CM': //Cameroon
      re = /^CM[0-9]{2}[0-9]{23}$/;
      return re.test(iban);
    case 'CR': //Costa Rica
      re = /^CR[0-9]{2}[0-9]{3}[0-9]{14}$/;
      return re.test(iban);
    case 'CV': //Cape Verde
      re = /^CV[0-9]{2}[0-9]{21}$/;
      return re.test(iban);
    case 'CY': //Cyprus
      re = /^CY[0-9]{2}[0-9]{3}[0-9]{5}[A-Z0-9]{16}$/;
      return re.test(iban);
    case 'CZ': //Czech Republic
      re = /^CZ[0-9]{2}[0-9]{20}$/;
      return re.test(iban);
    case 'DE': //Germany
      re = /^DE[0-9]{2}[0-9]{8}[0-9]{10}$/;
      return re.test(iban);
    case 'DK': //Denmark
      re = /^DK[0-9]{2}[0-9]{14}$/;
      return re.test(iban);
    case 'DO': //Dominican Republic
      re = /^DO[0-9]{2}[A-Z0-9]{4}[0-9]{20}$/;
      return re.test(iban);
    case 'DZ': //Algeria
      re = /^DZ[0-9]{2}[0-9]{20}$/;
      return re.test(iban);
    case 'EE': //Estonia
      re = /^EE[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{11}[0-9]{1}$/;
      return re.test(iban);
    case 'ES': //Spain
      re = /^ES[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{1}[0-9]{1}[0-9]{10}$/;
      return re.test(iban);
    case 'FI': //Finland
      re = /^FI[0-9]{2}[0-9]{6}[0-9]{7}[0-9]{1}$/;
      return re.test(iban);
    case 'FO': //Faroe Islands
      re = /^FO[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}$/;
      return re.test(iban);
    case 'FR': //France
      re = /^FR[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}$/;
      return re.test(iban);
    case 'GB': //United Kingdom
      re = /^GB[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}$/;
      return re.test(iban);
    case 'GE': //Georgia
      re = /^GE[0-9]{2}[A-Z]{2}[0-9]{16}$/;
      return re.test(iban);
    case 'GI': //Gibraltar
      re = /^GI[0-9]{2}[A-Z]{4}[A-Z0-9]{15}$/;
      return re.test(iban);
    case 'GL': //Greenland
      re = /^GL[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}$/;
      return re.test(iban);
    case 'GR': //Greece
      re = /^GR[0-9]{2}[0-9]{3}[0-9]{4}[A-Z0-9]{16}$/;
      return re.test(iban);
    case 'GT': //Guatemala
      re = /^GT[0-9]{2}[A-Z0-9]{4}[A-Z0-9]{20}$/;
      return re.test(iban);
    case 'HR': //Croatia
      re = /^HR[0-9]{2}[0-9]{7}[0-9]{10}$/;
      return re.test(iban);
    case 'HU': //Hungary
      re = /^HU[0-9]{2}[0-9]{3}[0-9]{4}[0-9]{1}[0-9]{15}[0-9]{1}$/;
      return re.test(iban);
    case 'IE': //Ireland
      re = /^IE[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}$/;
      return re.test(iban);
    case 'IL': //Israel
      re = /^IL[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{13}$/;
      return re.test(iban);
    case 'IR': //Iran
      re = /^IR[0-9]{2}[0-9]{22}$/;
      return re.test(iban);
    case 'IS': //Iceland
      re = /^IS[0-9]{2}[0-9]{4}[0-9]{2}[0-9]{6}[0-9]{10}$/;
      return re.test(iban);
    case 'IT': //Italy
      re = /^IT[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}$/;
      return re.test(iban);
    case 'JO': //Jordan
      re = /^JO[0-9]{2}[A-Z]{4}[0-9]{4}[0]{8}[A-Z0-9]{10}$/;
      return re.test(iban);
    case 'KW': //Kuwait
      re = /^KW[0-9]{2}[A-Z]{4}[0-9]{22}$/;
      return re.test(iban);
    case 'KZ': //Kazakhstan
      re = /^KZ[0-9]{2}[0-9]{3}[A-Z0-9]{13}$/;
      return re.test(iban);
    case 'LB': //Lebanon
      re = /^LB[0-9]{2}[0-9]{4}[A-Z0-9]{20}$/;
      return re.test(iban);
    case 'LI': //Liechtenstein
      re = /^LI[0-9]{2}[0-9]{5}[A-Z0-9]{12}$/;
      return re.test(iban);
    case 'LT': //Lithuania
      re = /^LT[0-9]{2}[0-9]{5}[0-9]{11}$/;
      return re.test(iban);
    case 'LU': //Luxembourg
      re = /^LU[0-9]{2}[0-9]{3}[A-Z0-9]{13}$/;
      return re.test(iban);
    case 'LV': //Latvia
      re = /^LV[0-9]{2}[A-Z]{4}[A-Z0-9]{13}$/;
      return re.test(iban);
    case 'MC': //Monaco
      re = /^MC[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}$/;
      return re.test(iban);
    case 'MD': //Moldova
      re = /^MD[0-9]{2}[A-Z0-9]{20}$/;
      return re.test(iban);
    case 'ME': //Montenegro
      re = /^ME[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}$/;
      return re.test(iban);
    case 'MG': //Madagascar
      re = /^MG[0-9]{2}[0-9]{23}$/;
      return re.test(iban);
    case 'MK': //Macedonia
      re = /^MK[0-9]{2}[0-9]{3}[A-Z0-9]{10}[0-9]{2}$/;
      return re.test(iban);
    case 'ML': //Mali
      re = /^ML[0-9]{2}[A-Z]{1}[0-9]{23}$/;
      return re.test(iban);
    case 'MR': //Mauritania
      re = /^MR13[0-9]{5}[0-9]{5}[0-9]{11}[0-9]{2}$/;
      return re.test(iban);
    case 'MT': //Malta
      re = /^MT[0-9]{2}[A-Z]{4}[0-9]{5}[A-Z0-9]{18}$/;
      return re.test(iban);
    case 'MU': //Mauritius
      re = /^MU[0-9]{2}[A-Z]{4}[0-9]{2}[0-9]{2}[0-9]{12}[0-9]{3}[A-Z]{3}$/;
      return re.test(iban);
    case 'MZ': //Mozambique
      re = /^MZ[0-9]{2}[0-9]{21}$/;
      return re.test(iban);
    case 'NL': //Netherlands
      re = /^NL[0-9]{2}[A-Z]{4}[0-9]{10}$/;
      return re.test(iban);
    case 'NO': //Norway
      re = /^NO[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{1}$/;
      return re.test(iban);
    case 'PK': //Pakistan
      re = /^PK[0-9]{2}[A-Z]{4}[A-Z0-9]{16}$/;
      return re.test(iban);
    case 'PL': //Poland
      re = /^PL[0-9]{2}[0-9]{8}[0-9]{16}$/;
      return re.test(iban);
    case 'PS': //Palestine
      re = /^PS[0-9]{2}[A-Z]{4}[A-Z0-9]{21}$/;
      return re.test(iban);
    case 'PT': //Portugal
      re = /^PT[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{11}[0-9]{2}$/;
      return re.test(iban);
    case 'QA': //Qatar
      re = /^QA[0-9]{2}[A-Z]{4}[A-Z0-9]{21}$/;
      return re.test(iban);
    case 'RO': //Romania
      re = /^RO[0-9]{2}[A-Z]{4}[A-Z0-9]{16}$/;
      return re.test(iban);
    case 'RS': //Serbia
      re = /^RS[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}$/;
      return re.test(iban);
    case 'SA': //Saudi Arabia
      re = /^SA[0-9]{2}[0-9]{2}[A-Z0-9]{18}$/;
      return re.test(iban);
    case 'SE': //Sweden
      re = /^SE[0-9]{2}[0-9]{3}[0-9]{16}[0-9]{1}$/;
      return re.test(iban);
    case 'SI': //Slovenia
      re = /^SI[0-9]{2}[0-9]{5}[0-9]{8}[0-9]{2}$/;
      return re.test(iban);
    case 'SK': //Slovakia
      re = /^SK[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{10}$/;
      return re.test(iban);
    case 'SM': //San Marino
      re = /^SM[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}$/;
      return re.test(iban);
    case 'SN': //Senegal
      re = /^SN[0-9]{2}[A-Z]{1}[0-9]{23}$/;
      return re.test(iban);
    case 'TL': //East Timor
      re = /^TL38[0-9]{3}[0-9]{14}[0-9]{2}$/;
      return re.test(iban);
    case 'TN': //Tunisia
      re = /^TN59[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}$/;
      return re.test(iban);
    case 'TR': //Turkey
      re = /^TR[0-9]{2}[0-9]{5}[A-Z0-9]{1}[A-Z0-9]{16}$/;
      return re.test(iban);
    case 'VG': //Virgin Islands, British
      re = /^VG[0-9]{2}[A-Z]{4}[0-9]{16}$/;
      return re.test(iban);
    case 'XK': //Republic of Kosovo
      re = /^XK[0-9]{2}[0-9]{4}[0-9]{10}[0-9]{2}$/;
      return re.test(iban);
  }
};

export const checkInvalidFields = (
  value1: string,
  value2: string,
  value3: string,
  callBack: (a: string) => void,
  errorMessages: string[],
) => {
  let isValid = true;
  if (value1 && value1.length < 7 && value1.length > 11) {
    callBack(errorMessages[0]);
    isValid = false;
  }
  if (!/^[A-Za-z0-9]*$/.test(value1)) {
    callBack(errorMessages[1]);
    isValid = false;
  }
  if (value3 !== 'CA' && value3 !== 'GB') {
    const ibanIsValid = validateIBAN(value3, value2);
    if (!ibanIsValid) {
      callBack(errorMessages[2]);
      isValid = false;
    }
  }
  return isValid;
};

export const checkRequiredFields = (
  selectedCcy: string,
  selectedCountry: string,
  beneficiaryAddr: string,
  callBack1: (a: string) => void,
  callBack2: () => void,
  errorMessages: string[],
) => {
  let isValid = true;
  const cciesRequiresCountry = ['USD', 'CAD', 'PKR'];

  if (cciesRequiresCountry.includes(selectedCcy) && !selectedCountry) {
    callBack1(errorMessages[0]);
    callBack2();
    isValid = false;
  }
  if (cciesRequiresCountry.includes(selectedCcy) && !beneficiaryAddr) {
    callBack1(errorMessages[1]);
    isValid = false;
  }
  return isValid;
};

export const checkValidationsForCanada = (
  checkPrimaryvalue1: string,
  checkPrimaryvalue2: string,
  checkPrimaryvalue3: string,
  checkSecondaryValue: string,
  callBack: (a: string) => void,
  errorMessages: string[],
) => {
  let isValid = true;
  if (!checkPrimaryvalue1) {
    callBack(errorMessages[0]);
    isValid = false; // branchcode is required
  }
  if (!checkPrimaryvalue2) {
    callBack(errorMessages[1]);
    isValid = false;
  }
  if (checkPrimaryvalue2.length < 3) {
    callBack(errorMessages[2]);
    isValid = false;
  }
  if (!/^[0-9]*$/.test(checkPrimaryvalue2)) {
    callBack(errorMessages[2]);
    isValid = false;
  }
  if (checkPrimaryvalue1.length < 5) {
    callBack(errorMessages[3]);
    isValid = false;
  }
  if (checkPrimaryvalue3.length === 0) {
    callBack(errorMessages[4]);
    isValid = false;
  }
  if (!/^[0-9]*$/.test(checkPrimaryvalue3)) {
    callBack(errorMessages[5]);
    isValid = false;
  }
  if (checkSecondaryValue !== 'CA' && checkPrimaryvalue1 === '') {
    callBack(errorMessages[6]);
    isValid = false;
  }
  return isValid;
};

export const setPayTypeCode = (
  payType: number,
  disableSwift: (a: boolean) => void,
  disableIban: (a: boolean) => void,
  disableAccountNumber: (a: boolean) => void,
  disableSortCode: (a: boolean) => void,
) => {
  switch (payType) {
    case 0:
      disableSwift(false);
      disableIban(false);
      disableAccountNumber(true);
      disableSortCode(true);
      break;
    case 1:
      disableSwift(false);
      disableIban(true);
      disableAccountNumber(false);
      disableSortCode(true);
      break;
    case 2:
      disableSwift(true);
      disableIban(true);
      disableAccountNumber(false);
      disableSortCode(false);
      break;
    default:
      disableSwift(false);
      disableIban(true);
      disableAccountNumber(false); //branchCode === swiftCode // bankCode === sortCode
      disableSortCode(true);
      break;
  }
};

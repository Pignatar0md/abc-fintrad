import React from 'react';
import { en } from '../../languages';
import { Dimensions } from 'react-native';
import { colors, fontSizes } from 'styles';
import FontAwesomeFive from 'components/Icons/FontAwesomeFive';
import MaterialIcon from 'components/Icons/MaterialIcon';
import MaterialCommunity from 'components/Icons/MaterialCommunity';
import QuickLinks from 'Routing/QuickLinks';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const CURRENT_LANGUAGE = 'en';
export const DEFAULT_CITY = 'Chipre';
export const DEFAULT_ADDRESS1 = '14th street';
export const DEFAULT_ADDRESS2 = '123 Lux City';
export const DEFAULT_POSTCODE = '129jcc 1k';
export const DEFAULT_IDD = '+00';
export const SORTCODE = 230088;
export const BANK_ACCOUNT_NAME = 'ABC Fintrad LLC';
export const SYSTEM_NAME = '';
export const GBP_CURRENCY_SYMBOL = 'EUR';
export const DEFAULT_COUNTRYCODE = 'CP';
export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const DEVICE_WIDTH = Dimensions.get('window').width;
export const DEVICE_XSMALL = DEVICE_HEIGHT <= 592; // 4.7"

export const DEFAULT_HEADER_CONFIG: NativeStackNavigationOptions = {
  headerShown: true,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: colors.blue.c999,
  },
  headerBackTitleVisible: false,
  headerTintColor: colors.grey.A100,
  headerTitleStyle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: fontSizes.medium16,
  },
};

export const SCREEN_OPTIONS_NO_QUICKLINKS_BOTTOM_TABBAR = {
  headerShown: false,
  title: '',
  tabBarStyle: { backgroundColor: colors.grey.c350 },
  tabBarActiveTintColor: colors.cyan.A800,
  inactiveTintColor: colors.grey.c750,
};

export const DEFAULT_SCREEN_OPTIONS_BOTTOM_TABBAR = {
  headerShown: true,
  title: '',
  headerStyle: { height: 84, backgroundColor: colors.grey.A250 },
  headerTitle: () => <QuickLinks />,
  tabBarStyle: { backgroundColor: colors.grey.c350 },
  tabBarActiveTintColor: colors.cyan.A800,
  inactiveTintColor: colors.grey.c750,
};

export const SLIDER_WAS_SHOWN = 'slider_was_shown';
export const EXECUTE_CURRENCY_TRADE = 'execute_currency_trade';
export const DEVICE_VALIDATED = 'device_validated';

export const introSlides = [
  {
    key: 1,
    title: en.sliderHomeTitle,
    text: en.sliderHomeText,
    backgroundColor: colors.blue.c999,
  },
  {
    key: 2,
    title: en.sliderSendMoneyTitle,
    text: en.sliderSendMoneyText,
    backgroundColor: colors.blue.c999,
  },
  {
    key: 3,
    title: en.sliderEasyAccessTitle,
    text: en.sliderEasyAccessText,
    backgroundColor: colors.blue.c999,
  },
  {
    key: 4,
    title: en.sliderValidateDeviceTitle,
    text: en.sliderValidateDeviceText,
    backgroundColor: colors.blue.c999,
  },
];

const SECURITY_SETTINGS_OPTIONS_ICON_COLOR = colors.grey.c650;
const SECURITY_SETTINGS_OPTIONS_ICON_SIZE = 40;

export const SECURITY_SETTINGS_OPTIONS = [
  {
    icon: (
      <FontAwesomeFive
        testId="securitySettings.fingerprintIcon"
        icon={'fingerprint'}
        color={SECURITY_SETTINGS_OPTIONS_ICON_COLOR}
        size={SECURITY_SETTINGS_OPTIONS_ICON_SIZE}
      />
    ),
    title: 'fingerprintTitle',
  },
  {
    icon: (
      <MaterialIcon
        testId="securitySettings.dialpadIcon"
        icon={'dialpad'}
        color={SECURITY_SETTINGS_OPTIONS_ICON_COLOR}
        size={SECURITY_SETTINGS_OPTIONS_ICON_SIZE}
      />
    ),
    title: 'pinTitle',
  },
];

export const FAQ_OPTIONS = [
  {
    key: 'generalInfo',
    name: 'General',
    content: [
      {
        title: 'Why use ABC Fintrad?',
        text: "ABC Fintrad provides extremely competitive exchange rates in comparison to banks and other brokers. Executing billions of pounds' worth of transactions a year provides clients access to a range of suppliers including banks and liquidity providers.",
      },
      {
        title: 'Why is it cheaper with you than with my bank?',
        text: "It's simple. We make money on the exchange rate spread, the difference between the buy and the sell rate. The only difference is that we charge a smaller margin and profit than other brokers and banks. We also eliminate extra fees, charges and commissions. It is also important to highlight that, unlike major banks and financial institutions, we don't have large overheads.",
      },
      {
        title: 'How is ABC Fintrad different from other brokers?',
        text: 'We offer premium exchange rates, premier service, groundbreaking technology and online trading.',
      },
      {
        title: 'What is the difference between currency exchange and currency speculation?',
        text:
          'We exchange currency. ABC helps you manage the risk associated with exchanging one currency for another. We carry out the buying and selling of currencies on behalf of our clients in the most cost effective way.' +
          '\n\nCurrency speculation, on the other hand, is about day trading currencies for potential profit. The currency speculator is actually willing to take risk. As a client this is precisely the risk you want to avoid.',
      },
      {
        title: 'Am I covered by the Data Protection Act?',
        text: 'We take security of data very seriously indeed and are registered under the Data Protection Act to hold the minimum amount of data necessary to transact on your behalf. We do not provide any details to outside parties other than the details necessary to effect transactions.',
      },
      {
        title: 'Does it take longer to buy through a broker than a bank?',
        text: 'No. Generally as brokers are experienced working in the foreign property market they understand the importance of payments reaching their destination on time. Therefore as soon as funds reach a client account they are automatically sent by international transfer known as SWIFT. It can take as little as a few minutes to deliver funds to an account depending on the destination country.',
      },
      {
        title: 'Why would I want to use a broker when it is so convenient to use my own bank?',
        text: "Using ABC Fintrad creates simplicity and convenience by allowing you to outsource the task of facilitating payments or faxing currency orders. With ABC Fintrad you can buy by phone or even faster online. Our online system has no extra cost and you don't even need to download any software. ABC Fintrad are specialists focused on one area, foreign exchange. This enables you to obtain information quicker and track your transactions with your dedicated broker from start to finish.",
      },
      {
        title: 'What do I need to do next?',
        text: 'You need to set up an account through our online application. An account enables you to obtain live quotes and order currency online or by phone.',
      },
      {
        title: 'How long does it take to get my account set up?',
        text: 'As soon as we have received your completed ABC Fintrad mandate, terms of business and documentation, we\'ll then seek authorisation from our compliance department. We will also need to carry out a "Know your client" (KYC) process on all new clients. Your account can then be opened and confirmed by email within minutes.',
      },
      {
        title: 'Why do I have to open an account to use your services?',
        text: 'We are required under the strict Anti-Money Laundering Regulations set by the FSA and HM Revenue and Customs. We are obliged to carry out compliance procedures relating to all our clients.',
      },
    ],
  },
  {
    key: 'tradingInfo',
    name: 'Trading',
    content: [
      {
        title: 'How quicky can I trade?',
        text: 'Your trading account can be activated within minutes of receipt of your completed documentation and ABC Fintrad authorisation.',
      },
      {
        title: 'How complicated is trading with ABC Fintrad?',
        text: 'Trading with ABC Fintrad is extremely simple. You can open an account online, assign a dedicated broker and trade either by phone or online. Our exceptional levels of service and groundbreaking technology enable you to complete efficient, hassle-free transactions.',
      },
      {
        title: 'What is a same-day transaction?',
        text: 'Same/next day. We also offer contract to be settled on the day of trade (same day value) and overnight (next day) settlement. ABC Fintrad must have received cleared funds between 12pm and 2pm depending on the required currency. Your payment will be sent automatically, the working day to your designated beneficiary. Please note some currencies may have longer settlement periods. This contract type is ideal for currency required on an urgent basis.',
      },
      {
        title: 'What is a spot transaction?',
        text: 'A spot transaction is an agreement to buy or sell a currency to be delivered and settled usually within two working days, as per the value or settlement date agreed. ABC Fintrad can provide settlement to clients of up to five working days to allow for BACS payments. Spot transactions are an ideal tool for businesses or private individuals that require delivery.',
      },
      {
        title: 'What is a forward contract?',
        text: 'A forward contract allows the buyer to lock in the rate for up to one year on a specified maturity date, effectively removing future risk from any movements in the foreign exchange market. As a risk management tool this contract provides protection against fluctuating exchange rates. Also known as hedging, this can be one of the most effective ways of managing your foreign exchange exposure. A forward contract is ideal for private individuals wishing to fix the cost of purchasing an overseas property or a business wishing to take advantage of the current market rate against future obligations. Forward contracts will usually require a deposit of between 5% and 10% deducted from the sum payable on the maturity date.',
      },
      {
        title: 'What is a forward time option contract?',
        text: "It's also known as fixed forward. This works in exactly the same way as a standard forward contract but allows the funds to be drawn down in full or as a partial amount prior to contract maturity. The option is available within a maximum of a three month time window. For example, if you purchased currency on 1st February for maturity on 1st June you could request a time option three months prior to this date on 1st March, allowing you to make unlimited drawdowns between these two dates. This is ideal if you need a fixed exchange rate but are unsure of the date you require funds within the time window. ABC Fintrad also has the facility to roll the maturity date of a forward by executing a swap if required. This may involve additional cost.",
      },
      {
        title: 'Why is a margin required when buying currency on a Forward basis?',
        text: "A margin is required by the ABC Fintrad as standard security against currency purchased on a forward basis. The bank holds on your behalf 10% of the total amount of any forward contract and the remaining 90% is paid upon on the maturity date of your contract. It is important to note that ABC Fintrad must maintain a 10% margin at all times against your trade to reflect any sudden market movement. ABC Fintrad may conduct a 'margin call' to maintain your deposit at 10%. Forward margin is also protects ABC Fintrad against defaults on forward contracts.",
      },
      {
        title:
          'Can I leave an order for ABC Fintrad to execute if the market reaches a certain market level?',
        text: 'A limit order placed in the market will enable you to buy or sell a currency when the market reaches a particularly required level, higher than the current market price. We will then monitor the market and confirm your order is filled if the market reaches your specified level / target rate. You can place a time limit on the order or let the order run GTC (Good Tell Cancelled). A limit order can also be requested on an unconfirmed alert only basis (without commitment). This type of order is worked 24 hours a day on the international market.',
      },
      {
        title: 'Can ABC Fintrad help protect me if the rates moves against me?',
        text: 'A stop loss order placed in the market will enable you to buy or sell a currency set a lower level exchange rate than the current market rate. This protects you against negative movements in the exchange rate, and limits your loss. You can place a time limit on the order or let the order run GTC (Good Till Cancelled). A stop loss can also be requested on an unconfirmed, alert-only basis (without commitment). This type of order is worked 24 hours a day on the international market. Stop Orders that are activated are filled at the best possible rate, and are not guaranteed at the rate at which they are entered, there is therefore a risk that such orders may be executed on less advantageous terms.',
      },
      {
        title: 'How does it work for selling currencies?',
        text: "ABC Fintrad on account opening, provide all clients automatic access to 23 multi currency accounts. This allows you to sell currencies, ideal for repatriation of export profits or an individual's foreign wages. We can receive your foreign currency wire transfers on your behalf for no charge, allowing you to hold funds on account. Funds can then be converted into your chosen currency when the market is favorable or you require. Funds can be executed and payment made on a same day basis.",
      },
      {
        title: 'Is there a minimum or maximum trade size I execute?',
        text: 'ABC Fintrad has no minimum or maximum transaction. Trades can range from £500 upwards. ABC Fintrad processes foreign exchange transactions from as little as £500 to several million. Our access to the foreign exchange provides ABC Fintrad with the ability to provide all of our clients, regardless of size, premium exchange rates.',
      },
      {
        title: 'Does rates vary according to volume of trade?',
        text: 'Yes, fixed costs for every trade are the same regardless of trade size. Therefore rates margins will be tighter the larger the trade.',
      },
      {
        title: 'What rate will I get?',
        text: 'The rate you receive will be based on the live market interbank price. This rate will include our margin depending on trade size and be quoted to you online or by phone. Please note live interbank rates change per second. Teletext and certain internet websites usually have a time delay.',
      },
      {
        title: 'What happens if my circumstances changes?',
        text: 'On occasion, due to unforeseen circumstances, plans and requirements change. In the case where you have secured a forward contract but find you will no longer require to take delivery of the currency at the maturity date, you may sell the contract back to the market provided paying any losses and charges incurred.',
      },
      {
        title: 'Is it important I obtain a commercial rate?',
        text: 'Yes, very important; it is always beneficial to look beyond your bank and obtain exchange rates from an external supplier in order to make comparisons. You have nothing to lose by doing this.',
      },
      {
        title: 'Are there any hidden charges, costs or commissions?',
        text: 'No. ABC Fintrad does not add any additional charges costs or commission to your transaction. The only charge we make is a payment fee for onward transmission of your funds.',
      },
      {
        title: 'What sources of information does ABC Fintrad use?',
        text: 'Our experienced brokers use a wide range of sources to gather accurate, reliable and up-to-date information, used to inform our clients. These sources of information vary and include; CNN, CNBC, Reuters, Bloomberg, financial news websites, investment banks, independent market analysts and our own in house market experts. Our proactive approach through our online and phone broking, keep our clients up-to-date and in touch with exchange rate movements.',
      },
      {
        title: 'How can currency market volatility work for me?',
        text: 'The foreign exchange market is extremely volatile providing fluctuating rates per second. ABC Fintrad specializes in providing market information and up to date news vital in assisting you in deciding when to execute transactions. ABC Fintrad always uses the very latest technology to help manage your risk and maximize your opportunity. This allows you to benefit from currency fluctuations that move in your favor.',
      },
      {
        title: 'What affects currency exchange rates?',
        text:
          'As a general rule fx markets move macroeconomic factors examining the behaviour of the economy as a whole. Major movements in the exchange rate occur for three main reasons:' +
          "\n\nInterest Rates - Each currency has a central bank, and this central bank issues an overnight lending rate. This is a prime gauge of a currency's value. Base Interest rates, are normally change by central banks on a monthly basis (if changed)." +
          "\n\nThe unemployment rate is a strong indicator of a country's economic strength. When unemployment is low, this usually reflects a strong economy and currency." +
          '\n\nGeopolitical Events - Like all markets, the currency market is affected by what is going on in the world. Key political events around the world can have a big impact on an economy and the value of its respective currency.',
      },
      {
        title: 'How can you minimize currency risk?',
        text: 'We have many tools available to to help you reduce your currency risk. The most commonly used contract is a Forward which allows you to lock in a currency rate today for a future date, whilst only paying initial margin (a deposit) to secure your rate. The balance of payment will be payable on your agreed future date. The reason for doing this is because no one knows where the currency rate will be in three or six months time, but by securing your currency rate early, you can lock in your costs with suppliers, and manage your exposure in a much more certain way.',
      },
    ],
  },
  {
    key: 'payAndSettlementsInfo',
    name: 'Payments and Settlements',
    content: [
      {
        title: "How do I pay for the currency I've ordered?",
        text: {
          text1: 'There are three payment methods to settle a trade:',
          subContent: [
            {
              title: 'CHAPS - ',
              text: 'This is a same day transfer. Your bank may charge you to transfer money using this method.',
            },
            { title: 'BACS - ', text: 'This includes online payments and can take 3-4 days.' },
            { title: 'CHEQUE - ', text: 'This will take up to 10 days to clear on receipt.' },
          ],
          warning: 'Important: ABC Fintrad do not accept cash payments under any circumstances. ',
          text2: 'Please Note: Methods above are not applicable to all value/settlement dates.',
        },
      },
      {
        title: 'How long do I have to make payment to ABC Fintrad for my trade?',
        text: {
          subContent: [
            {
              title: 'Same day transaction - ',
              text: 'Payment required by 12pm on the working day.',
            },
            {
              title: 'Spot transactions - ',
              text: 'Standard is 2 workings days. ABC Fintrad provides flexibility of up to 5 working days if required and arranged when you book your transaction.',
            },
            {
              title: 'Forward and Forward Time options - ',
              text: '10% deposit is required within 2 working days. 90% required 24 hours before completion/maturity date.',
            },
          ],
          text2:
            'Payments are always made as per agreed value or settlement date agreed with your broker or online. Please note late payment may incur extra costs.',
        },
      },
      {
        title: 'What happens if I am unable to pay for my trade?',
        text: 'If you cannot make settlement for a transaction, ABC Fintrad will have to close out the contract by selling the related currency back to the market. Losses and charges incurred will then be covered by the client.',
      },
      {
        title: 'Do you charge for payments/wire transfers?',
        text: 'ABC Fintrad charge a maximum of £15 per payment. ABC Fintrad will automatically send credit, debit and payment confirmations.',
      },
      {
        title: 'Once I have paid, how is the currency transferred?',
        text: 'Your funds are sent via priority telegraphic transfer anywhere in the world directly into the bank account of your instruction. This method is the quickest, safest and most effective way of transferring funds. We send CHAPS payment for sterling, domestic UK payments.',
      },
      {
        title: 'How long does it take ABC Fintrad to make payments?',
        text: 'ABC Fintrad make automatic payments on receipt of your funds and beneficiary bank details. We will then email or fax payment confirmation. Most currencies can be credited to an account same day. However, depending on the currency and destination country will determine the settlement period.',
      },
      {
        title: 'What if I need my money before or after the forward transaction date?',
        text: "Your foreign exchange contract will be booked with a value or settlement date. This is the date by which the transaction needs to be paid for. This is always agreed before you book a trade. If you should need your currency sooner than expected, we can 'draw down' the currency for early delivery. If you need funds after the value date, ABC Fintrad can 'roll over' or extend the value date. In both cases, your original exchange rate may be subject to adjustment and extra costs.",
      },
      {
        title: 'Do banks charge to receive funds?',
        text: "Depending on the country and bank recipient fees may occur when funds arrive in the beneficiary account. These are also known as 'agent fees'. ABC Fintrad will advise you on how to minimize these costs.",
      },
      {
        title: 'How are payments quicker and more efficient with ABC Fintrad?',
        text: 'All currency payments are sent by SWIFT telegraphic transfer with most currencies being credited the same day we receive client funds, removing any time delays. For all UK domestic payments, we send payments by same day CHAPS. We always retain beneficiary bank details to avoid any need to email or fax details every transaction you complete.',
      },
      {
        title: 'Can a wire be recalled?',
        text: 'No, once a wire is initiated, payment is guaranteed by the bank. However, if there is inconsistent or incorrect information on the client OPI, the transaction may be reversed or be delayed in crediting an account.',
      },
      {
        title: 'Do you pay interest on outstanding balances?',
        text: 'ABC Fintrad is not an interest bearing bank. Unfortunately we are not authorized to pay clients interest on balances held on account.',
      },
    ],
  },
];

const QUICKLINKS_OPTIONS_ICON_SIZE = fontSizes.extraLarge22;
const QUICKLINKS_OPTIONS_ICON_COLOR = colors.blueGrey.c350;
export const QUICKLINKS_OPTIONS = [
  {
    buttonText: 'Rates',
    buttonIcon: (
      <MaterialIcon
        testId="quickLink.iconImageButton"
        icon={'attach-money'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={QUICKLINKS_OPTIONS_ICON_SIZE}
      />
    ),
    testId: 'quickLink.Rates',
    routeName: 'Rates',
    screenName: 'Major',
  },
  {
    buttonText: 'Balances',
    buttonIcon: (
      <MaterialIcon
        testId="quickLink.imageButton"
        icon={'bar-chart'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={QUICKLINKS_OPTIONS_ICON_SIZE}
      />
    ),
    testId: 'quickLink.Balances',
    routeName: 'Balances',
  },
  {
    buttonText: 'Cards',
    buttonIcon: (
      <MaterialCommunity
        testId="quickLink.imageButton"
        icon={'credit-card-outline'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={QUICKLINKS_OPTIONS_ICON_SIZE}
      />
    ),
    testId: 'quickLink.Cards',
    routeName: 'CurrencyCards',
  },
  {
    buttonText: 'Payment',
    buttonIcon: (
      <MaterialIcon
        testId="quickLink.imageButton"
        icon={'payments'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={QUICKLINKS_OPTIONS_ICON_SIZE}
      />
    ),
    testId: 'quickLink.Payment',
    routeName: 'SendPayment',
  },
  {
    buttonText: 'Top up',
    buttonIcon: (
      <MaterialCommunity
        testId="quickLink.imageButton"
        icon={'cash-plus'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={QUICKLINKS_OPTIONS_ICON_SIZE}
      />
    ),
    testId: 'quickLink.toUp',
    routeName: 'TopUp',
  },
  {
    buttonText: 'Trade',
    buttonIcon: (
      <FontAwesomeFive
        testId="quickLink.imageButton"
        icon={'retweet'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={fontSizes.mediumLarge18}
      />
    ),
    testId: 'quickLink.Trade',
    routeName: 'Trade',
  },
  {
    buttonText: 'Order',
    buttonIcon: (
      <FontAwesomeFive
        testId="component.imageButton"
        icon={'coins'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={fontSizes.medium16}
      />
    ),
    testId: 'quickLink.Order',
    routeName: 'AddOrder',
  },
  {
    buttonText: 'Statements',
    buttonIcon: (
      <FontAwesomeFive
        testId="component.imageButton"
        icon={'money-check-alt'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={fontSizes.medium16}
      />
    ),
    testId: 'quickLink.Statements',
    routeName: 'StatementsTopTabbarForMain',
  },
  {
    buttonText: 'Beneficiary',
    buttonIcon: (
      <FontAwesomeFive
        testId="component.imageButton"
        icon={'user-alt'}
        color={QUICKLINKS_OPTIONS_ICON_COLOR}
        size={fontSizes.mediumLarge18}
      />
    ),
    testId: 'quickLink.Beneficiary',
    routeName: 'AddBeneficiaryTopTabbar',
  },
];

export const ACCOUNT_OPTIONS = [
  { id: 0, name: 'Balances', routeName: 'Balances' },
  { id: 1, name: 'Statements', routeName: 'StatementsTopTabbarForMain' },
  { id: 2, name: 'Trades', routeName: 'Trades' },
  { id: 3, name: 'Orders', routeName: 'Orders' },
  { id: 4, name: 'Beneficiaries', routeName: 'BeneficiaryList' },
  { id: 5, name: 'Details', routeName: 'AccountDetails' },
];

export const BENEFICIARY_TYPES = [
  { value: 'Personal', label: 'Personal' },
  { value: 'Company', label: 'Company' },
];

export const CARDS_OPTIONS = [
  { id: 0, name: 'Debit cards', routeName: 'DebitCards' },
  { id: 1, name: 'Currency cards', routeName: 'CurrencyCards' },
];

export const COLORS_STATUS: { [a: number]: string } = {
  1: colors.green.c800, // active
  0: colors.red.c800, // not activated
  255: colors.blue.A200, // cancelled
  99: colors.grey.c680, // blocked
};

export const PAYMENT_STATUS_COLORS = {
  '1': colors.cyan.A800,
  '2': colors.green.c600,
  '3': colors.grey.c680,
  '5': colors.red.A400,
  '6': colors.red.A400,
  '7': colors.red.A400,
  '8': colors.amber.c700,
  '9': colors.green.c600,
};

export const SETTINGS_OPTIONS = [
  { title: '2faDevice', screenName: '' },
  { title: 'communicationCapital', screenName: 'Communication' },
  { title: 'securityAuthentication', screenName: 'SecuritySettings' },
  { title: 'homePage', screenName: 'HomePage' },
];

export const HOMEPAGE_OPTIONS = [
  { title: 'ratesCapital', value: 'Rates' },
  { title: 'statementsCapital', value: 'StatementsTopTabbar' },
  { title: 'balancesCapital', value: 'Balances' },
  { title: 'tradesCapital', value: 'Trades' },
  { title: 'ordersCapital', value: 'Orders' },
  { title: 'beneficiariesCapital', value: 'BeneficiaryList' },
  { title: 'paymentsCapital', value: 'Payments' },
];

export const START_DAY_GET_STATEMENTS = '1';

export const TITLES = [
  { label: 'Mr', value: 'Mr' },
  { label: 'Mrs', value: 'Mrs' },
  { label: 'Ms', value: 'Ms' },
  { label: 'Miss', value: 'Miss' },
  { label: 'Dr', value: 'Dr' },
];

export const ORDER_TYPE = [
  { label: 'UP ALERT', value: '0' }, // value: '0'
  { label: 'DOWN ALERT', value: '1' }, // value: '1'
  { label: 'BUY LIMIT', value: '2' }, // value: '2'
  { label: 'SELL LIMIT', value: '3' }, // value: '3'
  { label: 'BUY STOP', value: '4' }, // value: '4'
  { label: 'SELL STOP', value: '5' }, // value: '5'
];

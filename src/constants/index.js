export const drawerWidth = 340;

export const navPageDialogData = [
  {
    id: 1,
    text: 'Bring your own server',
    to: '/servers/add',
  },
  {
    id: 2,
    text: 'kuutamo infrastructure platform',
    to: '/order',
  },
];

export const homePageDialogData = [
  {
    id: 1,
    text: 'Just stake',
    to: '/stake',
  },
  {
    id: 2,
    text: 'Setup a node',
    to: '/navpage',
  },
];

export const serversDialogData = (ownServerClick) => [
  {
    id: 1,
    text: 'Bring your own server',
    onClick: ownServerClick,
  },
  {
    id: 2,
    text: 'kuutamo infrastructure platform',
    to: '/order',
    state: {
      back: '/servers',
    },
  },
];

export const authInitialValues = {
  email: '',
  password: '',
};

export const signinInitialValues = {
  email: '',
  password: '',
  protocol: '',
};

export const addServerInitialValues = {
  server: {
    id: '',
    Provider: '',
    Type: '',
    IPv4: '',
    CIDR: '',
    Gateway: '',
    Username: '',
    disks: '',
  },
  key: {
    value: '',
    name: '',
  },
};

export const getTypeItems = (provider) => {
  switch (provider) {
    case 'OVH':
      return [
        { id: 1, default: true, value: 'Adv1-g2-64-2' },
        { id: 2, value: 'Other' },
      ];
    case 'Latitude':
      return [
        { id: 1, default: true, value: 'med-c3-64-2' },
        { id: 2, value: 'Other' },
      ];
    case 'kuutamo':
      return [{ id: 1, default: true, value: 'NEAR' }];
    case 'Other':
      return [{ id: 1, default: true, value: '-' }];
    default:
      return [{ id: 1, default: true, value: 'NEAR' }];
  }
};

export const addServerModalInitialValues = {
  server: {
    id: '',
    Provider: '',
    Type: '',
    IPv4: '',
    CIDR: '',
    Gateway: '',
    Username: '',
    disks: '',
    key: '',
  },
};

export const resetPasswordInitialValues = {
  email: '',
};

export const resetPasswordFormInitialValues = {
  newPassword: '',
  confirmPassword: '',
};

export const orderdServerInitialValues = {
  server: 'SOLO',
  backup: true,
  SRE: true,
};

export const priceData = [
  {
    id: 1,
    name: 'solo',
    title: 'SOLO',
    benefits: [
      'Deploy to kuutamo managed server',
      'Your node, your keys, our servers',
      'Node performance dashboard & financial analytics',
      'Single node, can be used as active or backup',
    ],
    price: 500,
    additional: [
      {
        text: 'Add another node to be used as backup',
        price: 500,
      },
    ],
  },
  {
    id: 2,
    name: 'pro',
    title: 'PRO',
    benefits: [
      'Deploy to kuutamo managed server',
      'Your node, your keys, our servers',
      'Dedicated kuutamo account manager',
      'HA node cluster distributed across multiple locations',
      'Node performance dashboard, financial analytics and reporting',
    ],
    price: 1500,
  },
];

export const runPriceData = [
  {
    id: 1,
    name: 'run',
    title: 'RUN',
    benefits: [
      'Deploy to kuutamo managed server',
      'Your node, your keys, our servers',
      'Dedicated kuutamo account manager',
      'High Availability node cluster distributed across multiple locations',
      'Node performance dashboard, financial analytics and reporting',
      'All maintence operations performed by kuutamo engineers.',
    ],
    price: 1499,
  },
];

export const additionalServices = [
  {
    title: 'kuutamo SRE',
    description: 'All maintence operations performed by kuutamo engineers.',
    price: 500,
  },
];

export const selfmonitoredInititalValue = {
  // mimir: '',
  // loki: '',
  email: '',
  password: '',
};

export const alphaInitialValues = {
  token: '',
};

export const pagerDutyInitialValues = {
  key: '',
};

export const passwordModalFormInitialValues = {
  password: '',
};

export const dashboardAutoRefresh = ['5s', '30s', '1m', '5m', 'off'];


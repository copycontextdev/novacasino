import { CasinoGame, GameProvider, GameLobby, PromotionBanner, DepositOrder, PlayerWallet, Bank, PlayerBankAccount } from './types';

export const MOCK_PROVIDERS: GameProvider[] = [
  { id: 1, uuid: 'p1', name: 'Pragmatic Play', description: '', order: 1, default_logo: null, logo: null },
  { id: 2, uuid: 'p2', name: 'Nebula Games', description: '', order: 2, default_logo: null, logo: null },
  { id: 3, uuid: 'p3', name: 'Techno Gaming', description: '', order: 3, default_logo: null, logo: null },
  { id: 4, uuid: 'p4', name: 'Astro Play', description: '', order: 4, default_logo: null, logo: null },
  { id: 5, uuid: 'p5', name: 'Spin Masters', description: '', order: 5, default_logo: null, logo: null },
];

export const MOCK_GAMES: CasinoGame[] = [
  {
    uuid: 'g1',
    slug: 'gates-of-olympus',
    name: 'Gates of Olympus',
    description: 'Greek god statue with golden highlights. Experience the power of Zeus.',
    order: 1,
    default_logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1MoVZa6za5reMkaRK1m9ZG8qnSMFGGFiBMCUNeUcimWBA13x8FKCiI92Hc3dUYnLYhdtfNcogmen2KLO7orIfNUxnPcp4WGX-pDVjVY-GgdwzHFFS66YLH9JJ6HjrAaqaAbm1lDESzqBFyLAYVhljXzdurwcNXt1BMbmURyF4kXlGk-JOTyWUipcKzCyczQVzdS7Q3sKi8aM7ggdqzzi1P5SnRU-AFVxbWcPKxXRaKLbOROX-bH4V_OCikDqH_AJZYX_cLumUUvg',
    logo: null,
    demo_support: true,
    label: 'JACKPOT',
    label_bg_color: '#fed01b',
    icon: 'bolt',
    is_crash: false,
    is_top_game: true,
    provider: 1
  },
  {
    uuid: 'g2',
    slug: 'sweet-bonanza',
    name: 'Sweet Bonanza',
    description: 'Colorful candy and floating sweets. A sugary adventure awaits.',
    order: 2,
    default_logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhtgFvkiMQ9COsfBnLY6OsoNAP6K7eoNibZqhXafL3aeWPSK7ZolBiC6x5CL-6mEYexMwTuZ9J3kLXuWsD5_7uHeZiYeh_TnLbWh1S4Xy9c4PipHREl06C-WiXuh5EhQegYKQt9iCvP2UiRS45Sc8kS822-zG3vR9XcowzHjbDkL27gwxk5Q3SJSWLLgYQVmVonzmXB6hTWAAc8CbYwe0l5xipYG9T0S5E8thlWEffIkLpv8aNYU31ztNI2kwvgNWOhZwhR7Clel8',
    logo: null,
    demo_support: true,
    label: 'HOT',
    label_bg_color: '#a7a5ff',
    icon: 'local_fire_department',
    is_crash: false,
    is_top_game: true,
    provider: 1
  },
  {
    uuid: 'g3',
    slug: 'nebula-mines',
    name: 'Nebula Mines',
    description: 'Floating glowing crystals in dark cave. Mine the riches of the galaxy.',
    order: 3,
    default_logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlO0YYj3a6Nu3WfcKVcJxtcJrqzo7RlOljAVhZptaIkSsFx2VrCtHGL7mkHZbEqp3wBi6hnR9RFxKy3PTz-ZDvSKGrksRp12ch7JE34lkQhHriqA1vjR6HvY9K-p-U8S7fB4MXNx771QCBoy83ZS82gqD1IPebM_ugwwTeecIW3xg1_ARDmw2Ih834wzwYIQE1tsB8hC0YL6uxo7d75wKxc7TL8LRi7ESws2RW3Hu2FoLEkZih2P1jHHFX-4mDb0oXHN8W44uRHM8',
    logo: null,
    demo_support: true,
    label: 'ORIGINALS',
    label_bg_color: '#a7a5ff',
    icon: 'rocket_launch',
    is_crash: false,
    is_top_game: true,
    provider: 2
  },
  {
    uuid: 'g4',
    slug: 'cyber-rush',
    name: 'Cyber Rush',
    description: 'Retro neon computer monitor glowing. Speed through the digital grid.',
    order: 4,
    default_logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKVEG6a1sUvQc2Pf_QduHrssGeXZ3QNkhlRMO1M_Lu_GCaSQak2ERO0W0pac_vpQ44iMIr266wARPgEjo7NG_5IyyHUdIPowYo97xl2V1CGn21lcCtEEiTylWPXYlVEpjDDCC-AQt_s4pYbLFKRu4HiGVcfylRW0VKwTcwvKmsuaTnNX2D75Up7T2nphmkFe1Un9oo0mWcAR-_C3aWvsIfX2dc-aAH6rBmxk3sA-ogzw8tnJz0bvfj_79QXHymVSEb_UOoCR-70WY',
    logo: null,
    demo_support: true,
    label: '5000X',
    label_bg_color: '#c081ff',
    icon: 'speed',
    is_crash: true,
    is_top_game: true,
    provider: 3
  },
  {
    uuid: 'g5',
    slug: 'neon-strike',
    name: 'Neon Strike',
    description: 'Neon glowing lightning bolt on dark background.',
    order: 5,
    default_logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6Z1O1S7k7L3Q-7C-Vv6L5n7X3F8Y9R0Q1W2E3R4T5Y6U7I8O9P0A1S2D3F4G5H6J7K8L9Z0X1C2V3B4N5M6Q',
    logo: null,
    demo_support: true,
    label: null,
    label_bg_color: null,
    icon: 'electric_bolt',
    is_crash: false,
    is_top_game: false,
    provider: 2
  },
  {
    uuid: 'g6',
    slug: 'golden-quest',
    name: 'Golden Quest',
    description: 'Golden treasure chest glowing in dark temple.',
    order: 6,
    default_logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQBD_EylI0acN06g2u2X5PCoT5J5SiwHTzqKwXFaAMhtkS4jCIzcBrhqmDQjRZpKBetb4vggo3IXdTskINYwTIF_FnDeN7GIHphm2T56ROE3qVfBhue8vpoSn6vlnzZbUJr8oB5iPHKgMSPLCHIJrNZDd7iZvf17ejnFieW-nZtTxd7RXDGb-oVXqJhy-wsGwtvcJJQ4MQBydpmPmL8rE-lffJbo0jDK2aHdG8ew-81mHhsarFyt3-_VtYja11_vVRDFkoHKitmdg',
    logo: null,
    demo_support: true,
    label: null,
    label_bg_color: null,
    icon: 'redeem',
    is_crash: false,
    is_top_game: false,
    provider: 4
  }
];

export const MOCK_BANNERS: PromotionBanner[] = [
  {
    id: 1,
    location_display: "Main",
    created_at: "2026-01-30T16:14:40.638286Z",
    updated_at: "2026-01-30T16:39:57.074936Z",
    title: "$50,000 WEEKLY NEBULA",
    description: "Enter the draw for a chance to win big every week.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQBD_EylI0acN06g2u2X5PCoT5J5SiwHTzqKwXFaAMhtkS4jCIzcBrhqmDQjRZpKBetb4vggo3IXdTskINYwTIF_FnDeN7GIHphm2T56ROE3qVfBhue8vpoSn6vlnzZbUJr8oB5iPHKgMSPLCHIJrNZDd7iZvf17ejnFieW-nZtTxd7RXDGb-oVXqJhy-wsGwtvcJJQ4MQBydpmPmL8rE-lffJbo0jDK2aHdG8ew-81mHhsarFyt3-_VtYja11_vVRDFkoHKitmdg",
    link: "#",
    button_text: "Enter Draw",
    location: 1,
    start_date: null,
    end_date: null,
    is_active: true,
  }
];

export const MOCK_WALLET: PlayerWallet = {
  balance: 12450.00,
  withdrawable_balance: "11250.00",
  non_withdrawable_balance: "1200.00",
  is_active: true,
};

export const MOCK_ACTIVITY: DepositOrder[] = [
  {
    uuid: "nb-9821",
    user_name: "NeonPlayer",
    user_phone: "123456789",
    agent_nickname: "System",
    deposited_by_agent_nickname: null,
    deposited_by_agent_phone: null,
    account_number: "xxxx-9821",
    account_name: "NeonPlayer",
    bank_name: "Bank Transfer",
    amount: "2500.00",
    status: "completed",
    status_display: "Completed",
    reference_number: "REF-9821",
    receipt: null,
    expires_at: "2026-03-22T22:10:14Z",
    created_at: "2026-03-21T14:20:00Z",
    updated_at: "2026-03-21T14:25:00Z",
  },
  {
    uuid: "nb-9744",
    user_name: "NeonPlayer",
    user_phone: "123456789",
    agent_nickname: "System",
    deposited_by_agent_nickname: null,
    deposited_by_agent_phone: null,
    account_number: "bc1q...",
    account_name: "Crypto Wallet",
    bank_name: "Crypto Withdrawal",
    amount: "-500.00",
    status: "processing",
    status_display: "Processing",
    reference_number: "REF-9744",
    receipt: null,
    expires_at: "2026-03-22T22:10:14Z",
    created_at: "2026-03-21T09:12:00Z",
    updated_at: "2026-03-21T09:15:00Z",
  }
];

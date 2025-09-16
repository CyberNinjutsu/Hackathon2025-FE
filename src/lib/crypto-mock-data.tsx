import React from 'react';
import { Bitcoin, Ethereum } from './crypto-icons';

export type Crypto = {
  name: string;
  ticker: string;
  Icon: React.ElementType;
  price: string;
  change: number;
  iconBgColor: string;
};

// Component to render ETH image as an icon

export const cryptos: Crypto[] = [
  { name: 'Bitcoin', ticker: 'BTC', Icon: Bitcoin, price: '68,420.10', change: 1.25, iconBgColor: 'bg-[#f7931a]' },
  { name: 'Ethereum', ticker: 'ETH', Icon: Ethereum, price: '3,510.88', change: -0.55, iconBgColor: 'bg-[#627eea]' },
  { name: 'Solana', ticker: 'SOL', price: '165.72', change: 3.1, Icon: () => <div className="font-bold text-black">S</div>, iconBgColor: 'bg-[#00ffa3]' },
  { name: 'XRP', ticker: 'XRP', price: '0.489', change: -1.2, Icon: () => <div className="font-bold text-white">X</div>, iconBgColor: 'bg-[#23292f]' },
  { name: 'Dash', ticker: 'DASH', price: '28.15', change: 2.5, Icon: () => <div className="font-bold text-white">D</div>, iconBgColor: 'bg-[#008ce7]' },
];
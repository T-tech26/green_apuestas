'use client'
import Bets from '@/components/Bets';
import HomeMain from '@/components/HomeMain';
import LiveChat from '@/components/LiveChat';
import MobileBets from '@/components/MobileBets';
import MobileHomeMenu from '@/components/MobileHomeMenu';
import React, { useState } from 'react';

const Home = () => {
    const [selectedLink, setSelectedLink] = useState<string>('Home');

    return (
        <main className="flex-1 flex justify-between bg-dark-gradient-180deg-reverse">
            <HomeMain />
            <Bets />
            <MobileHomeMenu selectedLink={selectedLink} setSelectedLink={setSelectedLink} />
            <MobileBets selectedLink={selectedLink} setSelectedLink={setSelectedLink} type="Betslip" />
            <MobileBets selectedLink={selectedLink} setSelectedLink={setSelectedLink} type="Bets" />
            <LiveChat />
        </main>
    );
};

export default Home;
'use client'

import { checkLeaguesInLocalStorage, fetchAllMatches } from "@/lib/apiUtils";
import { LeagueType, Match, Popular } from "@/types/globals";
import { createContext, useState, ReactNode, useContext, useEffect } from "react";

export const LeagueContext = createContext<LeagueType | undefined>(undefined);


export const LeagueProvider = ({ children }: { children: ReactNode }) => {
    const [leagueID, setLeagueID] = useState<number | undefined>(undefined);
    const [leagues, setLeagues] = useState<Popular[]>([]);

    const [todayMatches, setTodayMatches] = useState<{ matches: Match[] }>({ matches: [] });
    const [tomorrowMatches, setTomorrowMatches] = useState<{ matches: Match[] }>({ matches: [] });
    const [otherDayMatches, setOtherDayMatches] = useState<{ matches: Match[] }>({ matches: [] });


    useEffect(() => {
        checkLeaguesInLocalStorage(setLeagues);
    }, []);

    useEffect(() => {
        if(leagues.length > 0) {
            setLeagueID(leagues[0].id);
        }
    }, [leagues]);

    // Fetching alll matches by leagues
    useEffect(() => {
        fetchAllMatches(leagueID, setTodayMatches, setTomorrowMatches, setOtherDayMatches);
    }, [leagueID]);


    return (
        <LeagueContext.Provider value={{ 
            leagueID, setLeagueID, leagues, setLeagues, 
            todayMatches, setTodayMatches, tomorrowMatches, setTomorrowMatches, 
            otherDayMatches, setOtherDayMatches
        }}>
            {children}
        </LeagueContext.Provider>
    );
};

export const useLeague = (): LeagueType => {
    const context = useContext(LeagueContext);
    if (!context) {
        throw new Error('useLeague must be used within a LeagueProvider');
    }
    return context;
};
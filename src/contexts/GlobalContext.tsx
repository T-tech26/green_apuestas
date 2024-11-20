import { LeagueProvider } from "./child_context/leagueContext";
import { ReactNode } from "react";


export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    return (
        <LeagueProvider>
            {children}
        </LeagueProvider>
    );
};
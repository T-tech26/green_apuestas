import { LeagueProvider } from "./child_context/leagueContext";
import { UserProvider } from "./child_context/userContext";
import { ReactNode } from "react";


export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    return (
        <LeagueProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </LeagueProvider>
    );
};
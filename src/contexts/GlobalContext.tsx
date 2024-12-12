import { LeagueProvider } from "./child_context/leagueContext";
import { OtherProvider } from "./child_context/otherContext";
import { UserProvider } from "./child_context/userContext";
import { ReactNode } from "react";


export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    return (
        <LeagueProvider>
            <OtherProvider>
                <UserProvider>
                    {children}
                </UserProvider>
            </OtherProvider>
        </LeagueProvider>
    );
};
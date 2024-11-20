import { LiveMatch, Match, Popular } from "@/types/globals";
import { leagues } from "./api/leagues";
import { eventsByLeague } from "./api/eventsByLeague";
import { liveScores } from "./api/liveScores";


export const fetchLeagues = async (
  setLeagues: React.Dispatch<React.SetStateAction<Popular[]>>
) => {
  try {
    const fetchedData = await leagues();
    setLeagues(fetchedData);

    // Store the leagues in localStorage along with a timestamp
    const timestamp = Date.now();
    localStorage.setItem('leagues', JSON.stringify({ leagues: fetchedData, timestamp }));

  } catch (err) {
    console.error(err)
  }
};


export const checkLeaguesInLocalStorage = (
  setLeagues: React.Dispatch<React.SetStateAction<Popular[]>>
) => {
  const storedData = localStorage.getItem('leagues');

  if (storedData) {
    const { leagues: fetchedData, timestamp }: { leagues: Popular[], timestamp: number } = JSON.parse(storedData);

    // Check if data is older than 24 hours (86400000 ms)
    const oneDayInMillis = 86400000;
    const currentTime = Date.now();

    if (currentTime - timestamp > oneDayInMillis) {
        // If more than 24 hours have passed, refetch leagues
        fetchLeagues(setLeagues);
    } else {
        // If less than 24 hours, use stored leagues
        setLeagues(fetchedData);
    }
  } else {
      // If no data in localStorage, fetch the leagues
      fetchLeagues(setLeagues);
  }
}


export const fetchAllMatches = async (
  leagueID: number | undefined,
  setTodayMatches: React.Dispatch<React.SetStateAction<{ matches: Match[] }>>,
  setTomorrowMatches: React.Dispatch<React.SetStateAction<{ matches: Match[] }>>,
  setOtherDayMatches: React.Dispatch<React.SetStateAction<{ matches: Match[] }>>
) => {

  if (leagueID === undefined) return;

  const oneDayInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const currentTime = Date.now();

  // Check if the matches data is in localStorage
  const todayData = localStorage.getItem(`today-${leagueID}`);
  const tomorrowData = localStorage.getItem(`tomorrow-${leagueID}`);
  const otherDaysData = localStorage.getItem(`other-days-${leagueID}`);

  if (todayData && tomorrowData && otherDaysData) {
    // Parse the data and the timestamp from localStorage
    const { matches: todayMatches, timestamp: todayTimestamp }: { matches: Match[], timestamp: number } = JSON.parse(todayData);
    const { matches: tomorrowMatches, timestamp: tomorrowTimestamp }: { matches: Match[], timestamp: number } = JSON.parse(tomorrowData);
    const { matches: otherDayMatches, timestamp: otherDaysTimestamp }: { matches: Match[], timestamp: number } = JSON.parse(otherDaysData);

    // Check if the data is older than 24 hours
    if (currentTime - todayTimestamp < oneDayInMillis && currentTime - tomorrowTimestamp < oneDayInMillis && currentTime - otherDaysTimestamp < oneDayInMillis) {
      // Data is still valid, use it
      setTodayMatches({ matches: todayMatches });
      setTomorrowMatches({ matches: tomorrowMatches });
      setOtherDayMatches({ matches: otherDayMatches });
      return; // Skip fetching new data
    }
  }

  // Data is either not in localStorage or has expired, fetch new data
  try {
    const matches = await eventsByLeague(leagueID);
    const filteredMatches = filterDatesInCurrentMonth(matches);
    
    const todayMatches = checkDateStatus(filteredMatches, 'today');
    const tomorrowMatches = checkDateStatus(filteredMatches, 'tomorrow');
    const otherDayMatches = checkDateStatus(filteredMatches, 'other days');

    // Set the fetched matches to state
    setTodayMatches(todayMatches);
    setTomorrowMatches(tomorrowMatches);
    setOtherDayMatches(otherDayMatches);

    // Store the fetched data and timestamps in localStorage
    const timestamp = Date.now();
    const todayDataToStore = { matches: todayMatches.matches, timestamp };
    const tomorrowDataToStore = { matches: tomorrowMatches.matches, timestamp };
    const otherDaysDataToStore = { matches: otherDayMatches.matches, timestamp };

    localStorage.setItem(`today-${leagueID}`, JSON.stringify(todayDataToStore));
    localStorage.setItem(`tomorrow-${leagueID}`, JSON.stringify(tomorrowDataToStore));
    localStorage.setItem(`other-days-${leagueID}`, JSON.stringify(otherDaysDataToStore));

  } catch (err) {
    console.error('Error fetching matches:', err);
  }
};


export const filterDatesInCurrentMonth = (
  matchesByLeague: { matches: Match[] }
) => {
    // Get the current date
    const currentDate = new Date();

    // Calculate the date 30 days from now
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 30); // 30 days from now

    // This will hold the filtered leagues with the relevant matches
    let filteredLeagues: { matches: Match[] } = { matches: [] };

    
    // Filter the matches for the current league
    const filteredMatches = matchesByLeague.matches.filter(match => {
      // Parse the match's UTC time
      const matchDate = match.status ? new Date(match.status.utcTime) : null;

      // Check if the match is within the next 30 days
      return matchDate && matchDate >= currentDate && matchDate <= endDate;
    });

    // If there are filtered matches, include them in the result
    if (filteredMatches.length > 0) {
      filteredLeagues.matches = filteredMatches;
    }

    return filteredLeagues; // Return the leagues with only matches within the next 30 days
};


export const checkDateStatus = (
  filteredMatches: { matches: Match[] }, 
  type: string
  ) => {
  const today = new Date();
  const tomorrow = new Date(today);
  
  // Set both to midnight to only compare the date part
  today.setHours(0, 0, 0, 0); 
  tomorrow.setDate(today.getDate() + 1); // Increment by 1 for tomorrow
  tomorrow.setHours(0, 0, 0, 0); // Reset time to midnight for tomorrow

  const result = filteredMatches.matches.filter(match => {
    if (match.status?.utcTime) {
      const matchDate = new Date(match.status?.utcTime);
      matchDate.setHours(0, 0, 0, 0); // Set match time to midnight for comparison

      if (type === 'today') {
        // Compare match date with today
        return matchDate.getTime() === today.getTime();
      }

      if (type === 'tomorrow') {
        // Compare match date with tomorrow
        return matchDate.getTime() === tomorrow.getTime();
      }

      if (type === 'other days') {
        // Exclude today and tomorrow
        return matchDate.getTime() !== today.getTime() && matchDate.getTime() !== tomorrow.getTime();
      }
    }
    return false; // Exclude matches with no valid date
  });

  // Return the filtered matches wrapped in an object with `matches` key
  return { matches: result };
};


// Helper function to format date as 'DD MMM'
const formatDate = (date: string | number | Date) => {
  const matchDate = new Date(date);
  return matchDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); // '20 Nov'
};


// Function to group matches by date
export const groupMatchesByDate = (matches: { matches: Match[]}) => {
  return matches.matches.reduce((acc: { [date: string]: Match[] }, match: Match) => {
      const matchDate = match.status && formatDate(match.status?.utcTime);

      if(matchDate)
        if (!acc[matchDate]) {
            acc[matchDate] = [];
        }
      
      if(matchDate) acc[matchDate].push(match);
      return acc;
  }, {});
};


export const fetchLiveMatches = async (
  setLives: React.Dispatch<React.SetStateAction<LiveMatch[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const liveMatches = await liveScores();
    setLives(liveMatches.live);
  } catch (err) {
      setIsLoading(false);
      console.error(err)
  } finally {
    setIsLoading(false);
  }
}
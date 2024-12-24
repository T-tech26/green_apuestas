'use server'

import axios from 'axios';

interface Options {
    method: string;
    url: string;
    params: {
      leagueid: number | undefined;
    };
    headers: {
      'x-rapidapi-key': string;
      'x-rapidapi-host': string;
    };
  }
  
const createOptions = (leagueid: number | undefined): Options => {
    return {
        method: 'GET',
        url: 'https://free-api-live-football-data.p.rapidapi.com/football-get-all-matches-by-league',
        params: { leagueid },
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY!,
            'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
        }
    };
};


export const eventsByLeague = async (id: number | undefined) => {
    try {
        const response = await axios.request(createOptions(id));
        return response.data.response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
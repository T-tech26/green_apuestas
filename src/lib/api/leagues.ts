'use server'

import axios from 'axios';

const options = {
    method: 'GET',
    url: 'https://free-api-live-football-data.p.rapidapi.com/football-get-all-leagues-with-countries',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY!,
      'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
    }
  };


export const leagues = async () => {
    try {
        const response = await axios.request(options);
        if(!response.data.response) return [];
        return response.data.response.leagues;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
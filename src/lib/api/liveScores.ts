'use server'

import axios from 'axios';

const options = {
    method: 'GET',
    url: 'https://free-api-live-football-data.p.rapidapi.com/football-current-live',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY!,
      'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
    }
  };


export const liveScores = async () => {
    try {
        const response = await axios.request(options);
        return response.data.response;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
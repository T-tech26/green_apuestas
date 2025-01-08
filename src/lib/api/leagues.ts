'use server'

import axios from 'axios';

const options = {
    method: 'GET',
    url: 'https://free-api-live-football-data.p.rapidapi.com/football-popular-leagues',
    headers: {
      'x-rapidapi-key': process.env.RAPID_API_KEY!,
      'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com'
    }
  };


export const leagues = async () => {
    try {
        const response = await axios.request(options);
        console.log(response.data.response)
        if(!response.data.response) return [];
        return response.data.response.popular;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
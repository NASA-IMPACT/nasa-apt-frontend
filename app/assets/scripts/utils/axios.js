import axios from 'axios';

import config from '../config';

// Create an axios instance for the api requests.
export const axiosAPI = axios.create({
  baseURL: config.apiUrl
});

import axios from 'axios';

import { SESSION_ID } from '../constants';

const apiClient = axios.create({
  baseURL: `https://challenge.surfe.com/${SESSION_ID}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default apiClient;

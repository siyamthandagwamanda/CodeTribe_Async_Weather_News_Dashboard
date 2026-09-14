import https from 'https'

type Callback<T> = (error: Error | null, data?: T) => void;

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-29.6168&longitude=30.3928&current_weather=true';
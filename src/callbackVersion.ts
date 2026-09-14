import https from 'https'

type Callback<ResponseData> = (error: Error | null, data?: T) => void;

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-29.6168&longitude=30.3928&current_weather=true';

interface WeatherResponse{
    current_weather:
    {
        temperature: number;
        windspeed: number;
        weathercode: number;
        time: string;
    }
}

interface Post{
    id: number;
    title: string;
}

interface NewsResponse{
    posts: Post[];
}
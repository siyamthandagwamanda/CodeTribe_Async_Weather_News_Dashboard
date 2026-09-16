import http from 'https';
import { resolve } from 'path';

const WEATHER_URL =  'https://api.open-meteo.com/v1/forecast?latitude=-29.6168&longitude=30.3928&current_weather=true';

const NEWS_URL = 'https://dummyjson.com/posts?limit=5';

interface WeatherResponse{
    current_weather: {
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

function fetchJSON<ResponseData>(url: string): Promise<ResponseData>{
    return new Promise ((resolve, reject) => {
        const request = http.get(url, (res) => {
            const {statusCode} = res;
            let raw = ''

            if (statusCode && (statusCode < 200 || statusCode >= 300)){
                res.resume();
                reject(new Error (`Request to ${url} failed with status code ${statusCode}`));
                return;
            }

            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                raw += chunk
            });
            res.on('end', () => {
                try{
                    resolve(JSON.parse(raw) as ResponseData);
                }catch (err){
                    reject(new Error (`Failed to parse JSON from ${url}: ${(err as Error).message}`))
                }
            });
        });

        request.on('error', (err) => {
            reject(new Error(`Network error while requesting ${url}: ${err.message}`))
        });
    });
}

function fetchWeather(): Promise<WeatherResponse>{
    return fetchJSON<WeatherResponse>(WEATHER_URL);
}

function fetchNews(): Promise<NewsResponse>{
    return fetchJSON<NewsResponse>(NEWS_URL);
}

function displayResults(label: string, weather: WeatherResponse, news: NewsResponse): void{
    
}
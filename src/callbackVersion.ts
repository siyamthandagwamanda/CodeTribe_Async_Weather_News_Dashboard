import https from 'https'

type Callback<ResponseData> = (error: Error | null, data?: ResponseData) => void;

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=-29.6168&longitude=30.3928&current_weather=true';

const NEWS_URL = 'https://dummyjson.com/posts?limit=5';

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

function fetchJSON<ResponseData>(url: string, callback: Callback<ResponseData>): void{
    const request = https.get(url, (res) => {
        const {statusCode} = res;
        let raw = '';

        if (statusCode && (statusCode < 200 || statusCode >= 300)){
            res.resume();
            callback(new Error (`Request to ${url} failed with status code ${statusCode}`));
            return;
        }

        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            raw += chunk;
        });

        res.on('end', () => {
            try{
                callback(null, JSON.parse(raw) as ResponseData)
            }catch(err){
                callback(new Error (`Failed to parse JSON from ${url}: ${(err as Error).message}`))
            }
        });
    });

    request.on ('error', (err) => {
        callback(new Error(`Network error while requesting ${url}: ${err.message}`))
    });
}

function fetchWeather(callback: Callback<WeatherResponse>): void{
    fetchJSON<WeatherResponse>(WEATHER_URL, callback);
}

function fetchNews(callback: Callback<NewsResponse>): void{
    fetchJSON<NewsResponse>(NEWS_URL, callback);
}
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
    fetchJSON<NewsResponse>(NEWS_URL, callback)
}

function displayResults(weather: WeatherResponse, news: NewsResponse): void {
    console.log('\n===== Callback Version Results =====');
    
  
    console.log(`Current temperature: ${weather.current_weather.temperature}°C, wind ${weather.current_weather.windspeed} km/h`);

    console.log('Latest headlines:');
    
    try {
        news.posts
            .slice(0, 5)
            .map((post, i) => ` ${i + 1}. ${post.title}`)
            .forEach((item) => console.log(item)); 
          
    } catch (error) {
        console.error("Failed to display news posts:", error instanceof Error ? error.message : error);
    }

    console.log('======================\n');
}

function displayError(context: string, error: Error): void{
    console.error(`[ERROR] (${context}) (${error.message})`)
}

console.log('Fetching Pietermaritzburg weather (callback style)....');

fetchWeather((weatherErr, weather) => {
    if(weatherErr){
        displayError('Weather', weatherErr);
        return;
    }

    console.log('Weather received. Now fetching dummy news (nested callbacks)....');

    fetchNews((newsErr, news) => {
        if (newsErr){
            displayError('News', newsErr);
            return;
        }

        displayResults(weather as WeatherResponse, news as NewsResponse);
    });
});
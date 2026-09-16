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
    console.log(`\n========== ${label} ===========`);
    console.log(
        `Current temperature: ${weather.current_weather.temperature}°C, wind ${weather.current_weather.windspeed} km/h`
    );
    console.log('Latest headlines: ');

    try{
    
    news?.posts
       ?.slice(0, 5)
       .map((post, i) => `${i + 1}. ${post.title}`)
       .forEach((item) => console.log(item));
    }catch (error){
    
    console.log(`${'='.repeat(label.length + 12)}\n`);
    }
}

function displayError(context: string, error: unknown): void{
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[ERROR] (${context}) ${message}`)
}

async function runSequential(): Promise<void>{
    console.log(`[Sequential await] Fetching weather, then news...`);
    try{
        const weather = await fetchWeather();
        const news = await fetchNews();
        displayResults('SEQUENTIAL ASYNC/AWAIT', weather, news);
    }catch(err){
        displayError('sequential', err);
    }
}

async function runConcurrent(): Promise<void>{
    console.log('[Promise.all + await] Fetching weather + news concurrently...');
    try{
        const [weather, news] = await Promise.all([fetchWeather(), fetchNews()]);
        displayResults(' CONCURRENT ASYNC/AWAIT (Promise.all)', weather, news);
    }catch (err){
        displayError('Concurrent', err);
    }
}

async function runRace(): Promise<void>{
    console.log('[Promise.race + await] Racing weather vs news....');
    try{
    
    const winner = await Promise.race([
        fetchWeather().then((data) => ({ source: 'weather', data})),
        fetchNews().then((data) => ({ source: 'news', data})),
    ]);
    console.log('\n====== PROMISE.RACE RESULTS (ASYNC/AWAIT) =======');
    console.log(`Fatest response came from: ${winner.source}`);
    console.log('=================================================')

    }catch (err){
        displayError('Race', err)
    }
}

async function main(): Promise<void>{
    await runSequential();
    await runConcurrent();
    await runRace();
}

main();
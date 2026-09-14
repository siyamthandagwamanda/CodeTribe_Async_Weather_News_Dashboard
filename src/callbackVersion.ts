import https from 'https'

type Callback<T> = (error: Error | null, data?: T) => void;
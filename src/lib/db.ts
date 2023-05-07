import mysql from 'serverless-mysql';

export const config =    {
  host:      process.env.DB_HOST,
  database:  process.env.DB,
  user:      process.env.DB_USER,
  password:  process.env.DB_USER_PASSWORD
};

console.log('config: ', config);

const db = mysql({
  config:config
});

export interface PostData {
  created_at: string
  id: number
  title: string
  post: string
  updated_at: string
}

export interface PostDataResponse {
  data?: PostData[]
  error?: Error
}

export async function connectBlogDB() {
  console.log('db: ', process.env.DB_USER);
    const connection = await db.connect()
    console.log('connection: ', connection);
    return connection;
}

export async function establishConnection() {
  try {
    const connection = await db.connect()
    const results = await db.query('Use heroku_f2880a1cf346d77;')
   // await db.end()
    return results
  } catch (error) {
    return { error }
  }

}

export async function simpleQuery(query: string) {
  try {
    establishConnection() 
    const results = await db.query(query)
    await db.end()
    return results;
  } catch (error) {
    return { error }
  }
}

export async function getData() {
  try {
    const connection = await db.connect()
    const results = await db.query('SELECT * FROM heroku_f2880a1cf346d77.posts;')
    await db.end()
    return results
  } catch (error) {
    return { error }
  }
}
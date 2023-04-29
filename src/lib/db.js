import mysql from 'serverless-mysql';

const db = mysql({
  config: {
    host:      process.env.DB_HOST,
    database:  process.env.DB,
    user:      process.env.DB_USER,
    password:  process.env.DB_USER_PASSWORD
  }
});


export async function connectBlogDB() {
  console.log('db: ', process.env.DB_USER);
    const connection = db.connect()
    console.log('connection: ', connection);
}

export async function executeQuery({ query, values }) {
  try {

    const connection = await db.connect();
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}
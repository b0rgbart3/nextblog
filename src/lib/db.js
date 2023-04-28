import mysql from 'serverless-mysql';
const db = mysql({
  config: {
    host:      process.env.MYSQL_HOST,
    port:      process.env.MYSQL_PORT,
    database:  process.env.MYSQL_DB,
    user:      process.env.MYSQL_USER,
    password:  process.env.MYSQL_PW
  }
});

export async function connectBlogDB() {
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
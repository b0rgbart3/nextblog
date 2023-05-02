// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { establishConnection, getData, simpleQuery } from '@/lib/db'
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = { data: [{
    title: string,
    post: string}], error?: Error} 

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  // Get data submitted in request's body.
  //const body = req.body
  
    const query = req.query;
   // console.log('Query: ', query);

    const postToDelete = query.id;

  const queryString = `UPDATE Posts SET user_deleted = ${false} WHERE id = ${postToDelete};`
  console.log('Query: ', queryString);
  simpleQuery(queryString)

  const data: Data = await getData() as Data

 // console.log('GOT DATA From database: ', data);

  if (data.error) {
    res.status(400);
  } 


  res.status(200).json(data);
}


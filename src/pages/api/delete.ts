// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { establishConnection, getData, simpleQuery } from '../../lib/db'
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

  const queryString = `DELETE FROM Posts WHERE id = ${postToDelete};`
  console.log('Query: ', queryString);
  simpleQuery(queryString)

  const data: Data = await getData() as Data

  const dataArray: any = JSON.parse(JSON.stringify(data));
  //dataArray.sort( compare );
  if (dataArray.error) {
    res.status(400);
  } 
 
  //let newList = merge_sort(dataArray);
 // console.log('newItems: ', sorted);
  res.status(200).json({data: dataArray});
}


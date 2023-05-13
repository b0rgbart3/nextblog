// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getData, PostDataResponse } from '../../lib/db';
import NextCors from 'nextjs-cors';
import { merge_sort } from '../../../sortTest';

export interface Post {
  id?: number;
    title: string;
    post?: string;
    created_at?: string;
    user_deleted?: boolean;
    updated_at?: string;
}

type Data = { data: Post[], error?: Error} 

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>) {

    await NextCors(req, res, {
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });


  // Get data submitted in request's body.
  const body = req.body
  

  //console.log('In the API');
  // Optional logging to see the responses
  // in the command line where next.js app is running.
//   console.log('body: ', body)

  //connectBlogDB();
  //console.log('back from connecting, about to send back data');

  
  const data: Data = await getData() as Data
  
  console.log('GOT DATA From database: ', data);
  // Guard clause checks for first and last name,
  // and returns early if they are not found
//   if (!body.title || !body.post) {
//     // Sends a HTTP bad request error code
//     return res.status(400).json({ data: {title:'First or last name not found', post:'' }})
//   }

  // Found the name.
  // Sends a HTTP success code
  if (data.error) {
    console.log('GOT AN ERROR!');
    res.status(500).json(data);
  } 
  
  const dataArray: any = JSON.parse(JSON.stringify(data));
  //dataArray.sort( compare );
  if (dataArray.error) {
    res.status(400);
  } 
 
  let newList = merge_sort(dataArray);
 // console.log('newItems: ', sorted);
  res.status(200).json({data: newList});
}



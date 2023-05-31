// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getData, PostDataResponse } from '../../lib/db';
import NextCors from 'nextjs-cors';
import { merge_sort } from '../../../sortTest';
import { sortByColumn } from '../../lib/sorting';

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

  const data: Data = await getData() as Data

  if (data.error) {
    console.log('GOT AN ERROR!');
    return res.status(500).json(data);
  } 
  
  const dataArray: any = JSON.parse(JSON.stringify(data));

  if (dataArray.error) {
    return res.status(400);
  } 
 
  return res.status(200).json({data: dataArray});
}



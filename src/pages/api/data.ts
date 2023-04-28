// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectBlogDB, executeQuery } from '../../lib/db';
type Data = { data: [{
  title: string,
  post: string
}]
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  // Get data submitted in request's body.
  const body = req.body
  

  console.log('In the API');
  // Optional logging to see the responses
  // in the command line where next.js app is running.
//   console.log('body: ', body)

  connectBlogDB();
  console.log('back from connecting, about to send back data');

  const data = await executeQuery({query: 'SELECT * FROM blogger.Posts', values:''});
  
  console.log('GOT DATA From database: ', data);
  // Guard clause checks for first and last name,
  // and returns early if they are not found
//   if (!body.title || !body.post) {
//     // Sends a HTTP bad request error code
//     return res.status(400).json({ data: {title:'First or last name not found', post:'' }})
//   }

  // Found the name.
  // Sends a HTTP success code
  res.status(200).json({data: data });
}


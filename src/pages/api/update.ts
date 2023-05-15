// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { establishConnection, simpleQuery } from '@/lib/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Post } from '..'

type Data = { data: {
    title: string,
    post: string
  }
  }

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse<Data>) {
  // Get data submitted in request's body.
  const body = req.body
  

  // Optional logging to see the responses
  // in the command line where next.js app is running.
  console.log('body: ', body)


  // connectBlogDB();


  // connectBlogDB();


  //connectBlogDB();



  // Guard clause checks for first and last name,
  // and returns early if they are not found
//   if (!body.title || !body.post) {
//     // Sends a HTTP bad request error code
//     return res.status(400)
//   }

 
    establishConnection();
    const queryString = `UPDATE Posts SET title = '${body.title}', post= '${body.post}', updated_at = NOW() WHERE id='${body.id}';`
    console.log('My query: ', queryString);
    const response = simpleQuery(queryString)

    return res.status(200).json({ data: { title:body.title, post: body.post}})
}


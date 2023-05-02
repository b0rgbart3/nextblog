// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { establishConnection, simpleQuery } from '@/lib/db'
import type { NextApiRequest, NextApiResponse } from 'next'


type Data = { data: {
  title: string,
  post: string
}
}

export default function handler (
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
  if (!body.title || !body.post) {
    // Sends a HTTP bad request error code
    return res.status(400).json({ data: {title:'First or last name not found', post:'' }})
  }

  establishConnection();
  const queryString = `INSERT INTO Posts (title, post) VALUES ( '${body.title}', '${body.post}' );`
  console.log('My query: ', queryString);
  simpleQuery(queryString)
  

  // Found the name.
  // Sends a HTTP success code
  res.status(200).json({ data: { title:body.title, post: body.post}})
}


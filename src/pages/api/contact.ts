import type { NextApiRequest, NextApiResponse } from 'next'
import { getData, PostDataResponse } from '../../lib/db';
import NextCors from 'nextjs-cors';
import { merge_sort } from '../../../sortTest';
import { sortByColumn } from '../../lib/sorting';
import NodeMailer from 'nodemailer'
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';



export interface ContactMessage {
    subject: string;
    message: string;
  }


export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<ContactMessage>) {
  
      await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     });
  
     const body = req.body
     let transporter = NodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.GMAIL_USERNAME, // generated ethereal user
          pass: process.env.GMAIL_PASSWORD, // generated ethereal password
        },
      });

      const jsonData = [{test: 'test'}];

        // Define the CSV writer with the desired file path and column headers
        const csvWriter = createCsvWriter({
            path: 'output.csv',
            header: [
                { id: 'name', title: 'Name' },
                { id: 'age', title: 'Age' },
                { id: 'email', title: 'Email' }
            ]
        });

        csvWriter
    .writeRecords(jsonData)
    .then(() => console.log('CSV file has been written successfully'))
    .catch((error) => console.error('Error writing CSV file:', error));


      let textMessage = "You have received the following message from your contact form on your website.\t\n";
      textMessage += "--------------\t\n";
      textMessage += "From: b0rgbart3@gmail.com\t\n";
      textMessage += "Email: b0rgbart3@gmail.com\t\n";
      textMessage += "\t\n";
      textMessage += "Their Message:\t\n";
      textMessage += body.message;
      textMessage += "\t\n-------------\t\nEnd of Transmission.\t\n\t\n";
    
      let htmlMessage = "<div><h1>Message from your Sleepy Tundra website:</h1>";
      htmlMessage += "<p></p><h2>Their Message:</h2><p>" + body.message + "</p>";
      htmlMessage += "<p>----------</p><p>End of transmission.</p>";
      htmlMessage += "</div>";
    
    
      let info = await transporter.sendMail({
        from: '"Bart Dority" <b0rgBart3@gmail.com>', // sender address
        to: "b0rgBart3@gmail.com, bartdority@gmail.com", // list of receivers
        subject: "A Message from your sleepy tundra Website", // Subject line
        text: textMessage, // plain text body
        html: htmlMessage, // html body
      })
    
      console.log("Message sent: %s", info);

    return res.status(200);
  }
  


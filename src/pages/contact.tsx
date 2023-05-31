
import '@fortawesome/fontawesome-free/css/all.min.css'

import Link from 'next/link';
import { ReactEventHandler, useCallback, useEffect, useState } from 'react';
import { Post, renderSpinner } from './home';
import { sortByColumn } from '../lib/sorting';
import { htmlUnescape } from 'escape-goat';



export default function Contact() {
    const [pageData, setPageData] = useState<Post[]>([]) 
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [mainList, setMainList] = useState<Post[]>([])
    const [currentTitle, setCurrentTitle] = useState('')
    const [currentBody, setCurrentBody] = useState('')
    const [entryNumber, setEntryNumber] = useState(0)

        
    const grabData = useCallback(() => {

        setLoading(true)      
        
         fetch('/api/data')
           .then((res) => res.json())
           .then((data) => {
      
             //data = []
             // console.log('Getting data.');
             if (!data || !data.data || data.length < 1 || data.data.length < 1) {
               setError(true)
             } else {
         
                 data.data = sortByColumn(data.data, 'date', 'desc')
              
             setPageData(data)
             }
             setLoading(false)
             
           })
       //  }
       },[])
 
       useEffect(() => {
         grabData()
      
        }, [])


    const handleSubmit = useCallback(async (event: any ) => {
        event.preventDefault()
        event.stopPropagation()
        console.log('Submitted: ', event.target)

        const body = {subject: 'testSubject', message: 'testMessage'}
        const JSONdata = JSON.stringify(body)

        const endpoint = '/api/contact'

        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        }

        // Send the form data to our forms API on Vercel and get a response.

        console.log('About to send email: ',options);

        const response = await fetch(endpoint, options)

        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()

      },[ mainList, entryNumber])
      




  return (
    <>
    <div className='homelinkDiv'>
      <div className='homelink'><Link href="/">Back home</Link></div>
      <div className='homelink'><Link href="/home">The List</Link></div>
    </div>
       <form onSubmit={handleSubmit}>
        <input title='subject' placeholder='subject' id='subject' />
        <textarea title='message' placeholder='message' id='message' />
        <button type='submit'>SEND</button>
       </form>
    </>
  )
}




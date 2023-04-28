import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useCallback, useMemo } from 'react'
import { format } from 'date-fns'


const inter = Inter({ subsets: ['latin'] })

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('http://localhost:3000/api/data');

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  const posts = await res.json();
  console.log('GOT POSTS!: ', posts);


  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

// async function getData() {
//   const res = await fetch('/api/data');

//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.

//   // Recommendation: handle errors
//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error('Failed to fetch data');
//   }

//   const data = await res.json();
//   console.log('GOT DATA!: ', data);

// }
// getData();

export default function Home(props: any) {
 
  
  console.log('----------------------');
  console.log('PROPS: ', props);
  const posts = props.posts.data;

  const handlePost = useCallback((event: any) => {
    event.preventDefault();
    console.log('Event: ', event);
  }, []);

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Get data from the form.
    const data = {
      title: event.target.title.value,
      post: event.target.post.value,
    }

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/form'

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
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    alert(`Is this your post title: ${result.data.title}`)
  }

  return (
    <>
        <div className='mainList'>

    <div>Previous Musings</div>
    <div className='list'>

    <ul className='listItems'>
      {posts.length && (posts.map((post : any) => {
        const newDate = new Date(post.updatedAt);
        const dateString = format(newDate, 'MMM dd yyyy');
        return (
        <li key={post.title}>
          <div className='dates'>{dateString}</div>
          <div>{post.title}</div>
          <div className='bodyText'>{post.body}</div>
          {/* <div>{post.category}</div> */}
        </li>
      )})
      )}
    </ul>
    </div>




    </div>
    <div className='poster'>What&apos;s on your mind today?</div>

    <form onSubmit={handleSubmit} method="post">
      <input type='text' className='simpleInput' placeholder='Title' id='title'/><br></br>
      <textarea className='mainText' placeholder='What are you thinking?' id='post'/><br/>
      <button type='submit'>POST</button>
    </form>

    </>
  )
}

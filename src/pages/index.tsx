import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import '@fortawesome/fontawesome-free/css/all.min.css'


const inter = Inter({ subsets: ['latin'] })


export interface Post {
  created_at: string,
  title: string,
  post: string,
  user_deleted: boolean
}


export default function Home() {
 
  const [data, setData] = useState([]) 
  const [isLoading, setLoading] = useState(false)
  const [mainList, setMainList] = useState([])
  const [archiveList, setArchiveList] = useState([])
  const [tab, setTab] = useState(0)

  const selectTab = useCallback((selection: number) => {
    setTab(selection)
  },[])

  const setPageData = useCallback((data: any) => {
    console.log('got data: ', data)
    let mainListData = data.filter((post: any) => !post.user_deleted)
    console.log('Main: ', mainListData)
    let archiveListData = data.filter((post: any) => post.user_deleted)
    setMainList(mainListData)
    setArchiveList(archiveListData)
    setData(data)
  }, [])

  const grabData = useCallback(() => {
    setLoading(true)
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setPageData(data)
        setLoading(false)
      })
  },[])

  const deletePost = useCallback((post: any) => {

    console.log('Looking for post id: ', post.id);
    
    if (post.user_deleted) {
      setLoading(true)
      fetch('/api/restore?id=' + post.id)
        .then((res) => res.json())
       .then((data) => {
         setPageData(data)
        setLoading(false)
       })
    } else {
      setLoading(true)
         fetch('/api/delete?id=' + post.id)
           .then((res) => res.json())
          .then((data) => {
            setPageData(data)
           setLoading(false)
          })
        }

  },[])

  useEffect(() => {
   grabData()
  }, [])


  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Get data from the form.
    const data = {
      title: event.target.title.value,
      post: event.target.post.value,
    }

    if (data.title === undefined || data.post === undefined) {
      return;
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
    grabData()
  }

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No post data</p>

  return (
    <>
        <div className='mainList'>
<div className='tabs'>
    <div onClick={()=>selectTab(0)}>Previous Musings</div> <div onClick={()=>selectTab(1)}>Archived</div>
    </div>
    <div className='list'>

{tab === 0 && (
    <ul className='listItems'>
      {mainList && mainList.length && (mainList.map((post : any, index: number) => {
        // const newDate = new Date(post.updatedAt);
        // const dateString = format(newDate, 'MMM dd yyyy');
        const rowStyle = post.user_deleted ? 'markedAsDeleted' : '';
        const iconStyle = post.user_deleted ? 'fas fa-undo fa-trash-alt' : 'fas fa-trash-alt'
        return (
        <li key={post.id} className={rowStyle}>
          {/* <div className='dates'>{dateString}</div> */}
         
          <div>{post.title}</div>
          <div className='bodyText'>{post.post}</div>
          <div className='trash' onClick={()=>deletePost(post)}><i className={iconStyle}></i></div>
          {/* <div>{post.category}</div> */}
        </li>
      )})
      )}
    </ul>)}

    {tab === 1 && (
    <ul className='listItems'>
      {archiveList && archiveList.length && (archiveList.map((post : any, index: number) => {
        // const newDate = new Date(post.updatedAt);
        // const dateString = format(newDate, 'MMM dd yyyy');
        const rowStyle = post.user_deleted ? 'markedAsDeleted' : '';
        const iconStyle = post.user_deleted ? 'fas fa-undo fa-trash-alt' : 'fas fa-trash-alt'
        return (
        <li key={post.id} className={rowStyle}>
          {/* <div className='dates'>{dateString}</div> */}
         
          <div>{post.title}</div>
          <div className='bodyText'>{post.post}</div>
          <div className='trash' onClick={()=>deletePost(post)}><i className={iconStyle}></i></div>
          {/* <div>{post.category}</div> */}
        </li>
      )})
      )}
    </ul>)}
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

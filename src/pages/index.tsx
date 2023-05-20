import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { format, zonedTimeToUtc } from 'date-fns-tz'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { sortByColumn } from '@/lib/sorting'
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })


export interface Post {
  id: number,
  created_at: string,
  title: string,
  post: string,
  user_deleted: boolean,
  updated_at: string
}


export default function Landing() {
 
  const [data, setData] = useState<Post[]>([]) 
  const [isLoading, setLoading] = useState(false)
  const [mainList, setMainList] = useState<Post[]>([])
  const [archiveList, setArchiveList] = useState<Post[]>([])

  const [sortBy, setSortBy] = useState('')
  const [error, setError] = useState(false)
  const [tab, setTab] = useState(0)
  const [editPostId, setEditPostId] = useState(0)
  const [editingPostObject, setEditingPostObject] = useState({})
  const [editing, setEditing] = useState(false)
  const [dateFilterDirection, setDateFilterDirection] = useState('desc')
  const [timeFilterDirection, setTimeFilterDirection] = useState('asc')

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const storedData = localStorage.getItem('sortBy');
    console.log('loaded from local storage: ', storedData)
    if (storedData) {
      setSortBy(storedData);
    }
  }, []);


  const editPost = useCallback((postId: number) => {

    setEditPostId(postId)
    setTab(2)
    setEditing(true)
    let postToEdit = data.filter((post) => post.id === editPostId)
    setEditingPostObject(postToEdit)
    console.log('about to edit ', postToEdit)

  },[])

  const selectTab = useCallback((selection: number) => {
    console.log('Setting tab to :', selection);
    setTab(selection)
  },[])

  const chooseDate = useCallback(() => {
   // console.log('Sort by Date');
    let newMain: Post[] = sortByColumn(mainList, 'date', timeFilterDirection);
    setMainList(newMain)
    let newArchive: Post[] = sortByColumn(archiveList, 'date', timeFilterDirection);
    setArchiveList(newArchive)
    
    if (sortBy !== 'date') { 
      setSortBy('date')
    } else {
      if (dateFilterDirection === 'asc') {
        setDateFilterDirection('desc')
        let newMain: Post[] = sortByColumn(mainList, 'title', timeFilterDirection);
        setMainList(newMain)
        let newArchive: Post[] = sortByColumn(archiveList, 'title', timeFilterDirection);
        setArchiveList(newArchive)
      } else {
        setDateFilterDirection('asc')
        let newMain: Post[] = sortByColumn(mainList, 'title', timeFilterDirection);
        setMainList(newMain)
        let newArchive: Post[] = sortByColumn(archiveList, 'title', timeFilterDirection);
        setArchiveList(newArchive)
      }
    }

    localStorage.setItem('sortBy', 'date')
  },[mainList])
  
  const chooseTitle = useCallback(() => {
    console.log('Sort by Title');
    console.log('mainList: ', mainList);
    let newMain: Post[] = sortByColumn(mainList, 'title', timeFilterDirection);
    setMainList(newMain)
    let newArchive: Post[] = sortByColumn(archiveList, 'title', timeFilterDirection);
    setArchiveList(newArchive)
    setSortBy('title')
    localStorage.setItem('sortBy', 'title')
  },[mainList])

  const setPageData = useCallback((data: any) => {
    if (data && !data.error) {
    let mainListData = data.data.filter((post: any) => !post.user_deleted)
    let archiveListData = data.data.filter((post: any) => post.user_deleted)
    setMainList(mainListData)
    setArchiveList(archiveListData)
  
    setData(data.data)
    } else {
      setError(true)
    }
  }, [])

  const grabData = useCallback(() => {
    setLoading(true)
  
    if (sortBy && sortBy !==''){
   
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
 
        //data = []
        if (!data || !data.data || data.length < 1 || data.data.length < 1) {
          setError(true)
        } else {
          data.data = sortByColumn(data.data,sortBy, timeFilterDirection)
        setPageData(data)
        }
        setLoading(false)
        
      })
    }
  },[sortBy])

  const deletePost = useCallback((post: any) => {
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

  const cancelPost = useCallback((event:any) => {
    let postToEdit: Post[]
    let existingTitle = ''
    let existingPostBody = ''
    console.log('Edit post id: ', editPostId)
    postToEdit = data.filter((post) => post.id === editPostId)
      if (postToEdit[0]) {
        existingTitle = postToEdit[0].title
        existingPostBody = postToEdit[0].post
      }
      console.log('Editing: ', postToEdit)


    event.preventDefault()
    event.stopPropagation()
    let needToConfirm = false
    let confirmationString = 'Are you sure you want to cancel this post, and forget everything you wrote for it?'
    if (editing) {
      confirmationString = 'Are you sure you want to cancel the editing of this post, and all the changes you made?'
      const form = formRef.current as HTMLFormElement;
      
      const titleInput = form?.elements?.namedItem('title') as HTMLInputElement
      const title = titleInput?.value
    

      const postInput = form?.elements?.namedItem('post') as HTMLTextAreaElement
      const post = postInput?.value

      if ((title !== existingTitle) || (post !== existingPostBody)) {
        needToConfirm = true
      }

      
    }

    let cancel = false;
    if (needToConfirm) {
      cancel=confirm(confirmationString)
      if (cancel) {
        setTab(0)
        setEditing(false)
        setEditingPostObject({})
        setEditPostId(0)
        }
    } else {
        setTab(0)
        setEditing(false)
        setEditingPostObject({})
        setEditPostId(0)
    }

   
  }, [editing, editPostId, editingPostObject])

  useEffect(() => {
   grabData()
  }, [sortBy])

  function renderListing(list: any[]) {
    return (
    <ul className='listItems'>
    {list && list.length && (list.map((post : any, index: number) => {
      const newDate = new Date(post.updated_at)
      const timeZone = 'America/Los_Angeles';
      const utcDate = zonedTimeToUtc(newDate, timeZone);
      const dateString = format(utcDate, 'MMM dd, yyyy h:mm a', {timeZone})

      const rowStyle = post.user_deleted ? 'rowStyle markedAsDeleted' : 'rowStyle'
      const iconStyle = post.user_deleted ? 'fas fa-undo fa-trash-alt' : 'fas fa-trash-alt'
      return (
      <li key={post.id} className={rowStyle} onClick={()=>editPost(post.id)}>
        <div className='dates'>{dateString}</div>
       
        <div>{post.title}</div>
        <div className='bodyText'>{post.post}</div>
        <div className='trash' onClick={()=>deletePost(post)}><i className={iconStyle}></i></div>
        {/* <div>{post.category}</div> */}
      </li>
    )})
    )}
  </ul>)
  }

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Get data from the form.

    console.log('EVENT: ', event)
    if (event.target.title === undefined || event.target.post === undefined) {
      return;
    }
    // Send the data to the server in JSON format.
 

    if (editing) {
       const data = {
        id: editPostId,
        title: event.target.title.value,
        post: event.target.post.value,
      }
      const JSONdata = JSON.stringify(data)
      setEditingPostObject(data)
          // API endpoint where we send form data.
          const endpoint = '/api/update'

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

          console.log('About to fetch: ',options);

          const response = await fetch(endpoint, options)

          // Get the response data from server as JSON.
          // If server returns the name submitted, that means the form works.
          const result = await response.json()
          alert(`Edited your post: ${result.data.title}`)
          setTab(0)

    } else {
      const data = {
        title: event.target.title.value,
        post: event.target.post.value,
      }
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

          console.log('About to fetch from posting: ',options);
          // Send the form data to our forms API on Vercel and get a response.
          const response = await fetch(endpoint, options)

          // Get the response data from server as JSON.
          // If server returns the name submitted, that means the form works.
          const result = await response.json()
          alert(`Posted: ${result.data.title}`)
          setTab(0)
    }
    grabData()
    setEditing(false)
    setEditPostId(0)
    setEditingPostObject({})
    setTab(0)
  }

  function renderSpinner() {
    if (isLoading) {
      return ( <div className='spinner'>
        <div className="loading"></div></div>
        )
    } else {
      return (
        <div className='spacer'></div>
      )
    }


  }

  const renderForm = useMemo(() => {
    let title = ''
    let postBody = ''
    let postToEdit

    postToEdit = data.filter((post) => post.id === editPostId)
      if (postToEdit[0]) {
        title = postToEdit[0].title
        postBody = postToEdit[0].post
      }

  
    return (<>
      {!editing && (<div className='poster'>What&apos;s on your mind today?</div>)}

      <form onSubmit={handleSubmit} method="post" ref={formRef}>
        <input type='text' className='simpleInput' placeholder='Title' defaultValue={title} id='title' name='title'/><br></br> 
        <textarea className='mainText' defaultValue={postBody} placeholder='Tell us about it...' id='post' name='post'/><br/>
        {editing && ( <button type='submit'>UPDATE</button>)}
        {!editing && ( <button type='submit'>POST</button>)}
        <button onClick={cancelPost}>CANCEL</button>
      </form>
      </>
    )
  }, [editing, editPostId])


  if (!data) return <p>No post data</p>


  return (
    <>
    <Link href="home">
    <div className='landing'><div className='landing-inner'>the Stories <br/>I tell myself
        <div className='landing-subhead'>-a digital diary</div>
        
        {/* <div className='cover-buttons'>
          <div className='cover-button'>start reading</div>
          <div className='cover-button'>start writing</div>
        </div> */}
        
        </div>
    </div>

    </Link>
    </>
  )
}




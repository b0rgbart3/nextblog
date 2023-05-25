import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { format, zonedTimeToUtc } from 'date-fns-tz'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { sortByColumn } from '@/lib/sorting'
import Link from 'next/link';
import { title } from 'process'
import {htmlEscape, htmlUnescape} from 'escape-goat';

const inter = Inter({ subsets: ['latin'] })


export interface Post {
  id: number,
  created_at: string,
  title: string,
  post: string,
  user_deleted: boolean,
  updated_at: string
}


export default function Home() {
 
  const [data, setData] = useState<Post[]>([]) 
  const [isLoading, setLoading] = useState(false)
  const [mainList, setMainList] = useState<Post[]>([])
  const [archiveList, setArchiveList] = useState<Post[]>([])

  const [sortBy, setSortBy] = useState('date')
  const [error, setError] = useState(false)
  const [tab, setTab] = useState(0)
  const [editPostId, setEditPostId] = useState(0)
  const [editingPostObject, setEditingPostObject] = useState({})
  const [editing, setEditing] = useState(false)
  const [dateFilterDirection, setDateFilterDirection] = useState('desc')
  const [titleFilterDirection, setTitleFilterDirection] = useState('asc')
  const [expanded, setExpanded] = useState(false)

  const formRef = useRef<HTMLFormElement>(null);

  const grabFromLocal = useCallback(() => {
  //  console.log('getting local storage values:');
    const storedSortBy = localStorage.getItem('sortBy') ? localStorage.getItem('sortBy') : 'date'
   // console.log('loaded from local storage: ', storedSortBy)
    if (storedSortBy) {
      setSortBy(storedSortBy);
    }

    const storedDateDirection = localStorage.getItem('dateDirection') ? localStorage.getItem('dateDirection') : 'desc'
   // console.log('loaded date direction: ', storedDateDirection)
    if (storedDateDirection) {
      setDateFilterDirection(storedDateDirection);
    }

    const storedTitleDirection = localStorage.getItem('titleDirection') ? localStorage.getItem('titleDirection') : 'asc'
    console.log('loaded title direction: ', storedTitleDirection)
    if (storedTitleDirection) {
      setTitleFilterDirection(storedTitleDirection);
    }
    return {by: storedSortBy, dd: storedDateDirection, td: storedTitleDirection}
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
    
    if (sortBy !== 'date') {
      setSortBy('date')
      let newMain: Post[] = sortByColumn(mainList, 'date', dateFilterDirection);
      setMainList(newMain)
      let newArchive: Post[] = sortByColumn(archiveList, 'date', dateFilterDirection);
      setArchiveList(newArchive)
    }
    else {
  
    if (dateFilterDirection === 'asc') {
      console.log('Switching to descending')
      setDateFilterDirection('desc')
      let newMain: Post[] = sortByColumn(mainList, 'date', 'desc');
      setMainList(newMain)
      let newArchive: Post[] = sortByColumn(archiveList, 'date', 'desc');
      setArchiveList(newArchive)

      console.log('setting localStorage to: ', 'desc');
      localStorage.setItem('dateDirection', 'desc');

    } else {
      setDateFilterDirection('asc')
      console.log('Switching to ascending')
      let newMain: Post[] = sortByColumn(mainList, 'date', 'asc');
      setMainList(newMain)
      let newArchive: Post[] = sortByColumn(archiveList, 'date', 'asc');
      setArchiveList(newArchive)

      console.log('setting localStorage to: ', 'asc');
      localStorage.setItem('dateDirection', 'asc');
    }
  }

    localStorage.setItem('sortBy', 'date')

  },[mainList])
  
  const chooseTitle = useCallback(() => {
  //  console.log('Sort by Title');
  //  console.log('mainList: ', mainList);
    if (sortBy !== 'title') {
      setSortBy('title')
      if (titleFilterDirection === 'asc') {
      let newMain: Post[] = sortByColumn(mainList, 'title', 'desc');
      setMainList(newMain)
      let newArchive: Post[] = sortByColumn(archiveList, 'title', 'desc');
      setArchiveList(newArchive)
      } else {
        let newMain: Post[] = sortByColumn(mainList, 'title', 'asc');
        setMainList(newMain)
        let newArchive: Post[] = sortByColumn(archiveList, 'title', 'asc');
        setArchiveList(newArchive)
      }
    }
    else {

    if (titleFilterDirection === 'desc') {
      setTitleFilterDirection('asc');
      console.log('setting titleFilter direction to asc');
      localStorage.setItem('titleDirection', 'asc');
      let newMain: Post[] = sortByColumn(mainList, 'title', 'desc');
      setMainList(newMain)
      let newArchive: Post[] = sortByColumn(archiveList, 'title', 'desc');
      setArchiveList(newArchive)
    } else {
      setTitleFilterDirection('desc');
      console.log('setting titleFilter direction to desc');
      localStorage.setItem('titleDirection', 'desc');
      let newMain: Post[] = sortByColumn(mainList, 'title', 'asc');
      setMainList(newMain)
      let newArchive: Post[] = sortByColumn(archiveList, 'title', 'asc');
      setArchiveList(newArchive)
    }
  }
 
    localStorage.setItem('sortBy', 'title')
    
  },[mainList])

  const setPageData = useCallback((data: any) => {
    console.log('In set page data.');
   // grabFromLocal();
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
    const sortingParams = grabFromLocal()
   setLoading(true)
  
    console.log('grabbing')
    // if (sortBy && sortBy !==''){
      console.log('sort by: ', sortingParams.by);
      console.log('direction: ', sortingParams.dd);
   
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
 
        //data = []
        console.log('Getting data.');
        if (!data || !data.data || data.length < 1 || data.data.length < 1) {
          setError(true)
        } else {
          if (sortingParams.by === 'date') {
            data.data = sortByColumn(data.data,sortBy, sortingParams.dd ? sortingParams.dd : 'desc')
          }
          else {
            console.log('Sorting by title');
            if (sortingParams.td === 'asc') {
              console.log('sort direction is asc');
            data.data = sortByColumn(data.data, 'title', 'desc')
            } else {
              data.data = sortByColumn(data.data,'title', 'asc')
            }
          }
         
        setPageData(data)
        }
        setLoading(false)
        
      })
  //  }
  },[dateFilterDirection, sortBy, titleFilterDirection])

  const deletePost = useCallback((post: any, event: React.MouseEvent<HTMLDivElement>) => {
    console.log('got here.');
    event.preventDefault();
    event.stopPropagation();
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

  }, [])

  function sanitizeTextareaValue(inputValue: string) {
    let sanitizedValue = htmlEscape(inputValue)
    sanitizedValue = sanitizedValue.trim()

    // Perform additional validation or manipulation if required
    return sanitizedValue;
  }

  function renderItems(list: any[]) {

    return (<>
      <ul className='listItems'>
      {list && list.length && (list.map((post : any, index: number) => {
        const newDate = new Date(post.updated_at)
        const timeZone = 'America/Los_Angeles';
        const utcDate = zonedTimeToUtc(newDate, timeZone);
        const dateString = format(utcDate, 'MMM dd, yyyy h:mm a', {timeZone})
  
        const rowStyle = post.user_deleted ? 'rowStyle markedAsDeleted' : 'rowStyle'
        const iconStyle = post.user_deleted ? 'fas fa-undo fa-trash-alt' : 'fas fa-trash-alt'
        return (<>
        <li key={post.id} className={rowStyle} onClick={()=>editPost(post.id)}>
          <div className='dates'>{dateString}</div>
         
          <div>{htmlUnescape(post.title)}</div>
          <div className='bodyText'>{htmlUnescape(post.post)}</div>
          <div className='trash' onClick={(event)=>deletePost(post, event)}><i className={iconStyle}></i></div>
          {/* <div>{post.category}</div> */}
        </li></>
      )})
      )}     
    </ul></>)
  }

  function expandDivider() {
    setExpanded(!expanded)
  }

  function renderDivider(list: any[]) {
    let dividerClassName = 'accordian'
    if (expanded) {
      dividerClassName += ' expanded'
    }
    return (
      <><div className={dividerClassName}><div onClick={expandDivider}>DIVIDER</div>
      {   renderItems(list)  }
      </div></>
    )
  }

  function renderListing(list: any[], listName: string) {

    let renderList = []
    let myJSX
    let myJSX2
    let divider
    
    switch (listName) {
      case 'main':
        renderList = list
        return renderItems(renderList)
        break;
      case 'archive':
        renderList = list.slice(0, 5)
        myJSX = renderItems(renderList)
        renderList = list.slice(5, list.length);
        divider = renderDivider(renderList)
        return [myJSX, divider]
        break
      default: break
    }
  
  }

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Get data from the form.

    if (event.target.title === undefined || event.target.post === undefined) {
      return;
    }
    // Send the data to the server in JSON format. 
    const postContent = event.target.post.value;


    if (editing) {

      const postTitle = sanitizeTextareaValue(event.target.title.value).trim()
      const postContent = sanitizeTextareaValue(event.target.post.value).trim()


      const data = {
        id: editPostId,
        title: postTitle,
        post: postContent,
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
          // alert(`Edited your post: ${result.data.title}`)
          setTab(0)

    } else {

          const postTitle = sanitizeTextareaValue(event.target.title.value).trim()
          const postContent = sanitizeTextareaValue(event.target.post.value).trim()


          const data = {
            title: postTitle,
            post: postContent,
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
          //alert(`Posted: ${result.data.title}`)
          setTab(0)
    }
    grabData()
    setEditing(false)
    setEditPostId(0)
    setEditingPostObject({})
    setTab(0)
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
        <input type='text' className='simpleInput' placeholder='Title' defaultValue={htmlUnescape(title)} id='title' name='title'/><br></br> 
        <textarea className='mainText' defaultValue={htmlUnescape(postBody)} placeholder='Tell us about it...' id='post' name='post'/><br/>
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
    {isLoading && renderSpinner()}
    <div className='homelinkDiv'>
      <div className='homelink'><Link href="/">Back home</Link></div>
      <div className='homelink'><Link href="/read">Read stories</Link></div>
    </div>
    {!error && (<>

    <div className='mainList'>
        <div className='tabs'>
          {!editing && (
          <>
          <div onClick={() => selectTab(0)} className={tab === 0 ? 'selected' : 'ghost'}>Previous Musings</div>
          <div onClick={() => selectTab(1)} className={tab === 1 ? 'selected' : 'ghost'}>Archived</div>
          </>)
          }
          <div onClick={()=>{setEditing(false); setEditPostId(0); setEditingPostObject({})
            selectTab(2)}} className={tab===2?'selected':'ghost'} id="muse">Post +</div>
        </div>
        <div className='output'>
          {tab !== 2 && (
          <div className='sorters'>
            <div>Sort by:</div>
            <div className={sortBy==='date' ? 'chip chosen' : 'chip'} onClick={chooseDate}>
              Date <div className={'arrow ' + dateFilterDirection}></div></div>
            <div className={sortBy==='title' ? 'chip chosen' : 'chip'} onClick={chooseTitle}>
              Title<div className={'arrow ' + titleFilterDirection}></div></div>
          </div>)}
          <div className='list'>
              {tab === 0 && mainList.length > 0 && (renderListing(mainList, 'main'))}
              {/* {mainList.length < 1 && (<><div>There are no stories yet posted.  Post a story!</div></>)} */}
              {tab === 1 && (renderListing(archiveList, 'archive'))}
              {tab === 2 && (renderForm)}
          </div>
        </div>

    </div></>)}
    {error && (
      <div className='error'>
        There is a problem either connecting or receiving data from the database.
      </div>
    )}
    </>
  )
  
}


export function renderSpinner() {

    return ( <div className='spinner'>
      <div className="loading"></div></div>
      )



}

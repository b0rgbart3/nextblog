
import '@fortawesome/fontawesome-free/css/all.min.css'

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Post, renderSpinner } from './home';
import { sortByColumn } from '@/lib/sorting';
import { htmlUnescape } from 'escape-goat';



export default function Read() {
    const [data, setData] = useState<Post[]>([]) 
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [mainList, setMainList] = useState<Post[]>([])
    const [currentTitle, setCurrentTitle] = useState('')
    const [currentBody, setCurrentBody] = useState('')
    const [entryNumber, setEntryNumber] = useState(0)

    const setPageData = useCallback((data: any) => {
        console.log('In set page data.');
       // grabFromLocal();
        if (data && !data.error) {
        let mainListData = data.data.filter((post: any) => !post.user_deleted)

        setMainList(mainListData)

      
        setData(data.data)
        } else {
          setError(true)
        }
      }, [])

      const nextStory = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
  
        event.stopPropagation()
        event.preventDefault()

        let newEntry = entryNumber + 1
        // console.log('entry : ',newEntry)
        // console.log('mainList.length: ', mainList.length)
        if (newEntry >= mainList.length) {
            newEntry = 0
        }
      //  console.log('body: ', mainList[newEntry].post);
 
        setEntryNumber(newEntry)
      },[ mainList, entryNumber])
      
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

       const renderBody = useCallback((body: string) => {
        const split = body.split('\n')
        console.log('split: ', split)
        let myJSX = ''
        return  (<>
        {split.map((par)  => (<div className='par'>{par}</div>))}
        </>)
       }, []);

  return (
    <>
        {isLoading && renderSpinner()}
        <div className='homelinkDiv'>
      <div className='homelink'><Link href="/">Back home</Link></div>
      <div className='homelink'><Link href="/home">Edit this story</Link></div>
      <div className='homelink'><Link href="/home">The List</Link></div>
    </div>

        { mainList && mainList.length > 0 && (
            
    <div className='reading'>
        <div className='inner-reader'>
            
            <div className='read-title'>
            { 
            
            mainList[entryNumber]?.title && htmlUnescape(mainList[entryNumber].title)}
            </div>

                <div className='body-container'>
            <div className='read-body'>
                {renderBody( htmlUnescape(mainList[entryNumber].post)) }
             {/* { mainList[entryNumber]?.post && htmlUnescape(mainList[entryNumber].post)} */}
            </div></div>

            {/* the Stories <br/>I tell myself
        <div className='landing-subhead'>-a digital diary</div>
         */}

        <div onClick={nextStory} className='next-story'><div className='right-arrow-adjust'><div className='right-arrow'></div></div></div>
        </div>
    </div>

    )}
    </>
  )
}




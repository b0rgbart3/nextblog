
import '@fortawesome/fontawesome-free/css/all.min.css'

import Link from 'next/link';



export default function Landing() {


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




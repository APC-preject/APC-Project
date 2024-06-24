import React from 'react';
import { Link }from 'react-router-dom'

export default function Navbar() {
  //알림기능 나중에
  //const [showModal, setShowModal] = useState(false);
  //const [alertData, setAlertData] = useState(["알림 1", "알림 2", "알림 3"]); // 알림 데이터가 담긴 배열

  return (
    <div>
        <nav className=" fixed top-0 h-1/10 z-50 w-full bg-main border border-bor">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start">
                        <Link to = {'/'} className='flex ml-2 md:mr-24'>
                            <img src={process.env.PUBLIC_URL + '/assets/rda_logo.png'} className="h-8 mr-3" alt="Logo"/>
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-sub">
                                APC</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>       
    </div>
  )
}

import React, { useState } from 'react';
import UserDropdown from './sideBarDropdownMenu/UserDropdown';
import OrderDropdown from './sideBarDropdownMenu/OrderDropdown';
import DeliveryDropdown from './sideBarDropdownMenu/DeliveryDropdown';
import ReviewDropdown from './sideBarDropdownMenu/ReviewDropdown';
import StoreDropdown from './sideBarDropdownMenu/StoreDropdown';
import QuestionDropdown from './sideBarDropdownMenu/QuestionDropdown';

export default function Sidebar() {

    const [IsUserToggleOpen, setIsUserToggleOpen] = useState(false);
    const [IsOrderToggleOpen, setIsOrderToggleOpen] = useState(false);
    const [IsDeliveryToggleOpen, setIsDeliveryToggleOpen] = useState(false);
    const [IsReviewToggleOpen, setIsReviewToggleOpen] = useState(false);
    const [IsStoreToggleOpen, setIsStoreToggleOpen] = useState(false);
    const [IsQuestionToggleOpen, setIsQuestionToggleOpen] = useState(false);

    const userToggleDropdown = () => {
        setIsUserToggleOpen(!IsUserToggleOpen);
    };
    const orderToggleDropdown = () => {
        setIsOrderToggleOpen(!IsOrderToggleOpen);
    };
    const deliveryToggleDropdown = () => {
        setIsDeliveryToggleOpen(!IsDeliveryToggleOpen);
    };
    const reviewToggleDropdown = () => {
        setIsReviewToggleOpen(!IsReviewToggleOpen);
    };
    const storeToggleDropdown = () => {
        setIsStoreToggleOpen(!IsStoreToggleOpen);
    };
    const questionToggleDropdown = () => {
        setIsQuestionToggleOpen(!IsQuestionToggleOpen);
    };

      
  return (
    <aside id="separator-sidebar"
            className="fixed top-0 left-0 z-40 w-1/6 h-screen pt-20 transition-transform bg-main border border-bor"
            aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-mist">
                <ul className="space-y-1">
                    <li>
                        <button className = 'cursor-pointer' onClick={userToggleDropdown} id="dropdownOffsetButton" data-dropdown-toggle="dropdownBottom"
                            data-dropdown-placement="bottom" data-dropdown-offset-distance="35" data-dropdown-offset-skidding="0"
                            type="button">
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg aria-hidden="true" 
                                    className="flex-shrink-0 w-6 h-6 text-baritem transition duration-75 dark:text-gray-400 group-hover:text-sub dark:group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd">
                                    </path>    
                                </svg>
                                <span className="flex-1 ml-3 whitespace-nowrap">계정</span>
                            </div>
                        </button>
                        {IsUserToggleOpen && <UserDropdown/>}
                    </li>
                </ul>
                
                <ul className="pt-2 mt-2 space-y-1 font-medium border-t border-bor">

                    <li>
                        <button className='cursor-pointer' onClick={storeToggleDropdown} id="dropdownOffsetButton" data-dropdown-toggle="dropdownBottom"
                            data-dropdown-placement="bottom" data-dropdown-offset-distance="35" data-dropdown-offset-skidding="0"
                            type="button">
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z">
                                    </path>    
                                    <path
                                        d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z">

                                    </path>
                                </svg>
                                <span className= "flex-1 ml-3 whitespace-nowrap">입고</span>
                            </div>
                        </button>
                        {IsStoreToggleOpen && <StoreDropdown/>}
                    </li>

                    
                    <li>
                        <button className='cursor-pointer' onClick={orderToggleDropdown} id="dropdownOffsetButton" data-dropdown-toggle="dropdownBottom"
                            data-dropdown-placement="bottom" data-dropdown-offset-distance="35" data-dropdown-offset-skidding="0"
                            type="button">
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                    d='M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'>
                                        
                                    </path>
                                </svg>
                                <span className= "flex-1 ml-3 whitespace-nowrap">주문</span>
                            </div>
                        </button>
                        {IsOrderToggleOpen && <OrderDropdown/>}                        
                    </li>
                
                    <li>
                        <button className='cursor-pointer'onClick={deliveryToggleDropdown} id="dropdownOffsetButton" data-dropdown-toggle="dropdownBottom"
                            data-dropdown-placement="bottom" data-dropdown-offset-distance="35" data-dropdown-offset-skidding="0"
                            type="button">
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        d="M15.5 10.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm0 0a2.225 2.225 0 0 0-1.666.75H12m3.5-.75a2.225 2.225 0 0 1 1.666.75H19V7m-7 4V3h5l2 4m-7 4H6.166a2.225 2.225 0 0 0-1.666-.75M12 11V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v9h1.834a2.225 2.225 0 0 1 1.666-.75M19 7h-6m-8.5 3.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />                                    
                                </svg>
                                <span className= "flex-1 ml-3 whitespace-nowrap">배송</span>
                            </div>
                        </button>
                        {IsDeliveryToggleOpen && <DeliveryDropdown/>}
                        
                    </li>

                    <li>
                        <button className='cursor-pointer' onClick={reviewToggleDropdown} id="dropdownOffsetButton" data-dropdown-toggle="dropdownBottom"
                            data-dropdown-placement="bottom" data-dropdown-offset-distance="35" data-dropdown-offset-skidding="0"
                            type="button">
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path
                                        d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                                </svg>
                                <span className= "flex-1 ml-3 whitespace-nowrap">리뷰</span>
                            </div>
                        </button>
                        {IsReviewToggleOpen && <ReviewDropdown/>}
                    </li>

                    <li>
                        <button className='cursor-pointer' onClick={questionToggleDropdown} id="dropdownOffsetButton" data-dropdown-toggle="dropdownBottom"
                            data-dropdown-placement="bottom" data-dropdown-offset-distance="35" data-dropdown-offset-skidding="0"
                            type="button">
                            <div className="flex items-center p-2 text-base font-normal  rounded-lg text-sub  hover:bg-hov transition-colors duration-300">
                                <svg
                                    className="flex-shrink-0 w-6 h-6  transition duration-75 text-baritem group-hover:text-white"
                                    fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd"
                                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z">
                                    </path>
                                </svg>
                                <span className= "flex-1 ml-3 whitespace-nowrap">고객문의</span>
                            </div>
                        </button>
                        {IsQuestionToggleOpen && <QuestionDropdown/>}
                    </li>
                </ul>
            </div>
    </aside>
  )
}

import React, { useState } from 'react'
import BasicLayout from '../layout/BasicLayout'
import { useUserStore } from '../store/UserStore';

export default function MainPage() {
   const [showTooltip, setShowTooltip] = useState(false);
   const [showTooltip2, setShowTooltip2] = useState(false);
   const [showTooltip3, setShowTooltip3] = useState(false);

   const { id, role } = useUserStore();
   console.log(`User ID: ${id}, Role: ${role}`)

    

  return (
    <BasicLayout>
        <div className="flex-wrap bg-main">
            <div className="p-5 border-dashed rounded-lg border-gray-700 mt-14">
                <div className="max-w-[96rem] min-w-[18rem] mx-auto text-container">
                    <div className="bg-cover bg-center"  style={{ backgroundImage: 'url(/assets/videocutcut.gif)' }}>
                        <div className="backdrop-brightness-50">

                            <p className="text-white col-span-2 text-2xl mb-10">
                            농림축산식품부 인공지능 기반(디지털 트윈) 신선 과채류의 품질 판정 기술 <br/> 
                            개발 사업 페이지입니다.<br/><br/>
                            충주 스마트 농산물산지유통센터(APC: Agricultural Productional Complex)를 토대로<br/>
                            신선 과채류의 입고, 품질 판정, 저장 및 주문에 의한 배송 기능까지<br/>
                            가상화함으로써 디지털 트윈을 실현하였습니다.<br/><br/>

                            최대 6개의 박스를 단위로 하여 APC 컨베이어 벨트에 투입됩니다.<br/>
                            사전세척기에 투입되어 박스와 원물이 분리되고<br/>
                            원물들은 사전 세척 후 세척 건조기로 투입됩니다.<br/>
                            그 후 육안 품질 검사를 통한 선별 과정을 거친 후<br/>
                            품질 선별 시스템에 들어가기 위해 정렬 과정을 거칩니다.<br/>
                            품질 선별 시스템 과정은 다음과 같습니다.<br/> 
                            </p>

                            <div className="group relative cursor-pointer py-2">
                                <span
                                    className="col-span-2 text-xl text-white text-base underline cursor-pointer hover:text-blue-700 transition"
                                    onMouseOver={() => setShowTooltip(true)}
                                    onMouseOut={() => setShowTooltip(false)}>
                                    -결점과 선별 시스템
                                </span>
                                {showTooltip && (
                                <div className=" absolute invisible bottom-7 group-hover:visible w-40 bg-white text-black px-4 mb-3 py-2 text-sm rounded-md">
                                    <p className=" leading-2 text-gray-600 pt-2 pb-2"> 
                                    초당 30 프레임의<br/>
                                    사진을 촬영하여<br/>
                                    원물의 외부적인<br/>
                                    결점을 파악하고<br/>
                                    바퀴 형태의<br/>
                                    컨베이어 벨트를<br/>
                                    통해 원물을<br/>
                                    회전하게 만들어<br/>
                                    결점 검사
                                    </p>
                                    <svg className="absolute z-10  bottom-[-10px] " width="16" height="10" viewBox="0 0 16 10" fill="none" 
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 10L0 0L16 1.41326e-06L8 10Z" fill="white" />
                                    </svg>
                                </div>)}
                            </div>

                            <div className= "group relative cursor-pointer py-2">
                                <span 
                                    className="col-span-2 text-xl text-white text-base underline cursor-pointer hover:text-blue-700 transition"
                                    onMouseOver={() => setShowTooltip2(true)}
                                    onMouseOut={() => setShowTooltip2(false)}>
                                    - 중량 선별 시스템
                                </span>
                                {showTooltip2 && (
                                <div className=" absolute invisible bottom-7 group-hover:visible w-40 bg-white text-black px-4 mb-3 py-2 text-sm rounded-md">
                                    <p className=" leading-2 text-gray-600 pt-2 pb-2"> 원물 무게 측정
                                    </p>
                                    <svg className="absolute z-10  bottom-[-10px] " width="16" height="10" viewBox="0 0 16 10" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 10L0 0L16 1.41326e-06L8 10Z" fill="white" />
                                    </svg>
                                </div>)}
                            </div>

                            <div className='group relative cursor-pointer py-2'>
                                <span
                                className="col-span-2 text-xl text-white text-base underline cursor-pointer hover:text-blue-700 transition"
                                onMouseOver={() => setShowTooltip3(true)}
                                onMouseOut={() => setShowTooltip3(false)}>
                                -비파괴 광센서 시스템
                                </span>
                                {showTooltip3 && (
                                <div className=" absolute invisible bottom-7 group-hover:visible w-40 bg-white text-black px-4 mb-3 py-2 text-sm rounded-md">
                                    <p className=" leading-2 text-gray-600 pt-2 pb-2"> 
                                    광센서를 통하여<br/>
                                    당도, 경도, 산도<br/>
                                    등의 품위 데이터를<br/>
                                    측정 수집하며<br/>
                                    여러 대의카메라가<br/>
                                    동시에 작동하여<br/>
                                    각각의 원물에 대한<br/>
                                    측정 병행
                                    </p>
                                    <svg className="absolute z-10  bottom-[-10px] " width="16" height="10" viewBox="0 0 16 10" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 10L0 0L16 1.41326e-06L8 10Z" fill="white" />
                                    </svg>
                                </div>)}
                            </div>

                            <div className="text-white col-span-2 text-2xl mb-10">            
                            선별 과정이 끝난 후 원물들은 자동 배출 시스템을 통해 등급별로<br/>
                            분류된 박스로 이동하게됩니다.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid md:grid-cols-1 md:gap-6 relative z-0 mb-6 w-full group ">
                    <div className="flex justify-center">
                        <iframe src="https://www.youtube.com/embed/qkDxU5xGy54" width="15000" height="600" frameBorder="0"
                        allowFullScreen></iframe>
                    </div>
                </div>
                <div className="flex justify-center">
                    <img src="/assets/apcRoad.png" className="object-cover" height="600" />
                </div>
                <br/>
                <div className="flex justify-center">
                    <img src="/assets/apcArchitecture.png" className="object-cover" height="600"/>
                </div>
            </div>
        </div>
    </BasicLayout>

  )
}

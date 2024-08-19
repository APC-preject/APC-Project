import React from 'react'
import BasicLayout from '../layout/BasicLayout'

export default function MainPage() {

    return (
        <BasicLayout>
            <div className="flex-wrap bg-main">
                <div className="p-5 border-dashed rounded-lg border-gray-700 mt-14">
                    <div className="max-w-[96rem] min-w-[18rem] mx-auto text-container">

                        <p className="text-white col-span-2 text-2xl mb-10">
                            농림축산식품부 인공지능 기반(디지털 트윈) 신선 과채류의 품질 판정 기술 <br />
                            개발 사업 페이지입니다.<br /><br />
                            충주 스마트 농산물산지유통센터(APC: Agricultural Productional Complex)를 토대로<br />
                            신선 과채류의 입고, 품질 판정, 저장 및 주문에 의한 배송 기능까지<br />
                            가상화함으로써 디지털 트윈을 실현하였습니다.<br /><br />

                            최대 6개의 박스를 단위로 하여 APC 컨베이어 벨트에 투입됩니다.<br />
                            사전세척기에 투입되어 박스와 원물이 분리되고<br />
                            원물들은 사전 세척 후 세척 건조기로 투입됩니다.<br />
                            그 후 육안 품질 검사를 통한 선별 과정을 거친 후<br />
                            품질 선별 시스템에 들어가기 위해 정렬 과정을 거칩니다.<br />
                            품질 선별 시스템 과정은 다음과 같습니다.<br />
                        </p>

                        <div className="group relative py-2">
                            <span
                                className="col-span-2 text-white text-2xl transition">
                                - 결점과 선별 시스템
                            </span>
                            <div className="text-white col-span-2 text-lg mt-1 mb-5">
                                초당 30 프레임의 사진을 촬영하여 원물의 외부적인 결점을 파악하고,<br />
                                바퀴 형태의 컨베이어 벨트를 통해 원물을 회전하게 만들어 결점 검사
                            </div>
                        </div>

                        <div className="group relative cursor-pointer py-2">
                            <span
                                className="col-span-2 text-2xl text-white transition">
                                - 중량 선별 시스템
                            </span>
                            <div className="text-white col-span-2 text-lg mt-1 mb-5">
                                원물 무게 측정
                            </div>
                        </div>

                        <div className='group relative cursor-pointer py-2'>
                            <span
                                className="col-span-2 text-2xl text-white transition">
                                - 비파괴 광센서 시스템
                            </span>
                            <div className="text-white col-span-2 text-lg mt-1 mb-5">
                                광센서를 통하여 당도, 경도, 산도 등의 품위 데이터를 측정 수집하며, <br />
                                여러 대의카메라가 동시에 작동하여 각각의 원물에 대한 측정 병행
                            </div>
                        </div>

                        <div className="text-white col-span-2 text-2xl mb-10 mt-10">
                            선별 과정이 끝난 후 원물들은 자동 배출 시스템을 통해 등급별로<br />
                            분류된 박스로 이동하게됩니다.
                        </div>
                        <div className='flex bg-cover bg-center mt-5'>
                            <img src='/assets/diagram.png'></img>
                        </div>
                    </div>
                </div>
            </div>
        </BasicLayout>

    )
}

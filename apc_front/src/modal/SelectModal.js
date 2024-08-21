import React, { useState, useRef, useEffect } from 'react';
import SelectProgress from '../components/SelectProgress';

const SelectModal = ({ onClose, state, id, grade, total, gradeSet, classFunc }) => {
  const modalRef = useRef(null);
  const [selectPhoto, setSelectPhoto] = useState('');
  const [phothView, setPhotoView] = useState(false);

  // 모달 외부 클릭 감지를 위한 이벤트 리스너 등록
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, modalRef]);

  const clickClose = async () => {
    onClose();
  }

  const viewPhoto = (e, id) => {
    setSelectPhoto(`/generate/${id}/gen-${e}.png`);
    setPhotoView(true);
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto min-w-full">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 opacity-75"></div>
        </div>
        <div ref={modalRef} className="relative bg-sub border border-bor rounded-lg p-8 mx-auto" style={{ maxWidth: '40%', maxHeight: '100%' }}>
          <div className='flex font-bold mb-4 text-black border-b'>
            <h1 className="text-2xl font-bold text-black">품질 분류 정보</h1>
          </div>
          <div className="min-w-full text-black border-collapse mb-3 font-bold">
            {`품질선별 진행 상황: ${['입고중', '입고완료', '선별중', '선별완료'][state]}`}
            {state == 1 &&
              <button
                onClick={() => classFunc(id)}
                className={`transition-colors duration-300 text-white mx-2 py-1 px-1 rounded bg-button hover:bg-button2Hov`}
              >
                선별하기
              </button>
            }
          </div>
          <div className='flex items-center justify-center text-lg border-b'>
            <SelectProgress currentStage={state} />
          </div>
          {phothView &&
            <div 
              className='flex bg-cover bg-center mt-5 justify-center'
              onClick={() => setPhotoView(false)}
              style={{ display: 'inline-block' }}
            >
              <img className='justify-center' src={selectPhoto} style={{ maxWidth: '300px', height: 'auto' }} />
            </div>
          }
          {state == 0 ? (
            <div class="max-h-80 overflow-y-auto mt-5">
              입고 중..
            </div>
          ) : (
            <div class="max-h-80 overflow-y-auto mt-5">
              <table class="min-w-full border-collapse">
                <thead class="sticky top-0 bg-white z-10">
                  <tr>
                    <th class="border border-gray-300 p-2">원물 사진 목록</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: total }, (_, i) => i).map(e => (
                    <tr
                      key={e}
                      className="hover:bg-hov transition-colors duration-300"
                      onClick={() => viewPhoto(e, id)}
                    >
                      <td class="border border-gray-300 p-2">{`gen-${e}.png`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="min-w-full text-black border-collapse mb-3 font-bold mt-3">
            등급 분류 결과
          </div>
          <table className="min-w-full table-auto border-collapse mb-3">
            <thead>
              <tr className="bg-baritem text-main">
                <th className="px-4 py-2 border-b border-bor text-lg">1</th>
                <th className="px-4 py-2 border-b border-bor text-lg">2</th>
                <th className="px-4 py-2 border-b border-bor text-lg">3</th>
                <th className="px-4 py-2 border-b border-bor text-lg">4</th>
                <th className="px-4 py-2 border-b border-bor text-lg">5</th>
                <th className="px-4 py-2 border-b border-bor text-lg">6</th>
                <th className="px-4 py-2 border-b border-bor text-lg">7</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="hover:bg-hov transition-colors duration-300"
              >
                {gradeSet.map((e) => {
                  return (
                    <td className="border-b border-bor px-4 py-2 text-black text-center text-lg">
                      {state == 3 && grade[e] ? grade[e] : '-'}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-button text-white rounded hover:bg-red-600 focus:outline-none focus:bg-red-600"
              onClick={clickClose}
              type='button'
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectModal;

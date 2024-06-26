import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';
import axios from 'axios';

const QuestionResponsePage = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const questionId = queryParams.get('id');
  const [question, setQuestion] = useState({});
  const [response, setResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/questions/${questionId}`, {
          withCredentials: true,
        });
        setQuestion(response.data);
      } catch (error) {
        alert('문의 데이터를 가져오는 중 문제가 발생했습니다.' + error.message);
      }
    };

    fetchData();
  }, [questionId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmitResponse = async () => {
    try {
      await axios.post(`http://localhost:4000/questions/${questionId}/response`, { response });
      alert('답변이 성공적으로 제출되었습니다.');
      setResponse('');
    } catch (error) {
      alert('답변을 제출하는 중 문제가 발생했습니다.' + error.message);
    }
  };

  return (
    <BasicLayout>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-6 border-b text-sub">문의 답변</h1>
        <div className="bg-textbg border border-bor shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-sub">{question.title}</h1>
            <div className="flex items-center">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-2">
                {question.questionType}
              </span>
              <span className="text-sm text-button2">문의 번호: {questionId}</span>
            </div>
            <div className="mt-2">
              <span className="text-sm text-sub">문의유저: {question.userID}</span>
            </div>
          </div>
          <div className="p-6 mb-6 bg-textbgHov rounded-lg">
            <h2 className="text-l font-bold mb-2 text-sub">문의 내용</h2>
            <p className="text-sub leading-7">{question.content}</p>
          </div>
          <div className="mb-6">
            <textarea
              className="w-full p-2 border border-bor rounded-lg bg-textbgHov"
              rows="5"
              placeholder="답변을 입력하세요..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button
              className="bg-blue-100 hover:bg-blue-300 transition-colors duration-300 text-blue-800 font-semibold py-2 px-4 rounded-lg focus:outline-none"
              onClick={handleGoBack}
            >
              이전
            </button>
            <button
              className="bg-green-100 hover:bg-green-300 transition-colors duration-300 text-green-800 font-semibold py-2 px-4 rounded-lg focus:outline-none"
              onClick={handleSubmitResponse}
            >
              답변 제출
            </button>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default QuestionResponsePage;

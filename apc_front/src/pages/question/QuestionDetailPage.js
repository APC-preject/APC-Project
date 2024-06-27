import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BasicLayout from '../../layout/BasicLayout';
import axios from 'axios';
import { useUserStore } from '../../store/UserStore';

const QuestionDetailPage = () => {
  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const questionId = queryParams.get('id');
  const [question, setQuestion] = useState({});
  const { role } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:14000/questions/${questionId}`, {
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

  const handleAddResponse = () => {
    navigate(`/customer/question/response?id=${questionId}`);
  };

  return (
    <BasicLayout>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-6 border-b text-sub">문의 상세</h1>
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
          <div className="border border-bor rounded-lg text-sub p-6 bg-textbgHov">
            <h2 className="text-l font-bold mb-2">문의 내용</h2>
            <p className="text-sub leading-7">{question.content}</p>
          </div>
          {question.response && (
            <div className="border border-bor mt-5 rounded-lg p-6 bg-textbgHov text-sub">
              <h2 className="text-l font-bold mb-2">답변</h2>
              <p className="text-sub leading-7">{question.response}</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-between">
          <button
            className="bg-blue-100 hover:bg-blue-300 transition-colors duration-300 text-blue-800 font-semibold py-2 px-4 rounded-lg focus:outline-none"
            onClick={handleGoBack}
          >
            이전
          </button>
          {!question.response && role === 1 && (
            <button
              className="bg-green-100 hover:bg-green-300 transition-colors duration-300 text-green-800 font-semibold py-2 px-4 rounded-lg focus:outline-none"
              onClick={handleAddResponse}
            >
              답변 달기
            </button>
          )}
        </div>
      </div>
    </BasicLayout>
  );
};

export default QuestionDetailPage;

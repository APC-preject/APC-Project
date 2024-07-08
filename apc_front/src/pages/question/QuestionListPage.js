import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import BasicLayout from '../../layout/BasicLayout';
import axios from 'axios';

const QuestionListPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 10;
  const navigate = useNavigate();
  const [questionList, setQuestionList] = useState([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState('전체');

  const questionTypes = ['전체', '상품 문의', '배송 문의', '환불 문의', '기타 문의'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/questions`, {
          withCredentials: true,
        });
        const data = response.data;
        const questions = Object.keys(data).reverse().map((key) => ({ id: key, ...data[key] }));
        questions.sort((a, b) => b.registerTime - a.registerTime);

        const modifiedQuestions = questions.map(question => ({
          ...question,
          content: question.content.length > 5 ? question.content.slice(0, 10) + '...' : question.content
        }));

        setQuestionList(modifiedQuestions);
      } catch (error) {
        console.error('문의 리스트를 불러오던 중 문제가 생겼습니다:' + error.message);
      }
    };

    fetchData();
  }, []);

  const filteredQuestions = selectedQuestionType === '전체'
    ? questionList
    : questionList.filter((question) => question.questionType === selectedQuestionType);

  const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleInquiryClick = (questionId) => {
    navigate(`/customer/question/detail?id=${questionId}`);
  };

  return (
    <BasicLayout>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-6 border-b text-sub">나의 상품 문의 리스트</h1>
        <div className="mb-4">
          <label htmlFor="questionType" className="mr-2 text-sub">
            문의 유형:
          </label>
          <select
            id="questionType"
            value={selectedQuestionType}
            onChange={(e) => setSelectedQuestionType(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            {questionTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {filteredQuestions.length > 0 ? (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-baritem text-center text-lg">
                  <th className="py-3 px-4 border-b border-bor">제목</th>
                  <th className="py-3 px-4 border-b border-bor">문의상품</th>
                  <th className="py-3 px-4 border-b border-bor">문의자</th>
                  <th className="py-3 px-4 border-b border-bor">문의유형</th>
                  <th className="py-3 px-4 border-b border-bor">내용</th>
                  <th className="py-3 px-4 border-b border-bor">문의날짜</th>
                </tr>
              </thead>
              <tbody>
                {currentQuestions.map((question) => (
                  <tr
                    key={question.id}
                    className="border-b border-bor cursor-pointer hover:bg-hov transition-colors duration-300"
                    onClick={() => handleInquiryClick(question.id)}
                  >
                    <td className="py-2 px-4 text-sub text-center text-lg">{question.title}</td>
                    <td className="py-2 px-4 text-sub text-center text-lg">{question.productName}</td>
                    <td className="py-2 px-4 text-sub text-center text-lg">{question.userID}</td>
                    <td className="py-2 px-4 text-sub text-center text-lg">{question.questionType}</td>
                    <td className="py-2 px-4 text-sub text-center text-lg">{question.content}</td>
                    <td className="py-2 px-4 text-sub text-center text-lg">{question.questionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-6 text-white">
              <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                pageCount={Math.ceil(filteredQuestions.length / questionsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'flex items-center'}
                activeClassName={'bg-button2 text-white'}
                pageClassName={'mx-2'}
                pageLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
                previousClassName={'mx-2'}
                previousLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
                nextClassName={'mx-2'}
                nextLinkClassName={'px-3 py-2 rounded-md hover:bg-hov transition-colors duration-300'}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-lg text-sub mt-8">문의 내역이 없습니다.</p>
        )}
      </div>
    </BasicLayout>
  );
};

export default QuestionListPage;

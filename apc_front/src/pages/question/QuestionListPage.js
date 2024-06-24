import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import BasicLayout from '../../layout/BasicLayout';
import { getDatabase, databaseRef, get } from '../../firebase/FirebaseInstance';
import { useUserStore } from '../../store/UserStore';

const QuestionListPage = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 10;
  const navigate = useNavigate();
  const [questionList, setQuestionList] = useState([{}]);
  const database = getDatabase();
  const { id } = useUserStore;
  const [selectedQuestionType, setSelectedQuestionType] = useState('전체');

  // 문의 유형 옵션 배열 (전체 옵션 포함)
  const questionTypes = ['전체','상품 문의', '배송 문의', '환불 문의', '기타 문의'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsRef = databaseRef(database, 'questions');
        const snapshot = await get(questionsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          
          const questions = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          questions.sort((a, b) => b.registerTime - a.registerTime);

          // 문의 내용  10자 이상이면 자르기
          const modifiedQuestions = questions.map(question => ({
            ...question,
            content: question.content.length > 5 ? question.content.slice(0, 10) + '...' : question.content
          }));

          setQuestionList(modifiedQuestions);
        }
      } catch (error) {
        alert('문의 리스트를 불러오던중 문제가 생겼습니다.' + error.message)
      }
    };

    fetchData();
  }, []);

  // 문의 유형 선택에 따라 필터링된 문의 리스트
  const filteredQuestions =
    selectedQuestionType === '전체'  //전체가 아닌 경우 필터링
      ? questionList
      : questionList.filter(
          (question) => question.questionType === selectedQuestionType
        );

  // 현재 페이지의 문의 목록 계산
  const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleInquiryClick = (questionId) => {
    navigate(`/customer/question/detail?id=${questionId}`);
  };

  return (
    <BasicLayout>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-6 border-b  text-sub">전체 문의 리스트</h1>
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
        <table className="w-full">
          <thead>
            <tr className="bg-baritem">
              <th className="py-3 px-4 text-left">제목</th>
              <th className="py-3 px-4 text-left">문의자</th>
              <th className="py-3 px-4 text-left">문의유형</th>
              <th className="py-3 px-4 text-left">내용</th>
              <th className="py-3 px-4 text-left">문의 날짜</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((question) => (
              <tr
                key={question.id}
                className="border-b border-bor cursor-pointer hover:bg-hov transition-colors duration-300"
                onClick={() => handleInquiryClick(question.id)}
              >
                <td className="py-3 px-4 text-sub">{question.title}</td>
                <td className="py-3 px-4 text-sub">{question.userID}</td>
                <td className="py-3 px-4 text-sub">{question.questionType}</td>
                <td className="py-3 px-4 text-sub">{question.content}</td>
                <td className="py-3 px-4 text-sub">{question.questionDate}</td>
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
      </div>
    </BasicLayout>
  );
};

export default QuestionListPage;
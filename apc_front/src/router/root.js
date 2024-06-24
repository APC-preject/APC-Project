import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import ColdStoragePage from "../pages/store/ColdStoragePage";

const Loading = () => <div className="text-xl bg-sub">Loading..</div>

// admin
const AdminManagementPage = lazy(() => import("../pages/AdminManagementPage"))

// main
const Main = lazy(() => import("../pages/MainPage"))

// user
const Login = lazy(() => import("../pages/user/LoginPage"))
const MyPage = lazy(() => import("../pages/user/MyPage"))
const RegisterPage = lazy(() => import("../pages/user/RegisterPage"))

// order
const ProductListPage = lazy(() => import("../pages/order/ProductListPage"))
const OrderedListPage = lazy(() => import("../pages/order/OrderedListPage"))
const ProductRegisterPage = lazy(() => import("../pages/order/ProductRegisterPage"))
const OrderManagementPage = lazy(() => import("../pages/order/OrderManagementPage"))
const ProductDetailPage = lazy(() => import("../pages/order/ProductDetailPage")) 
const OrderManagementDetailPage = lazy(() => import("../pages/order/OrderManagementDetailPage"))

// delivery
const DeliveryListPage = lazy(() => import("../pages/delivery/DeliveryListPage"))

// review
const ReviewableListPage = lazy(() => import("../pages/review/ReviewableListPage"))
const ReviewRegisterPage = lazy(() => import("../pages/review/ReviewRegisterPage"))

// question
const QuestionPage = lazy(() => import("../pages/question/QuestionPage"))
const QuestionListPage = lazy(() => import("../pages/question/QuestionListPage")) 
const QuestionDetailPage = lazy(() => import("../pages/question/QuestionDetailPage")) 
const QuestionResponsePage = lazy(() => import("../pages/question/QuestionResponsePage"))
const MyQuestionListPage = lazy(() => import("../pages/question/MyQuestionListPage")) 

// test
const Test = lazy(() => import("../pages/Test"))
const Test2 = lazy(() => import("../pages/Test2"))

 

const root = createBrowserRouter(

    [
        // 메인페이지
        {
            path:"/",
            element: <Suspense fallback={Loading}><Main/></Suspense>
        },


        // admin페이지
        {
            path:"/admin/management",
            element: <Suspense fallback={Loading}><AdminManagementPage/></Suspense>
        },


        // 계정 관련 페이지
        {
            path:"/user/login",
            element: <Suspense fallback={Loading}><Login/></Suspense>
        },
        {
            path:"/user/my",
            element: <Suspense fallback={Loading}><MyPage/></Suspense>
        },
        {
            path:"/user/register",
            element: <Suspense fallback={Loading}><RegisterPage/></Suspense>
        },


        // 입고 관련 페이지 (저장고)
        {
            path:"/store/coldStorage",
            element: <Suspense fallback={Loading}><ColdStoragePage/></Suspense>
        },


        // 주문 관련 페이지
        {
            path:"/product/list",
            element: <Suspense fallback={Loading}><ProductListPage/></Suspense>
        },
        {
            path:"/product/detail",
            element: <Suspense fallback={Loading}><ProductDetailPage/></Suspense>
        },
        {
            path:"/product/orderedList",
            element: <Suspense fallback={Loading}><OrderedListPage/></Suspense>
        },
        {
            path:"/product/register",
            element: <Suspense fallback={Loading}><ProductRegisterPage/></Suspense>
        },
        {
            path:"/product/order/management",
            element: <Suspense fallback={Loading}><OrderManagementPage/></Suspense>
        },
        {
            path:"/product/order/management/detail",
            element: <Suspense fallback={Loading}><OrderManagementDetailPage/></Suspense>
        },


        // 배송 관련 페이지
        {
            path:"/delivery/list",
            element: <Suspense fallback={Loading}><DeliveryListPage/></Suspense>
        },


        // 리뷰 관련 페이지
        {
            path:"/review/ableList",
            element: <Suspense fallback={Loading}><ReviewableListPage/></Suspense>
        },
        {
            path:"/review/register",
            element: <Suspense fallback={Loading}><ReviewRegisterPage/></Suspense>
        },


        // 고객 문의 관련 페이지
        {
            path:"/customer/question",
            element: <Suspense fallback={Loading}><QuestionPage/></Suspense>
        },
        {
            path:"/customer/question/list",
            element: <Suspense fallback={Loading}><QuestionListPage/></Suspense>
        },
        {
            path:"/customer/question/my/list",
            element: <Suspense fallback={Loading}><MyQuestionListPage/></Suspense>
        },
        {
            path:"/customer/question/detail",
            element: <Suspense fallback={Loading}><QuestionDetailPage/></Suspense>
        },
        {
            path:"/customer/question/response",
            element: <Suspense fallback={Loading}><QuestionResponsePage/></Suspense>
        },


        {
            path:"/test",
            element: <Suspense fallback={Loading}><Test/></Suspense>
        },
        {
            path:"/test2",
            element: <Suspense fallback={Loading}><Test2/></Suspense>
        },

    ]
)

export default root;
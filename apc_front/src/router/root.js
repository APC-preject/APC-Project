import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = () => <div className="text-xl bg-sub">Loading..</div>

// main
const Main = lazy(() => import("../page/MainPage"))

// else
const InfoPage = lazy(() => import("../managerPage/else/InfoPage"))

const AnalysisStockPage = lazy(() => import("../page/stock/analysisStock"))
const RegistReleasePage = lazy(() => import("../page/release/registRelease"))
const RegistStorePage = lazy(() => import("../page/store/registStore"))
const ReleaseDataPage = lazy(() => import("../page/release/releaseData"))
const ReserveReleasePage = lazy(() => import("../page/release/reserveRelease"))
const StoreDataPage = lazy(() => import("../page/store/storeData"))
const LogisticsData = lazy(() => import("../page/logistics/logisticsData"))
const LogisticsMap = lazy(() => import("../page/logistics/logisticsMap"))


const root = createBrowserRouter(

  [
    {
      path: "/analysisStock",
      element: <Suspense fallback={Loading}><AnalysisStockPage /></Suspense>
    },

    {
      path: "/registRelease",
      element: <Suspense fallback={Loading}><RegistReleasePage /></Suspense>
    },
    
    {
      path: "/registStore",
      element: <Suspense fallback={Loading}><RegistStorePage /></Suspense>
    },

    {
      path: "/releaseData",
      element: <Suspense fallback={Loading}><ReleaseDataPage /></Suspense>
    },

    {
      path: "/reserveRelease",
      element: <Suspense fallback={Loading}><ReserveReleasePage /></Suspense>
    },

    {
      path: "/storeData",
      element: <Suspense fallback={Loading}><StoreDataPage /></Suspense>
    },

    {
      path: "/logisticsData",
      element: <Suspense fallback={Loading}><LogisticsData /></Suspense>
    },

    {
      path: "/logisticsMap",
      element: <Suspense fallback={Loading}><LogisticsMap /></Suspense>
    },

    // 메인페이지
    {
      path: "/",
      element: <Suspense fallback={Loading}><Main /></Suspense>
    },

    // 기타 정보 페이지
    {
      path: "/else/info",
      element: <Suspense fallback={Loading}><InfoPage /></Suspense>
    },
  ]
)

export default root;
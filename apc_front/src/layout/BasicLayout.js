import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function BasicLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <div className="h-1/10"> {/* 상단 1/10을 차지함 */}
        <Navbar />
      </div>
      <div className="flex flex-1">
        <div className="w-1/6 flex-shrink-0"> {/* 왼쪽 1/6을 차지함 */}
          <Sidebar />
        </div>
        <div className="flex-1"> {/* overflow-hidden으로 스크롤바 비활성화 */}
          <main className="p-4 h-full">{children}</main>
        </div>
      </div>
    </div>
  );
}

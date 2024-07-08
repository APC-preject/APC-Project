// 뒤에 admin/management 붙이면 됨
import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import BasicLayout from '../layout/BasicLayout'
import axios from 'axios';
export default function AdminManagementPage() {
    const [activeTab, setActiveTab] = useState('userList');
    /*
    const [userList, setUserList] = useState([]);
    const [apcAdminList, setApcAdminList] = useState([]);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [onlineAdmins, setOnlineAdmins] = useState([]);
  */
    useEffect(() => {
        fetchUserList();
        fetchApcAdminList();
        fetchPendingApprovals();
        fetchOnlineAdmins();
    }, []);

    const fetchUserList = async () => {
        try {
            const response = await axios.get('/api/users');
            setUserList(response.data);
        } catch (error) {
            console.error('Error fetching user list:', error);
        }
    };

    const fetchApcAdminList = async () => {
        try {
            const response = await axios.get('/api/apc-admins');
            setApcAdminList(response.data);
        } catch (error) {
            console.error('Error fetching APC admin list:', error);
        }
    };

    const fetchPendingApprovals = async () => {
        try {
            const response = await axios.get('/api/pending-approvals');
            setPendingApprovals(response.data);
        } catch (error) {
            console.error('Error fetching pending approvals:', error);
        }
    };

    const fetchOnlineAdmins = async () => {
        try {
            const response = await axios.get('/api/online-admins');
            setOnlineAdmins(response.data);
        } catch (error) {
            console.error('Error fetching online admins:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`/api/users/${userId}`);
            fetchUserList();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleDeleteApcAdmin = async (adminId) => {
        try {
            await axios.delete(`/api/apc-admins/${adminId}`);
            fetchApcAdminList();
        } catch (error) {
            console.error('Error deleting APC admin:', error);
        }
    };

    const handleApproveAdmin = async (adminId) => {
        try {
            await axios.post(`/api/approve-admin/${adminId}`);
            fetchPendingApprovals();
        } catch (error) {
            console.error('Error approving admin:', error);
        }
    };

    const [userList, setUserList] = useState([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Michael Johnson' },
        { id: 4, name: 'Emily Brown' },
    ]);

    const [apcAdminList, setApcAdminList] = useState([
        { id: 1, name: 'Sarah Lee' },
        { id: 2, name: 'David Kim' },
        { id: 3, name: 'Jessica Park' },
        { id: 4, name: 'Brian Choi' },
    ]);

    const [pendingApprovals, setPendingApprovals] = useState([
        { id: 1, name: 'Alex Rodriguez' },
        { id: 2, name: 'Olivia Hernandez' },
        { id: 3, name: 'Daniel Sanchez' },
        { id: 4, name: 'Sophia Gomez' },
    ]);

    const [onlineAdmins, setOnlineAdmins] = useState([
        { id: 1, name: 'Isabella Diaz', isWorking: true },
        { id: 2, name: 'Juan Gonzalez', isWorking: false },
        { id: 3, name: 'Mia Jimenez', isWorking: true },
        { id: 4, name: 'Lucas Reyes', isWorking: false },
    ]);

    const renderUserList = () => (

        <div className="w-full bg-sub p-6 rounded-lg shadow-md">
            <h3 className="text-lg  font-medium text-gray-800 mb-4">일반 유저 목록</h3>
            <ul>
                {userList.map((user) => (
                    <li key={user.id} className="flex justify-between items-center mb-2">
                        <div className="text-gray-700">{user.name} ({user.id})</div>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                            onClick={() => handleDeleteUser(user.id)}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderApcAdminList = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">APC 관리자 목록</h3>
            <ul>
                {apcAdminList.map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center mb-2">
                        <div className="text-gray-700">{admin.name} ({admin.id})</div>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                            onClick={() => handleDeleteApcAdmin(admin.id)}
                        >
                            삭제
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderPendingApprovals = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">APC 관리자 승인 대기 목록</h3>
            <ul>
                {pendingApprovals.map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center mb-2">
                        <div className="text-gray-700">{admin.name} ({admin.id})</div>
                        <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                            onClick={() => handleApproveAdmin(admin.id)}
                        >
                            승인
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderOnlineAdmins = () => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">접속 중인 관리자 목록</h3>
            <ul>
                {onlineAdmins.map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center mb-2 py-1">
                        <div className="text-gray-700">
                            {admin.name} ({admin.id}) - {admin.isWorking ? '작업 중' : '대기 중'}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <BasicLayout>
            <div className="flex-grow flex justify-center items-center pt-20">
                <div className="w-full max-w-4xl">
                    <h2 className="text-2xl font-bold mb-4 text-sub">관리자 페이지</h2>
                    <div className="mb-4 flex justify-between">
                        <button
                            className={`px-4 py-2 rounded-md ${activeTab === 'userList'
                                ? 'bg-button2 hover:bg-green-700 text-white font-bold'
                                : 'bg-main hover:bg-hov text-sub border-bor'
                                }`}
                            onClick={() => setActiveTab('userList')}
                        >
                            일반 유저 관리
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md ${activeTab === 'apcAdminList'
                                ? 'bg-button2 hover:bg-green-700 text-white font-bold'
                                : 'bg-main hover:bg-hov text-sub border-bor'
                                }`}
                            onClick={() => setActiveTab('apcAdminList')}
                        >
                            APC 관리자 목록
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md ${activeTab === 'pendingApprovals'
                                ? 'bg-button2 hover:bg-green-700 text-white font-bold'
                                : 'bg-main hover:bg-hov text-sub border-bor'
                                }`}
                            onClick={() => setActiveTab('pendingApprovals')}
                        >
                            APC 관리자 승인 대기 목록
                        </button>
                        <button
                            className={`px-4 py-2 rounded-md ${activeTab === 'onlineAdmins'
                                ? 'bg-button2 hover:bg-green-700 text-white font-bold'
                                : 'bg-main hover:bg-hov text-sub border-bor'
                                }`}
                            onClick={() => setActiveTab('onlineAdmins')}
                        >
                            접속 중인 관리자
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeTab === 'userList' && renderUserList()}
                        {activeTab === 'apcAdminList' && renderApcAdminList()}
                        {activeTab === 'pendingApprovals' && renderPendingApprovals()}
                        {activeTab === 'onlineAdmins' && renderOnlineAdmins()}
                    </div>
                </div>
            </div>
        </BasicLayout>
    );

}
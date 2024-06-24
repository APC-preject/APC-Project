// 로그인한 유저 정보 관리
import { create } from 'zustand';


const useUserStore = create((set) => ({
    id: null,
    role : null,
    setUserData: (userData) => set({ id: userData.id, role: userData.role }), // 사용자 정보 설정
    clearUserData: () => set({ id: null }), // 사용자 정보 초기화
    replaceId: (id) => id ? id.replace("_", ".") : null // id 변환 함수
}));

export {useUserStore}
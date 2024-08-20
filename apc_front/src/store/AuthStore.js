// 로그인 상태 관리
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  setUserState: (user, isLoading) => set({ user, isLoading }), // 상태 업데이트 함수 추가
  signOut: async () => {
    try {
      const response = await fetch('/api/auth/logout', { 
        credentials: 'include',
      }); // 캐시 삭제
      set({ user: null, isLoading: false }); // set 함수 사용, 유저를 null으로 설정
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
}));

// onAuthStateChanged(auth, (user) => {
//   useAuthStore.getState().setUserState(user, false); // 상태 업데이트 함수 호출
// });

export {useAuthStore};
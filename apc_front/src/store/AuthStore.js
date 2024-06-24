import { create } from 'zustand';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/FirebaseInstance';

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  setUserState: (user, isLoading) => set({ user, isLoading }), // 상태 업데이트 함수 추가
  signOut: async () => {
    try {
      await signOut(auth);
      set({ user: null }); // set 함수 사용
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUserState(user, false); // 상태 업데이트 함수 호출
});

export {useAuthStore};
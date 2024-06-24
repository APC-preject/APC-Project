import React from 'react';
import BasicLayout from '../../layout/BasicLayout';
import {useAuthStore} from '../../store/AuthStore';
import { useUserStore } from "../../store/UserStore";

export default function ColdStoragePage() {
  const { user } = useAuthStore()
  const { id, role } = useUserStore();

  if (!user || role !=1 || id == null) {
    return(
      <BasicLayout>
        <p className='pt-20 text-3xl text-baritem'>
          계정 권한이 없습니다. <br/> APC관리자 계정으로 로그인 하십시오.
        </p>

      </BasicLayout>
    )
  }

  return (
    <BasicLayout>

      <iframe className='pt-15'
        title="WebGL App"
        src="/APC_GARAGE_fi/index.html"
        style={{ width: '100%', height: '800px', border: 'none' }}
      ></iframe>
      
    </BasicLayout>
  );
}

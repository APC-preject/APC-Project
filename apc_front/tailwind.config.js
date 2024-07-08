/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : { // main은 메인컬러 (주로 배경색), sub는 서브컬러 (주로 글자 색) , bor는 경계선 색, baritem은 sidebar의 그림색, hov는 호버링시 아이템 색
        'textbg' : '#374151',
        'textbgHov' : '#4B5563',
        'main' : ' #1F2937',        
        'sub' : '#FFFFFF',        
        'bor' : '#374151',
        'baritem' : '#809EBA',
        'hov' : '#374151',
        'button' : '#4B6EF6',
        'button2' : '#059669',
        'button3' : '#526E87' ,
        'button4': '#a63d39',
        'buttonHov' : '#1D4ED8',
        'button2Hov' : '#15803D',
        'button4Hov' : '#bf524e',
        'listbg' : '#CCCCCC',      
        'gitblack' : '#000000',
      }
    },
  },
  plugins: [],
}


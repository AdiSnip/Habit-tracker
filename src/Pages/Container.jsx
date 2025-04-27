import React from 'react'

const Container = () => {
  return (
    <div className='flex flex-row justify-center items-center h-screen flex-wrap bg-gray-200'>
      <div className='w-[28%] h-[90%] bg-yellow-200 flex flex-col p-2 gap-2 m-5'>
        <div className='bg-white rounded-2xl h-[30vh] flex justify-center items-center flex-col gap-4'>
          <h1 className='font-bold font-sans text-2xl'>Good Morning! Aditya</h1>
          <div id="level">
            12 lvl
          </div>
          <div className='w-[200px] rounded overflow-hidden h-2 scale-120 bg-zinc-300' id="levelbar">
            <div className='w-[200px] rounded -translate-x-[20%] transition-all ease-in h-2 bg-red-400 '></div>
          </div>
          <div id="quote"><i>life is a lesson</i></div>
        </div>
        <div className='bg-white h-[50vh] w-full rounded-2xl'>

        </div>
      </div>
      <div className='w-[28%] h-[90%] bg-yellow-200 m-5'></div>
      <div className='w-[28%] h-[90%] bg-yellow-200 m-5'></div>
    </div>
  )
}

export default Container
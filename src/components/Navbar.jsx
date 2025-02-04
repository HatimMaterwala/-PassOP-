import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-black flex justify-around items-center px-4 h-13 text-white'> 
      <div className="logo font-bold text-xl">
        <span className='text-green-500'>&lt;</span>Pass<span  className='text-green-500'>OP/&gt;</span>
      </div>
      <div className="github border border-white py-1 bg-green-500 text-black p-2 rounded-full">
        <a className='flex justify-center items-center gap-1' target='_blank' href="https://github.com/HatimMaterwala/-PassOP-">
          <img className='w-6' src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="" />
          <span>GitHub</span>
        </a>
      </div>
    </nav>
  )
}

export default Navbar

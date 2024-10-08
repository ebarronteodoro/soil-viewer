import * as React from 'react'

const CameraDownIcon = props => (
  <svg
    fill='none'
    stroke='#fff'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='1'
    viewBox='0 0 24 24'
    {...props}
  >
    <path d='M0 0h24v24H0z' stroke='none' />
    <path d='M12 20H5a2 2 0 01-2-2V9a2 2 0 012-2h1a2 2 0 002-2 1 1 0 011-1h6a1 1 0 011 1 2 2 0 002 2h1a2 2 0 012 2v3.5' />
    <path d='M9 13a3 3 0 106 0 3 3 0 00-6 0m10 3v6m3-3l-3 3-3-3' />
  </svg>
)

export default CameraDownIcon
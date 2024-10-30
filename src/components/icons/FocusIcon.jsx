const FocusIcon = props => {
  return (
    <svg
      fill='none'
      stroke='#fff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1'
      viewBox='0 0 24 24'
      {...props}
    >
      <path stroke='none' d='M0 0h24v24H0z' />
      <circle cx='12' cy='12' r='.5' fill='currentColor' />
      <path d='M5 12a7 7 0 1 0 14 0 7 7 0 1 0-14 0M12 3v2M3 12h2M12 19v2M19 12h2' />
    </svg>
  )
}

export default FocusIcon

export default function Cross({ fillColor = "#000", crossIconClickHandler = () => { }, size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={fillColor} width={size} height={size} onClick={crossIconClickHandler}>
      <path fillRule="evenodd" d="M4.47 4.47a.75.75 0 0 1 1.06 0L12 10.94l6.47-6.47a.75.75 0 1 1 1.06 1.06L13.06 12l6.47 6.47a.75.75 0 1 1-1.06 1.06L12 13.06l-6.47 6.47a.75.75 0 0 1-1.06-1.06L10.94 12 4.47 5.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd"></path>
    </svg>
  )
}
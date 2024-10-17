import { Link } from "react-router-dom"
export default function NotFound() {
  return (
    <div>
      Error 404 - Page Not Found
      <Link to={"/"}>Go back to home</Link>
    </div>
  )
}

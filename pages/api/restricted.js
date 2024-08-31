import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

const protectedRoute = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}

export default protectedRoute;

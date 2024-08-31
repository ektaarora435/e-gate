// get all passlogs in a day

import authOptions from "@/lib/auth";
import { getServerSession } from "next-auth";

const { default: PassLog } = require("@/models/PassLog");

const getPassLogs = async () => {
  try {
    const res = await fetch(`/api/log`);
    const data = await res.json();
    return data;
  }
  catch (error) {
    console.error(error);
  }
}

const Logs = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "GET") {
      if (session?.user.role === "staff") {
        const passLogs = await PassLog.find({time: {$gte: new Date(new Date().setHours(0o0, 0o0, 0o0)), $lt: new Date(new Date().setHours(23, 59, 59))}}).sort('-time').populate([
          {
            path: 'by',
          },
          {
            path: 'pass',
            populate: {
              path: 'user',
              model: 'Profile',
              select: '-password -email'  // Exclude the password field
            }
          }
        ]).exec();
        res.status(200).send(passLogs);
      }
      else {
        res.send({
          error: "This HTTP method is not allowed.",
        })
      }
    }
  }
  else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}
  


export default Logs;

import { getServerSession } from "next-auth/next"
import authOptions from "@/lib/auth"
import GatePass from "@/models/GatePass";
import Profile from "@/models/Profile";

const GatePasses = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "POST") {
      if (session?.user.role === "resident" || session?.user.role === "staff") {
        const pass = await GatePass.create({user: session.user.id, status: "pending", date: new Date(), purpose: session?.user.role});
        await pass.save();
        
        if (pass) {
          res.status(201).send(pass);
        }
        else {
          res.status(400).send({
            error: "An error occurred while creating the gate pass.",
          })
        }
      } else if (session?.user.role === "visitor") {
        const pass = await GatePass.create({user: session.user.id, status: "pending", date: new Date(), purpose: req.body.purpose});
        await pass.save();
        
        if (pass) {
          res.status(201).send(pass);
        }
        else {
          res.status(400).send({
            error: "An error occurred while creating the gate pass.",
          })
        }
      } else {
        res.status(403).send({
          error: "You are not authorized to create a gate pass.",
        })
      }
    }

    else if (req.method === "GET") {
      let passes = [];
      if (session?.user.role === "visitor") {
        passes = await GatePass.find({user: session.user.id}).sort({date: -1}).where('status').ne('exited')
      } else {
        passes = await GatePass.find({user: session.user.id}).sort({date: -1});
      }
      res.status(200).send(passes);
    }

    else {
      res.send({
        error: "This HTTP method is not allowed.",
      })
    }
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}

export default GatePasses;

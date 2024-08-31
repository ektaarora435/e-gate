import { getServerSession } from "next-auth/next"
import authOptions from "@/lib/auth"
import GatePass from "@/models/GatePass";
import Profile from "@/models/Profile";

const PassDetails = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "POST") {
      if (session?.user.role === "staff") {
        const pass = await GatePass.create({user: session.user.id, status: "pending", purpose: 'resident'});
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
      if (session?.user.role === "staff") {
        
        const pass = await GatePass.findById(req.query.id).populate('user').exec();

        if (pass) {
          res.status(200).send(pass);
        }
        else {
          res.status(404).send({
            error: "QR cannot be verified.",
          })
        }

        } else {
        res.status(403).send({
          error: "You are not authorized to create a gate pass.",
        })
      }
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

export default PassDetails;

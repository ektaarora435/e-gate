import { getServerSession } from "next-auth/next"
import authOptions from "@/lib/auth"
import GatePass from "@/models/GatePass";
import Profile from "@/models/Profile";
import PassLog from "@/models/PassLog";

const checkExpired = (date) => {
  let now = new Date();
  let expires = new Date(date) ;
  expires.setHours(expires.getHours() + 5);
  return now > expires;
}

const PassDetails = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    if (req.method === "POST") {
      if (session?.user.role === "staff") {
        const pass = await GatePass.findById(req.body.id).populate('user');

        if (pass) {
          if (pass.status === 'exited' || pass.status === 'pending' || pass.status === 'approved') {
            const expired = checkExpired(pass.date);
            if (expired) {
              res.status(400).send({
                error: "The gate pass has expired.",
              })
              return;
            }

            pass.entryTime = new Date();
            pass.status = 'entered';
            await pass.save();

            const passLog = await PassLog.create({by:session.user.id, pass: pass.id, time: new Date(), status: 'entered'});
            await passLog.save();
          }
          else if (pass.status === 'entered') {
            pass.exitTime = new Date();
            pass.status = 'exited';

            if (pass.user.role === 'visitor') {
              pass.status = 'expired';
            }

            await pass.save();
            

            const passLog = await PassLog.create({by:session.user.id, pass: pass.id, time: new Date(), status: 'exited'});
            await passLog.save();
          } else if (pass.status === 'expired') {
            res.status(400).send({
              error: "The gate pass has been expired.",
            })
            return;
          }

          res.status(200).send(pass);
        }
        else {
          res.status(400).send({
            error: "An error occurred while approving the gate pass.",
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

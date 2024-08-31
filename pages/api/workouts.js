import DB from "@/lib/db";
import Workout from "@/model/Workout";

export default async function handler(req, res) {
  const db = await DB();
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const workouts = await Workout.find({});
        res.status(200).json({ success: true, data: workouts });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const workout = await Workout.create(req.body);
        res.status(201).json({ success: true, data: workout });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}

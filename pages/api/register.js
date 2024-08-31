import DB from "@/lib/db";
import Profile from "@/models/Profile";
import bcrypt from "bcryptjs";

const register = async (values) => {
    const { email, password, name, phone, role } = values;

    try {
        await DB();

        const userFound = await Profile.findOne({ email });
        if(userFound){
            return {
                error: 'User with this email already exists!'
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Profile({
          name,
          email,
          phone,
          role,
          password: hashedPassword,
        });

        const savedUser = await user.save();
    } catch(e) {
        return {
            error: e.message
        }
    }
}

const handler = async (req, res) => {
    if(req.method === 'POST'){
        const values = req.body;
        const response = await register(values);
        if(response?.error){
            return res.status(400).json({ error: response.error });
        }
        return res.status(200).json({ message: 'Registration successful' });
    }
}

export default handler;

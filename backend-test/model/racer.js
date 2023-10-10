import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    country: {
        type: String,
    }
});

const Racer = mongoose.model("racer", userSchema);

export default Racer;
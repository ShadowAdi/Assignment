import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const MongoDB_CONNECTION = process.env.MongoDB_CONNECTION
        if (!MongoDB_CONNECTION) {
            console.error(`Error: Connection Do not Exist`);
            process.exit(1); // Exit process with failure
        }
        const conn = await mongoose.connect("mongodb+srv://shadowshukla76:DEl8nOof4NwiItJN@assignmenttesting.umrrt.mongodb.net/?retryWrites=true&w=majority&appName=AssignmentTesting");

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;

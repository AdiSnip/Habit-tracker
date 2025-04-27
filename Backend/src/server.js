import connectDB from "./db/connectdb.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
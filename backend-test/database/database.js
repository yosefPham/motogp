import mongoose from "mongoose";
async function connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Kết nối thành công đến MongoDB");
  
    } catch (error) {
      console.error("Lỗi kết nối đến MongoDB:", error);
      throw error;
    } finally {
    }
}
export default connect

// import { MongoClient } from "mongodb";

// const client = new MongoClient("mongodb://localhost:27017");

// async function connect() {
//   try {
//     await client.connect();

//     const database = client.db('world-championship');
//     const movies = database.collection('racer');

//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);

//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// export default connect;
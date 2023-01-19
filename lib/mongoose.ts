import mongoose from 'mongoose';

const mongoDBConection = process.env.MONGODB_URL ? process.env.MONGODB_URL : ""

export async function initMongoose() {

  return await mongoose.connect(mongoDBConection)
    .then(() => console.log('Mongoose Connection Established!'))
    .catch(err => console.log('Error of Connection: ', err))
}
import mongoose from 'mongoose';

async function main() {
  await mongoose.connect('mongodb://localhost:27017/getapet')
  console.log('Conectou com Mongoose!')
}

main().catch((err) => console.log(err))

export default mongoose
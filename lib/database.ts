import mongoose, { Mongoose } from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);




const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
    throw new Error("Missing MONGODB_URI environment variable");
}

interface MongooseConn{
    conn:Mongoose|null;
    promise:Promise<Mongoose>|null;
}

declare global {
    var userMongooseCache: MongooseConn | undefined;
}

const cached:MongooseConn=global.userMongooseCache ?? {
    conn:null,
    promise:null,
};

global.userMongooseCache=cached;
    

const connect = async ()=>{
    if(cached.conn){
        return cached.conn;
    }

    cached.promise=cached.promise||mongoose.connect(mongoUri,{
        bufferCommands:false,
        connectTimeoutMS:10000,
    })

    cached.conn=await cached.promise;
    console.log("mongodb connected successfully");

    return cached.conn;
}

export default connect;

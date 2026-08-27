import mongoose,{ Mongoose} from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);




const MONGO_URI=process.env.MONGO_URI!;

interface MongooseConn{
    conn:Mongoose|null;
    promise:Promise<Mongoose>|null;
}

let cached:MongooseConn=(global as any).mongoose;

if(!cached){
    cached=(global as any).mongoose={
        conn:null,
        promise:null
    }
}
    

const connect = async ()=>{
    if(cached.conn){
        return cached.conn;
    }

    cached.promise=cached.promise||mongoose.connect(MONGO_URI,{
        dbName:"apnasehat",
        bufferCommands:false,
        connectTimeoutMS:10000,
    })

    cached.conn=await cached.promise;
    console.log("mongodb connected successfully");

    return cached.conn;
}

export default connect;

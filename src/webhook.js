import express from 'express'
import dotenv from 'dotenv'
import {Webhook} from 'svix'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import User from './models/User';

dotenv.config()

//add MONGO_URI to env
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to DB')
})
.catch((err)=> console.log(err.message));

const app = express()

app.post(
    '/api/webhooks',
    bodyParser.raw({type:'application/json'}),
    async function(req,res){
        try{
            const payloadString = req.body.toString();
            const svixHeaders = req.headers;

            const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
            const evt = wh.verify(payloadString, svixHeaders);

            //may need to specify attributes ie. name, phone, etc.
            const {id, ... attributes} = evt.data;

            const eventType = evt.type;

            if(eventType === 'user.created'){
                const firstName = attributes.first_name;
                const lastName = attributes.last_name;

                //console.log(firstName);

                const user = new User({
                    clerkUserId: id,
                    firstName: firstName,
                    lastName: lastName,
                })

                await user.save();

               /*
               console.log('User is created') 
                user for testing if needed
                console.log('User ${id} is ${eventType}')
                console.log(attributes)
                */
            }

            res.status(200).json({
                success:true,
                message: 'Webhook received',
            });
        }catch(err){
            res.status(400).json({
                sucess: false,
                message: err.message,
            });
        }
    }
)

const port = process.env.PORT || 3000

/*
app.listen(port, () => {
    console.log('listening on port ${port}');
});
*/
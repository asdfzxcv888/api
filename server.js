import * as fs from "fs";
import * as screenshotone from "screenshotone-api-sdk";
import express from 'express'
import dns from 'dns'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv'


dotenv.config()

const app=express()
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, './client/build')));
app.use(express.json())

function formatDomain(domain) {
    const formattedDomain = domain.replace(/^https:\/\//, '');

    // Check if "www." is already present
    if (formattedDomain.startsWith("www.")) {
        // If it is, return the domain as it is
        return formattedDomain;
    } else {
        // Otherwise, add "www." to the domain
        return "www." + formattedDomain;
    }
}


async function checkDomain(domain) {
    try {
        domain=formatDomain(domain)
        console.log(domain);
        
        const addresses = await dns.promises.resolve(domain);
        // If no error is thrown, domain exists
        return true;
    } catch (error) {
        if (error.code === 'ENOTFOUND') {
            // Domain does not exist
            return false;
        } else {
            // Other error occurred
            throw error;
        }
    }
}



const getscreenshot=async(req,res)=>{

    try {
        const cd=await checkDomain(req.body.url)

        console.log(cd);
        if(cd===false){ res.json({err:'no such domain'});
                        return}
        
                const client = new screenshotone.Client(process.env.ak, process.env.sk);

        // set up options
        const options = screenshotone.TakeOptions.url(req.body.url)
            .delay(3)
            .blockAds(true);

        // generate URL
        const url = await client.generateTakeURL(options); // or generateSignedTakeURL(options) for signed URLs
        console.log(url);


        res.json({url})
        
    } catch (error) {
        
    }

    
}







 import {v2 as cloudinary} from 'cloudinary';
          

 const uploadcloud=async(req,res)=>{
    let xx=''
    let time=''
    let size
    cloudinary.config({ 
        cloud_name: 'ddekbairu', 
        api_key: process.env.clk, 
        api_secret: process.env.clsk
      });
      
     let y= await cloudinary.uploader.upload( req.body.url,
        { public_id: "olympic_flag" }, 
        function(error, result) {console.log(result.url)
            
        xx=result.url
        time=result.created_at
        size=result.bytes

      });

           


      res.json({xx,time,size})
       

 }



 app.post('/getscreenshot',getscreenshot)
 app.post('/uploadcloud',uploadcloud)



 app.listen(5000,()=>{console.log('server up');})
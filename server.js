import cluster from 'cluster'
import os from 'os'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const totalCPUs = os.cpus().length
if (cluster.isPrimary) {
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork()
        
    }
}else {

    const app =express()
    const PORT =process.env.PORT
    app.get('/',(req,res)=>{
        return res.json({
                message:`Hello From Express Server ${process.pid}`
        })
    })
    
    app.listen(PORT,()=>{
        console.log(`Server start at this port ${PORT}`);
        
    })
}
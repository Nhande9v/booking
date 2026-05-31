import mongoose from "mongoose";

export const checkHealth = (req,res)=>{
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toString()
    });
}

export const checkReadiness= (req,res)=>{
    const dbState = mongoose.connection.readyState;
    const isDbConnected = dbState === 1;

    if (isDbConnected){
        return res.status(200).json({
            status: "ready",
            database: "connected",
        })
    }
    return res.status(503).json({
        status: "not ready",
        database: ["disconnected", "connected", "connecting", "disconnecting"]
        [dbState],
    })
}
const mongoose = require("mongoose");
const Papa = require("papaparse")
const {StatusCodes} = require("http-status-codes");
const DashboardModel = require('../models/dashboard.model')
const alertDao = require("../dao/alert.dao")

class ChartController {
    async drawSimple(req,res) {
        const {xaxis , yaxis} = req.body ;
        let bufs = []
        let result;
        const gfs = req.app.locals.gfs;
        
            const file = gfs
                .find({
                    _id: mongoose.Types.ObjectId(req.params.id),
                    "metadata.userId" : req.infos.authId
                })
                .toArray((err, files) => {
                    if (!files || files.length === 0) {
                        return res.status(404).json({
                            err: "no files exist",
                        });
                    }


                });
            gfs.openDownloadStream(mongoose.Types.ObjectId(req.params.id))
                .on("data" , (chunk) => bufs.push(chunk)).on("end" , ()=> {
                const fbuf = Buffer.concat(bufs); 
                result = fbuf.toString();
                const parsed = Papa.parse(result); //convert result to object
                if(parsed.errors.length>0) {
                    return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : parsed.errors}) //error lors du parse
                }
                const data = parsed.data ; //object
                const x = data[0].indexOf(xaxis.replace(/(\r\n|\n|\r)/gm, "")); //nettoyage 
                const y = data[0].indexOf(yaxis.replace(/(\r\n|\n|\r)/gm, ""));
                const dataMap = new Map(); 
                    data.slice(1,-1).map((element) => {
                        const elt = element[y].replace(/(\r\n|\n|\r)/gm, "") //nettoyage des données 
                        if(dataMap.get(element[x])) { 

                            dataMap.set(element[x] , dataMap.get(element[x])+ parseFloat(elt )) //si somme
                        }
                        else {
                            dataMap.set(element[x] ,  parseFloat( elt))
                        }
                    })
                let labels = [];
                    let returnedData = []
                dataMap.forEach((value,key)=>{
                    labels.push(key)
                    returnedData.push(value)
                })
                return res.status(StatusCodes.OK).json({xaxis,yaxis ,   returnedData , labels});
            })

        }





   

    async saveDashboardIntoDataBase(req,res){
        try{   
             const {attribut1 , attribut2,fileId  ,typeOfDashboard , isJoined} = req.body
        const userId = req.infos.authId;
        const dashboardModel = new DashboardModel({fileId,attribut1,attribut2 ,userId,typeOfDashboard,isJoined})
       const result= await dashboardModel.save()
       
        return   res.status(StatusCodes.CREATED).json({result,msg:"chart Saved , You can chek your dashboards List"})
        }
    
     catch (error) {
        console.log(error)
       return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error .. please try again")
        
    }

    }
    async getAllSavedJoinedDashboards(req,res) {
        try {
            const result = await DashboardModel.aggregate([
                {
                    '$match': {
                        'userId': mongoose.Types.ObjectId(req.infos.authId),
                        'isJoined' : true
                    }
                }, {
                    '$lookup': {
                        'from': 'join.files',
                        'localField': 'fileId',
                        'foreignField': '_id',
                        'as': 'file'
                    } ,

                },
                {
                    '$lookup' : {
                        'from': 'alerts',
                        'localField': 'alertId',
                        'foreignField': '_id',
                        'as': 'alert'
                    }
                }
            ])
            const formattedResult = result.filter((elt)=>elt.file.length>0)
            return res.status(StatusCodes.OK).json(formattedResult)
        }catch (e) {
            console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e)
        }
    }

    async getAllSavedDashboard(req,res) {
        try {
            const result = await DashboardModel.aggregate([
                {
                    '$match': {
                        'userId': mongoose.Types.ObjectId(req.infos.authId),
                        'isJoined' : false
                    }
                }, {
                    '$lookup': {
                        'from': 'uploads.files',
                        'localField': 'fileId',
                        'foreignField': '_id',
                        'as': 'file'
                    }
                }, {
                '$lookup' : {
                    'from': 'alerts',
                    'localField': 'alertId',
                    'foreignField': '_id',
                    'as': 'alert'
                }
                }
            ])
            const formattedResult = result.filter((elt)=>elt.file.length>0)

            return res.status(StatusCodes.OK).json(formattedResult)
        }catch (e) {
            console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e)
        }
    }
    async getOneSavedDashboard(req,res){
        try{
            const id = req.params.id;
            const gfs = req.app.locals.gfs;
            let bufs = []
            let result;
            const savedDashboard = await DashboardModel.findOne({_id:id}).populate('alertId')
           // return res.json(savedDashboard)
            //TODO : check null value
            const yaxis = savedDashboard.attribut2;
            const xaxis = savedDashboard.attribut1;
            const file = gfs
                .find({
                    _id: mongoose.Types.ObjectId(savedDashboard.fileId),
                    //"metadata.userId" : req.infos.authId
                })
                .toArray((err, files) => {
                    if (!files || files.length === 0) {
                        return res.status(404).json({
                            err: "no files exist",
                        });
                    }


                });
            gfs.openDownloadStream(mongoose.Types.ObjectId(savedDashboard.fileId))
                .on("data" , (chunk) => bufs.push(chunk)).on("end" , ()=> {
                const fbuf = Buffer.concat(bufs);
                result = fbuf.toString();
                const parsed = Papa.parse(result);
                if(parsed.errors.length>0) {
                    return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : parsed.errors})
                }
                const data = parsed.data ;
                const x = data[0].indexOf(xaxis.replace(/(\r\n|\n|\r)/gm, ""));
                const y = data[0].indexOf(yaxis.replace(/(\r\n|\n|\r)/gm, ""));
                const dataMap = new Map();
                data.slice(1,-1).map((element) => {
                    const elt = element[y].replace(/(\r\n|\n|\r)/gm, "")
                    if(dataMap.get(element[x])) {

                        dataMap.set(element[x] , dataMap.get(element[x])+ parseFloat(elt ))
                    }
                    else {
                        dataMap.set(element[x] ,  parseFloat( elt))
                    }
                })
                let labels = [];
                let returnedData = []
                dataMap.forEach((value,key)=>{
                    labels.push(key)
                    returnedData.push(value)
                })
                return res.status(StatusCodes.OK).json({ data :{xaxis,yaxis ,   returnedData , labels},type:savedDashboard.typeOfDashboard,alert:savedDashboard.alertId});
            })

        }catch (e) {
        console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error")
        }
    }

    async deleteSavedChart (req,res) {
        try{
            const id = req.params.id;
            const isExists = await DashboardModel.findOne({_id:id , "userId":req.infos.authId})
            if(!isExists) {
                return res.json(StatusCodes.NOT_FOUND).json("no chart found")
            }
            const result = await DashboardModel.deleteOne({_id:id})
            return res.json("deleted successfully")

        }catch (e) {
            console.log(e)
            return res.json("error")
        }
    }

    async drawChartForJoinedFiles(req,res) {
        try{
            const gfsJoin = req.app.locals.gfsJoin ;
            const id = req.params.id ;
            const {yaxis,xaxis} = req.body;
            let bufs = []
            let result = ""
            const file = gfsJoin.find( {
                _id: mongoose.Types.ObjectId(id),
            }) .toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: "no files exist",
                    });
                }
            });

            gfsJoin.openDownloadStream(mongoose.Types.ObjectId(id))
                .on("data" , (chunk) => bufs.push(chunk)).on("end" , ()=> {
                const fbuf = Buffer.concat(bufs);
                result = fbuf.toString();
                const parsed = JSON.parse(result);
                let returnedData = []
                let labels = []
                parsed.map((element)=>{
                    returnedData.push(element[yaxis])
                    labels.push(element[xaxis])
                })
                return res.status(StatusCodes.OK).json({xaxis,yaxis ,   returnedData , labels});
            })
        }catch (e) {
            console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error occurred")
        }
    }

    async getOneSavedJoinedDashboard(req,res) {

        try{
            
            const id = req.params.id;
            const gfsJoin = req.app.locals.gfsJoin;
            let bufs = []
            let result;
            const savedDashboard = await DashboardModel.findOne({_id:id})
            const yaxis = savedDashboard.attribut2;
            const xaxis = savedDashboard.attribut1;
            const file = gfsJoin.find( {
                _id: mongoose.Types.ObjectId(savedDashboard.fileId),
            }) .toArray((err, files) => {
                if (!files || files.length === 0) {
                    return res.status(404).json({
                        err: "no files exist",
                    });
                }
            });

            gfsJoin.openDownloadStream(mongoose.Types.ObjectId(savedDashboard.fileId))
                .on("data" , (chunk) => bufs.push(chunk)).on("end" , ()=> {
                const fbuf = Buffer.concat(bufs);
                result = fbuf.toString();
                const parsed = JSON.parse(result);
                let returnedData = []
                let labels = []
                parsed.map((element)=>{
                    returnedData.push(element[yaxis])
                    labels.push(element[xaxis])
                })
                return res.status(StatusCodes.OK).json({ data :{xaxis,yaxis ,   returnedData , labels},type:savedDashboard.typeOfDashboard});
            })

        }catch (e) {
            console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error")
        }


    }

    async addAlertForSimpleFile(req,res) {
        try{
            const id = req.params.id ;
            const {value,operator,attribute} = req.body;
            const result = await DashboardModel.aggregate([
                {
                    '$match': {
                        'userId': mongoose.Types.ObjectId(req.infos.authId),
                        'isJoined' : false,
                        '_id': mongoose.Types.ObjectId(id)
                    }
                }, {
                    '$lookup': {
                        'from': 'uploads.files',
                        'localField': 'fileId',
                        'foreignField': '_id',
                        'as': 'file'
                    }
                }, {
                    '$lookup' : {
                        'from': 'alerts',
                        'localField': 'alertId',
                        'foreignField': '_id',
                        'as': 'alert'
                    }
                }
            ])
            if(!result || result.length ==0) {
                return res.status(StatusCodes.NOT_FOUND).json("no saved dashboard was found")
            }
            if(result[0].alert && result[0].alert.length>0) {
                return  res.status(StatusCodes.BAD_REQUEST).json("this chart already have an alert")
            }
            const addingAlert = await alertDao.addAlert(attribute,value,operator)
            if(addingAlert.success===false){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error in adding alert")
            }
           const dashboardToUpdate = await DashboardModel.findOne({_id:id})
            dashboardToUpdate.alertId=addingAlert.data._id;
           const finalResult= await dashboardToUpdate.save()
            return res.status(StatusCodes.OK).json(finalResult)

        }catch (e) {
            console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error")
        }


    }

    async deleteAlertForSimpleFile(req,res) {
        try{
            const id = req.params.id;
            const savedChart = await DashboardModel.findOne({_id:id})
            if(!savedChart){
                return res.status(StatusCodes.NOT_FOUND).json("no chart found")
            }
            if(!savedChart.alertId) {
                return res.status(StatusCodes.NOT_FOUND).json("no alert found for this chart")
            }
            const alertId = savedChart.alertId;
            savedChart.alertId=null;
            await savedChart.save()
            const deleteAlert = await alertDao.deleteAlert(alertId)
            if(deleteAlert.success===false) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error in deleting")
            }
            return res.status(StatusCodes.OK).json("alert deleted successfully")


        }catch (e) {
        console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error")
        }
    }

    async addAlertForJoinedFile(req,res) {
        try{
            const id = req.params.id ;
            const {value,operator,attribute} = req.body;
            const result = await DashboardModel.aggregate([
                {
                    '$match': {
                        'userId': mongoose.Types.ObjectId(req.infos.authId),
                        'isJoined' : true,
                        '_id': mongoose.Types.ObjectId(id)
                    }
                }, {
                    '$lookup': {
                        'from': 'join.files',
                        'localField': 'fileId',
                        'foreignField': '_id',
                        'as': 'file'
                    }
                }, {
                    '$lookup' : {
                        'from': 'alerts',
                        'localField': 'alertId',
                        'foreignField': '_id',
                        'as': 'alert'
                    }
                }
            ])
            if(!result || result.length ==0) {
                return res.status(StatusCodes.NOT_FOUND).json("no saved dashboard was found")
            }
            if(result[0].alert && result[0].alert.length>0) {
                return  res.status(StatusCodes.BAD_REQUEST).json("this chart already have an alert")
            }
            const addingAlert = await alertDao.addAlert(attribute,value,operator)
            if(addingAlert.success===false){
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error in adding alert")
            }
            const dashboardToUpdate = await DashboardModel.findOne({_id:id})
            dashboardToUpdate.alertId=addingAlert.data._id;
            const finalResult= await dashboardToUpdate.save()
            return res.status(StatusCodes.OK).json(finalResult)

        }catch (e) {
            console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("error")
        }
    }

    async getAlertsForSimpleFiles(req,res) {
        try {
            const result = await DashboardModel.aggregate([
                {
                    '$match': {
                        'userId': mongoose.Types.ObjectId(req.infos.authId),
                        'isJoined' : false
                    }
                }, {
                    '$lookup': {
                        'from': 'uploads.files',
                        'localField': 'fileId',
                        'foreignField': '_id',
                        'as': 'file'
                    }
                }, {
                    '$lookup' : {
                        'from': 'alerts',
                        'localField': 'alertId',
                        'foreignField': '_id',
                        'as': 'alert'
                    }
                }
            ])
            const filteredResult = result.filter((elt)=>elt.alert.length>0)
            return res.status(StatusCodes.OK).json({result: filteredResult})
        }catch (e) {
            console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e)
        }
    }

    async getAlertsForJoinedFiles(req,res) {
        try {
            const result = await DashboardModel.aggregate([
                {
                    '$match': {
                        'userId': mongoose.Types.ObjectId(req.infos.authId),
                        'isJoined' : true
                    }
                }, {
                    '$lookup': {
                        'from': 'join.files',
                        'localField': 'fileId',
                        'foreignField': '_id',
                        'as': 'file'
                    }
                }, {
                    '$lookup' : {
                        'from': 'alerts',
                        'localField': 'alertId',
                        'foreignField': '_id',
                        'as': 'alert'
                    }
                }
            ])
            const filteredResult = result.filter((elt)=>elt.alert.length>0)
            return res.status(StatusCodes.OK).json({result: filteredResult})
        }catch (e) {
            console.log(e)
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e)
        }
    }



}



module.exports = new ChartController()
const express = require('express')
const locationRouter = express.Router()
const Location = require("./../db/models/Location")

async function validateLocation(req,res,next){
    const body = req.body
   
    if(!body.hasOwnProperty('name') || body.name === ""){
        return res.status(400).json({message:"Location Name field is required"})
    }
    if(!body.hasOwnProperty('females') || body.females === ""){
        return res.status(400).json({message:"Number of Female residents is required"})
    }
    if(!body.hasOwnProperty('males') || body.males === ""){
        return res.status(400).json({message:"Number of Male residents is required"})
    }
    const existing = await Location.findOne({name:req.body.name}).exec()
    if (!!existing){
        return res.status(400).json({message:`Location with name ${req.body.name} already exists`})
    }
    next()
}

locationRouter.route('/').get((req,res)=>{
    Location.find({}, (error,locations)=>{
        for (const location of locations) {
             Object.assign(location,{total: location.females + location.males })
        }
        res.status(200).json(locations)
    })
}).post(validateLocation,async (req,res)=>{
    
    let location = new Location(req.body)
    location.save();
    res.status(201).json(location)
});

locationRouter.route("/:id/add").post(validateLocation, (req,res)=>{
    const {id} = req.params;
    Location.findById(id, (error,location)=>{
        if(error) return res.status(500).json(error)
        if(!!location){
            Object.assign(req.body, {parent:location._id})
            const sub = new Location(req.body)
            sub.save()
            res.status(200).json(location)
        }else{
            res.status(404).json({message:`Location with ID ${id} was not found`})
        }
     
    })
})

locationRouter.route('/:id').get( async (req,res)=>{
    const {id} = req.params
    Location.findById(id,async (error,location)=>{
        if(error) return res.json(500).json(error)
        if(!!location){
            let response = {
                location
            }
              Location.find({parent:id},(error,subs)=>{
                    response['subs'] = subs
                     res.json(response)
            })
        }else{
            res.status(404).json({message:`Location with ID ${id} was not found`})
        }
       
        
    })
}).patch((req,res)=>{
    const {id} = req.params
    Location.findById(id,(error,location)=>{
        if(!!location){
            if(req.body._id){
                delete req.body._id;
            }
            for (const item of Object.keys(req.body)) {
                location[item] = req.body[item]
            }
            location.save()
            res.status(200).json(location)
        }else{
            res.status(404).json({message:`Location with ID ${id} is not found`})
        }
    })
}).delete((req,res)=>{
    const {id} = req.params
    Location.findById(id,(error,location)=>{
        if(error) return res.status(400).json(error)
        if(!!location){
            location.remove(error=>{
                if (error) return res.status(400).json(error)
                res.status(200).json({message:"Location removed successfully"})
            })
           
        }else{
            res.status(404).send({message:`Location with ID  ${id} is not found `})
        }
        
    })
})

module.exports = locationRouter
const Academy = require('../models/Academy');
const AcademyProgram= require('../models/AcademyProgram')

module.exports = {
    async createAcademy(req, res){
        const {name, company, telephone_number, address, email, city, location, nearby_amenity, rating} = req.body;
        // console.log(req.files)

        //!
        //! for storing images. Commented Out for a moment. dont forget to uncomment
        // let array = [];
        // req.files.forEach(function(json){
        //     array.push({picture: json.filename});
        //     // console.log(json.filename);
        // })
        //!
        const academy = await Academy.create({
            name,
            company,
            telephone_number,
            address,
            email,
            city,
            location,
            nearby_amenity,
            rating
            // academy_pictures: array
        })
        return res.json(academy);
    }
    ,
    async createProgram(req, res){
        
        const {academy_id, program_name, unit_price, program_type, age_group, hashtag} = req.body;

        const academy = await Academy.findOne({_id: academy_id})
        
        const academy_program = await AcademyProgram.create({
            academy_id, city: academy.city, program_name, program_type, unit_price, age_group, hashtag
        });

        await academy.updateOne({ $push: {programs: academy_program._id}})

        return res.json(academy_program);

        // Search Programs By city & hashtags
    }, async searchPrograms(req, res){
        const {city, hashtags} = req.query;
                try {
            if(city!=='none') {
                const programs = await AcademyProgram.find({$and: [{city: city}, {hashtag: {$all: hashtags.split(',')}}]});
                console.log("search programs", programs)
                res.json({data: programs})
            }
            else if(city=='none') {
                const programs = await AcademyProgram.find({hashtag: {$all: hashtags.split(',')}});
                res.json({data: programs})
            }
            
        } catch(error){
            res.status(404).json({message: error.message});
        }
    }, 
    async searchProgramsByAcademyId(req, res){
        const {id} = req.params;
        try {
            const programs = await AcademyProgram.find({academy_id: id})
            res.status(200).json({data: programs})
        } catch (error) {
            res.status(404).json({messgae: error.message});
        }
    },
    
    async getPrograms(req, res){
        const {page} = req.query

        try {
            const LIMIT = 8;
            const startIndex = (Number(page)-1) * LIMIT; 

            const totalProgramsNum = await AcademyProgram.countDocuments({});

            const programs = await AcademyProgram.find().sort({_id:-1, }).limit(LIMIT).skip(startIndex);;

            // console.log("programs:" , programs);

            res.status(200).json({data: programs, currentPage: Number(page), numberOfPages:Math.ceil(totalProgramsNum/LIMIT)});
        } catch (error) {
            res.status(404).json({message: error.message});
        }
    }, async getProgram(req, res){
        const {id} = req.params;

        try {
            const program = await AcademyProgram.findById(id);
            res.status(200).json(program);
        } catch (error) {
            res.status(404).json({message: error.message});
        }
    }, async searchAcademies(req, res){
        const {city} = req.query;
        console.log(city);
        try {
            const academies = await Academy.find({city})
            res.json({data: academies})
        } catch (error) {
            res.status(404).json({message: error.message});
        }
    },
    async getAcademy(req, res){
        const {id} = req.params;

        try {
            const academy = await Academy.findById(id);
            res.status(200).json(academy);
        } catch (error) {
            res.status(404).json({message: error.message})
        }
    }
}

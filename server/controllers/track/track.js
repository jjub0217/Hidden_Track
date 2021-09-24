const { track,hashtag,user,reply,grade,playlist } = require("../../models")
const db = require("../../models");
const { isAuthorized } = require('../tokenFunctions');

module.exports = {  
   redirect: async (req,res) => {
     const { trackId } = req.params;
     const likes = db.sequelize.models.likes;
  
    if (!trackId) {
      return res.status(400).json({message : 'input values'})
    }

     const allViews = await track.findOne({
       where : { id : trackId }
     })

     if (!allViews) {
      return res.status(404).json({message : 'not found'})
    }

     await track.update({views:allViews.dataValues.views+1 },{
      where : {id : trackId}
     })

     const findTrack = await track.findAll({
       where: { id : trackId },
       attributes : ["id","title","img","genre","releaseAt","soundTrack","lyric"],
       include:[{
         model : user,
         required : true,
         attributes: ["nickName"]
       },
       {
        model : reply,
        attributes : ["content", 'id'],
        include: {
          model : user,
          required : true,
          attributes : ["nickname","profile"]
          }
        },
        {
          model: hashtag,
          attributes : ["tag"]
        }]
     })
    
     console.log(findTrack)
     const {count, rows } = await likes.findAndCountAll({
      where: { trackId : trackId }
     })
     
     const gradeAll = await grade.findAll({
      where : { 
        trackId: trackId,
      }
     })
  
     let sum = 0;
     for(let i =0;i<gradeAll.length;i++){
     sum = sum + gradeAll[i].dataValues.userGrade
     }
     const gradeAev = gradeAll.length !== 0 ? sum/gradeAll.length : 0; 

     res.status(200).json({track:findTrack[0], like: count,gradeAev :gradeAev});
    // res.redirect('https://www.naver.com')
   },

    post: async (req,res) =>{ 
     //req.header -> accesstoken, req.body ->tag(array),title,img,genre,releaseAt,soundtrack,lyric
     const accessTokenData = isAuthorized(req);
     const { tag ,title,img,genre,releaseAt,soundTrack,lyric } = req.body;
     const tagtracks = db.sequelize.models.tagtracks;

    if(!title || !img || !genre || !releaseAt || !soundTrack  ) {
      res.status(400).json({message: "input values"})
    }
    if (!accessTokenData) {
       res.status(401).json({ message : "unauthorized"});
    }
    
    const createTrack = await track.create({
      title : title,
      img : img,
      genre : genre,
      releaseAt : releaseAt,
      soundTrack : soundTrack,
      userId : accessTokenData.id,
      lyric: lyric,
      views : 0
    });

    for(let i =0;i<tag.length;i++){
       const [findHashTag,created] =  await hashtag.findOrCreate({
           where : { tag : tag[i] },
           default : { tag : tag[i] }
        })
        
        await tagtracks.create({
            trackId : createTrack.dataValues.id,
            hashtagId : findHashTag.dataValues.id
        })
    }
    
     res.status(201).json( {trackId: createTrack.id } );
    },

   patch :  async (req,res) =>{ 
    const accessTokenData = isAuthorized(req);
    const { id, tag ,title,img,genre,releaseAt,soundTrack,lyric } = req.body;
    const tagtracks = db.sequelize.models.tagtracks;

    if(!id  ||!title || !img || !genre || !releaseAt || !soundTrack ) {
     res.status(400).json({message: "input values"})
    }
    
    if (!accessTokenData) {
      res.status(401).json({ message : "unauthorized"});
    }
    
    const findTrack = await track.findOne({
      where : {id : id}
    })

    if(findTrack.soundTrack !== soundTrack){
      const url =  findTrack.soundTrack.split('com/')
      s3.deleteObject({
        Bucket: 'hidden-track-bucket', // 사용자 버켓 이름
        Key: `${url[1]}` // 버켓 내 경로
      }, (err, data) => {
        if (err) { throw err; }
        console.log('s3 deleteObject ', data)
      })    
    }
  
    if(findTrack.img !== img){
      const url =  findTrack.img.split('com/')
      s3.deleteObject({
        Bucket: 'hidden-track-bucket', // 사용자 버켓 이름
        Key: `${url[1]}` // 버켓 내 경로
      }, (err, data) => {
        if (err) { throw err; }
        console.log('s3 deleteObject ', data)
      })    
    }

    await track.update({
      title : title,
      img : img,
      genre : genre,
      releaseAt : releaseAt,
      soundTrack : soundTrack,
      userId : accessTokenData.id,
      lyric: lyric,
    },{
    where : { id: id }
    })
    
    for(let i =0;i<tag.length;i++){
      const [findHashTag,created] =  await hashtag.findOrCreate({
          where : { tag : tag[i] },
          default : { tag : tag[i] }
       })
       
    await tagtracks.findOrCreate({
      where :{
             trackId: id,
             hashtagId : findHashTag.dataValues.id
             },
       default :{
        trackId: id,
        hashtagId : findHashTag.dataValues.id
       }       
       }
      )
   }
    res.status(200).json( {trackId: id } );

   },
   delete :  async (req,res) =>{ 
    
   const { id } = req.body;
   const tagtracks = db.sequelize.models.tagtracks;
   const likes = db.sequelize.models.likes;
   
   const findTrack = await track.findOne({
     where : {id : id },
     include : {
       model : hashtag,
       attributes : ["id","tag"]
     }
    })
 
    await tagtracks.destroy({
      where : {trackId : id }
    })
  
   for(let i=0;i<findTrack.hashtags.length;i++ ){
      const {count, rows } = await tagtracks.findAndCountAll({
        where: { hashtagId : findTrack.hashtags[i].id }
       })
       console.log(count)
       if(count===0){
        await hashtag.destroy({
          where : {id : findTrack.hashtags[i].id}
        }) 
       }
   }

   await playlist.destroy({
     where : {trackId : id}
   })
  
   await likes.destroy({
    where : {trackId : id }
  })

   await grade.destroy({
     where: {trackId: id}
   })

   await reply.destroy({
    where: { trackId: id },
  });

  await track.destroy({
    where: { id: id },
  });

    res.status(200).json({message: "ok"});
   }
 }

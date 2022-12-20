const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const { creatPost, addComment } = data.posts;
const { v4: uuidv4 } = require('uuid');

const main = async () => {
    
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();

    // creatPost(
    //     userName,
    //     userId,
    //     status,
    //     title,
    //     content,
    //     imageName,
    //     longitude,
    //     latitude,
    //     petName
    //   )
    const temp1= await creatPost("templateUser1",uuidv4(),"story","I'm Tiger!'","She is Yelling me!",
    "temp1.jpg","-74.0254848","40.7446316","Tiger")

    const temp2= await creatPost("templateUser2",uuidv4(),"story","Hello this is tan","I love sleep zzzzZ",
    "temp2.jpg","-74.0254948","40.7446216","Tan")

    const temp3= await creatPost("templateUser3",uuidv4(),"found","Found a tabby cat on my back yard","Any body know it's owner?",
    "temp3.jpg","-74.0253848","40.7447316","Orange")

    const temp4= await creatPost("templateUser4",uuidv4(),"story","Staring","What to eat this night?",
    "temp4.jpg","-74.0259848","40.7496316","Yui")

    const temp5= await creatPost("templateUser5",uuidv4(),"story","Hey hey hey!!!","Make friend with me!",
    "temp5.jpg","-74.0214848","40.7946316","Lucky")

    const temp6= await creatPost("templateUser6",uuidv4(),"lost","Lost a orange tabby in Stevens Institute of Technology",
    "I bring my cat to school, but he run away. Any body find him please comment me. I am so worry:(",
    "temp6.jpg","-74.0254848","40.7946316","Pumpkin")

    const temp7= await creatPost("templateUser7",uuidv4(),"story","templateTitle7","templateContent",
    "temp7.jpg","-74.0154848","40.7546316","Gracie")

    const temp8= await creatPost("templateUser8",uuidv4(),"story","templateTitle8","templateContent",
    "temp8.jpg","-74.0354848","40.7496316","Kiki")

    const temp9= await creatPost("templateUser9",uuidv4(),"found","templateTitle9","templateContent",
    "temp9.jpg","-74.0354848","40.7846316","Mocha")

    const temp10= await creatPost("templateUser10",uuidv4(),"story","templateTitle10","templateContent",
    "temp10.jpg","-74.1254848","40.7486316","Remi")

    const temp11= await creatPost("templateUser11",uuidv4(),"story","templateTitle11","templateContent",
    "temp11.jpg","-74.2254848","40.8446316","Bella")

    const temp12= await creatPost("templateUser12",uuidv4(),"lost","templateTitle12","templateContent",
    "temp12.jpg","-74.3254848","40.9446316","Max")

    const temp13= await creatPost("templateUser13",uuidv4(),"story","templateTitle13","templateContent",
    "temp13.jpg","-74.2254848","40.6446316","Luna")

    const temp14= await creatPost("templateUser14",uuidv4(),"story","templateTitle14","templateContent",
    "temp14.jpg","-73.8254848","41.2446316","Charlie")

    const temp15= await creatPost("templateUser15",uuidv4(),"found","templateTitle15","templateContent",
    "temp15.jpg","-73.7254848","41.1446316","Milo")

    //addComment(userId, userName, comment, postId)
    const comment1= await addComment( temp11.userId, temp11.userName, "Sweet Kitten!", temp1._id.toString())

    const comment2= await addComment( temp12.userId, temp12.userName, "Have you see a labrador? I'm finding him.", temp1._id.toString())

    const comment3= await addComment( temp13.userId, temp13.userName, "Looks like a tinny tigger loooool", temp1._id.toString())

    const comment4= await addComment( temp14.userId, temp14.userName, "My dog love sleep too, may be they could be friends :D", temp2._id.toString())

    const comment5= await addComment( temp15.userId, temp15.userName, "I wish I could have a cat", temp2._id.toString())

    const comment6= await addComment( temp10.userId, temp10.userName, "Poor little guy, I can adopt it for a while until find its owner.", temp3._id.toString())

    const comment7= await addComment( temp9.userId, temp9.userName, "It looks like my sister's cat. Call me 1234567890", temp3._id.toString())
    
    const comment8= await addComment( temp8.userId, temp8.userName, "Wish you could find him soon.", temp6._id.toString())

    const comment9= await addComment( temp7.userId, temp7.userName, "I see him in xxx park, he is being surrounded and touched. plz go to the park ASAP", temp6._id.toString())

    console.log('Done seeding database');
    dbConnection.closeConnection();
};

main().catch(console.log);
module.exports = {
    checkTitle(title){
        if(!title) throw "You should input a title";
        if(typeof title!== "string") throw "The title should be a string"
        title=title.trim()
        if(title.length===0) throw "The title is empty"
        if(title.length<3) throw "The length of title should bigger than 2"
        return title
    },
    checkUserId(userId){
        if(!userId) throw "wserId is lost";
        if(typeof userId!== "string") throw "The userId should be a string"
        userId=userId.trim()
        if(userId.length===0) throw "The userId is empty"
        return userId
    },
    checkUserName(userName){
        if(!userName) throw "userName is lost"
        if(typeof userName!== "string") throw "The userName should be a string"
        userName=userName.trim()
        if(userName.length===0) throw "The userName is empty"
        return userName
    },
    checkStatus(status){
        if(!status) throw "status is lost"
        if(typeof status!== "string") throw "The status should be a string"
        userName=userName.trim().toLowerCase()
        if(status!=="story"||status!=="lost"||status!=="found") throw "status should be one of in 'story', 'lost', 'found'"
        return status
    },
    checkContent(content){
        if(!content) throw "You should input a content";
        if(typeof content!== "string") throw "The content should be a string"
        content=content.trim()
        if(content.length===0) throw "The content is empty"
        if(content.length<5) throw "The length of content should bigger than 4"
        return content
    },
    checkPetName(petName){
        if(!petName) throw "You should input a petName";
        if(typeof petName!== "string") throw "The petName should be a string"
        petName=petName.trim()
        if(petName.length===0) throw "The petName is empty"
        return petName
    },
    checkLongitude(longitude){
        if(!longitude) throw "Can not get the longitude";
        if(typeof longitude!== "number") throw "The longitude should be a number"
        if(longitude<-180 || longitude>180) throw "The longtitude is out of range"
        return longitude
    },
    checkLatitude(latitude){
        if(!latitude) throw "Can not get the latitude";
        if(typeof latitude!== "number") throw "The latitude should be a number"
        if(latitude<-90 || latitude>90) throw "The latitude is out of range"
        return latitude
    },
    checkImage(image){
        if(!image) throw "You should upload a file";
        if(image instanceof File===false) throw "The type of your upload is not a file"
        if(image['name'].lastIndexOf(".")===-1) throw "The image lost the endfixes"
        let ext = image['name'].slice(image['name'].lastIndexOf(".")+1)
        if(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase())===-1) return "The upload file is not a image"
    },

    checkPage(num){
        if (num === undefined) throw "You should input a page";
        if (typeof num !== "string") throw "The input page should be a string"

        num=num.trim()
        if(num.length===0) throw "The input page is an empty string"
        if (! /^[0-9]+$/.test(num)) throw "The page could only conclude numbers";
        num=Number(num)
        if (num<1 || num%1 !== 0) throw "The page should be a positive integer"

        return num.toString()
    }
}
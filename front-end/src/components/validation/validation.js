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
        if(!userName) throw "userName is lost, please check"
        if(typeof userName!== "string") throw "The userName should be a string"
        userName=userName.trim()
        if(userName.length===0) throw "The userName should not be empty string"
        if(userName<4) throw "The userName should be at least 4 characters"
        return userName
    },
    checkStatus(status){
        if(!status) throw "status is lost"
        if(typeof status!== "string") throw "The status should be a string"
        status=status.trim()
        if(status.toLowerCase()!=="story"&&status.toLowerCase()!=="lost"&&status.toLowerCase()!=="found") throw "status should be one of in 'story', 'lost', 'found'"
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
        if(['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase())===-1) throw "The upload file is not a image"
        return image
    },
    checkPassword(password){
        if(!password) throw "You should input a password";
        if(typeof password!== "string") throw "The password should be a string"

        if(password.length===0) throw "The password should not be empty"
        if(password.length<8) throw "The password should include at least 8 characters"

        const pwdRegex = new RegExp("^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[_!@#\\$%\\^&\\*`~()\\-\\+=])[0-9a-zA-Z_!@#\\$%\\^&\\*`~()\\-\\+=]{8,30}$")
        if (!pwdRegex.test(password)) throw "The password should contain upper and lower case letters, numbers and special symbols '`_!@#$%^&*~()-+=', and the length between 8-30 bits"
        
        return password
    },
    checkNewPassword(password){
        if(!password) throw "You should input the new password";
        if(typeof password!== "string") throw "The new password should be a string"

        if(password.length===0) throw "The new password should not be empty"
        if(password.length<8) throw "The new password should include at least 8 characters"

        const pwdRegex = new RegExp("^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[_!@#\\$%\\^&\\*`~()\\-\\+=])[0-9a-zA-Z_!@#\\$%\\^&\\*`~()\\-\\+=]{8,30}$")
        if (!pwdRegex.test(password)) throw "The new password should contain upper and lower case letters, numbers and special symbols '`_!@#$%^&*~()-+=', and the length between 8-30 bits"
        
        return password
    },
    checkEmail(email,...theArgs){
        if(!email) throw "You should input a email";
        if(typeof email !== 'string') throw "The email should be a string.";
        if(theArgs.length>0) throw "The email place should be only 1 input.";
        if(!email.includes('@')) throw "There should include a '@' in the email.";
        if(email.includes(' ')) throw "The space should not include in the email address";

        email=email.trim()
        if(email.slice(0,email.lastIndexOf('@')).trim().length===0) throw "The email address name should not be empty"

        let emailDomain=email.slice(email.lastIndexOf('@')+1).trim()
        if(emailDomain.length === 0) throw "The emailDomain should not be an empty string.";
        if(!emailDomain.includes('.')) throw "There should include a '.' in the emailDomain.";
        if(!/^[a-zA-Z]*$/.test(emailDomain[0])) throw "The first position of emailDomain must be a letter.";
        if(emailDomain.slice(emailDomain.lastIndexOf('.')).slice(1).length<2) throw "At Least 2 LETTERS after the dot of the emailDomain.";
        if(Number(emailDomain.slice(emailDomain.lastIndexOf('.')).slice(1))) throw "The last dot cannot be followed by a number only in the emailDomain.";
        return email
    }
}
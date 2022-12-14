const gm = require('gm').subClass({
    imageMagick: '7+',
//	 appPath: String.raw`C:\Program Files\ImageMagick\magick.exe` 
   });

//inputPath should be a string like "my/imput/path/image.png", ".png" could change to any other type
//outputPath should be a string like "my/output/path/output.jpeg", suggest using .jpeg because it takes up less memory
//"output" could be change to other name
module.exports = {
    shrinkImage(inputPath,outputPath){
        if (!inputPath||!outputPath) throw "You should input both inputPath and outputPath"
        if (typeof inputPath!== "string") throw "inputpath should be a string"
        if (typeof outputPath!== "string") throw "outputPath should be a string"
        inputPath=inputPath.trim()
        outputPath=outputPath.trim()
        if (inputPath.length===0) throw "inputpath should not be an empty string"
        if (outputPath.length===0) throw "outputPath should not be an empty string"
        gm(inputPath)
        .resize(1024,1024)
        .write(outputPath, function(err) {
            if (err) console.log(err)
            else console.log("Shrink image successfull")
        })
    }
}
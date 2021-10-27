const fs = require('fs-extra')
const path = require('path')

const Jimp = require('jimp')

const maskFolder = path.resolve(__dirname, '../src/assets/resources/masks/')
// const outputFolder = '../src/assets/resources/unmasked/'

;(async () => {
    
    /* Remove unmasked images prior */
    // await fs.emptyDir(outputFolder)
    
    /* Save data to file */
    const data = []
    const saveData = async (data) => {
        let jsonData = `export const data = ` + JSON.stringify(data, null, 2)
    
        await fs.writeFile(`${maskFolder}/../maskData.js`, jsonData)
    }
        
    /* Get mask data */
    const getMaskData = async (file) => {
        try {
            const imgData = {}
    
            /* Load image */
            const image = await Jimp.read(`${maskFolder}/${file}`);

    
            /* Our mask exact color */
            // const maskColor = Jimp.rgbaToInt(0, 255, 1, 255)
            const maskColor = Jimp.rgbaToInt(96, 252, 28, 255)
            // const maskColor = Jimp.rgbaToInt(255, 255, 255, 0);
    
    
            /* Scan image for mask colors and save mask coordinates */
            const xArr=[], yArr=[]
    
            image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
                // x, y is the position of this pixel on the image
                // idx is the position start position of this rgba tuple in the bitmap Buffer
                // this is the image
        
                if(image.getPixelColor(x, y) == maskColor) {
                    xArr.push(x)
                    yArr.push(y)
                }
            });
    
    
            /* Calculate mask size */
            const maskX = Math.min(...xArr) - 10
            const maskY = Math.min(...yArr) - 5
            const sizeW = Math.max(...xArr) - Math.min(...xArr) + 20
            const sizeH = Math.max(...yArr) - Math.min(...yArr) + 20
    
    
            /* Detect if mask is square or circle */
            const square = image.getPixelColor(Math.min(...xArr), Math.max(...yArr)) == maskColor
    
    
            /* Change mask pixel color after scan so that we can detect circle/square with original mask color */
            // for(const i in xArr)
            //     image.setPixelColor(Jimp.rgbaToInt(255, 255, 255, 255), xArr[i], yArr[i])
    
    
            /* Save image data */
            if(xArr.length) {
                imgData.mask = 1
                imgData.width = image.bitmap.width
                imgData.height = image.bitmap.height
                imgData.maskW = sizeW
                imgData.maskH = sizeH
                imgData.maskX = maskX
                imgData.maskY = maskY
            }
    
            imgData.circle = !square
            imgData.file = file
            data.push(imgData)    
    
            /* Resize image */
            // image.resize(Jimp.AUTO, 300)
    
            /* Save file */
            // file = file.replace(/_mask/, '') /* Remove mask from file name */
            // image.write(outputFolder + file)

        } catch(error) {
            console.log(`Error loading image -> ${error}`)
        }
    }
    
    
    /* Run */
    /* Read masked images and create nomasked images */
    const files = await fs.readdir(maskFolder)
    for(const i in files)
        await getMaskData(files[i])
    
    console.log(data)
        
    await saveData(data)
})().catch(error => {
    console.log(`Error -> ${error}`)
});
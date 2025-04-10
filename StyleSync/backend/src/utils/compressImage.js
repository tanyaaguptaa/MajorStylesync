const compressImage = async (imageBuffer, mimeType = 'image/jpeg') => {
    try {
      const { default: imagemin } = await import("imagemin");
      const imageminMozjpeg = (await import("imagemin-mozjpeg")).default;
      const imageminPngquant = (await import("imagemin-pngquant")).default;
  
      // Compress the image buffer
      const compressedImageBuffer = await imagemin.buffer(imageBuffer, {
        plugins: [
          imageminMozjpeg({ quality: 50 }),
          imageminPngquant({ quality: [0.6, 0.8] }),
        ],
      });
  
      // Convert Uint8Array to binary string
      const binaryString = Array.from(compressedImageBuffer)
        .map(byte => String.fromCharCode(byte))
        .join('');
  
      // Convert binary string to Base64
      const base64String = Buffer.from(binaryString, 'binary').toString('base64');
      // Return data URL format
      return `${base64String.replace('dataimage/jpegbase64','')}`;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw new Error("Image compression failed");
    }
  };
  
  module.exports = compressImage;
  
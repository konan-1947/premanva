// Hàm sao chép ảnh vào clipboard
async function copyImageToClipboard(imageSrc) {
    try {
        const response = await fetch(imageSrc);
        const blob = await response.blob();
        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
        ]);
        console.log("Image copied to clipboard:", imageSrc);
    } catch (error) {
        console.error("Failed to copy image to clipboard:", error.message);
    }
}
// Trả về chính phần tử DOM để console.log trực tiếp
function getElementInfo(element) {
    return element;
}

// Tìm phần tử cha gần nhất có thuộc tính draggable="true"
//    - includeSelf: true → kiểm tra luôn cả phần tử đầu vào
function findNearestDraggableParent(element, includeSelf = false) {
    let current = includeSelf ? element : element.parentElement;
    while (current && current !== document.documentElement) {
        if (current.getAttribute("draggable") === "true") {
            return current;
        }
        current = current.parentElement;
    }
    return null;
}

// Kiểm tra các thẻ <img> con trong phần tử (ở mọi cấp)
function checkImgChild(element) {
    const images = element.querySelectorAll("img");
    if (images.length > 0) {
        const srcList = Array.from(images).map(img => img.src || "No src attribute");
        return srcList;
    }
    return [];
}

function logInteraction(action, target, includeSelf = false) {
    const elementInfo = getElementInfo(target);
    const draggableParent = findNearestDraggableParent(target, includeSelf);

    console.group(`%c[${action}]`, 'color: green; font-weight: bold;');

    console.log('Target Element:', elementInfo);

    if (draggableParent) {
        console.log('📍 Nearest Draggable Parent:', draggableParent);
        const imgInfo = checkImgChild(draggableParent);
        if (imgInfo.length > 0) {
            console.log('Image(s) in Draggable Parent:', imgInfo);
            console.groupEnd();
            return imgInfo[0]; // Trả về URL của ảnh đầu tiên
        } else {
            console.log('No <img> descendants in Draggable Parent');
            console.groupEnd();
            return null; // Trả về null nếu không có ảnh
        }
    } else {
        console.log('📍 Nearest Draggable Parent: None');
        console.groupEnd();
        return null; // Trả về null nếu không có draggable parent
    }
}

async function copyImageToClipboard(imageUrl) {
    try {
        if (!imageUrl?.startsWith('https://')) {
            throw new Error('URL ảnh không hợp lệ');
        }

        const response = await fetch(imageUrl, { mode: 'cors' });
        if (!response.ok) {
            throw new Error('Không thể tải ảnh từ URL');
        }

        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) {
            throw new Error('Dữ liệu không phải ảnh');
        }

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        const blobUrl = URL.createObjectURL(blob);
        img.src = blobUrl;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error('Không thể tải ảnh'));
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);

        URL.revokeObjectURL(blobUrl);
        console.log('Ảnh đã được sao chép vào clipboard');
    } catch (error) {
        console.error('Lỗi khi sao chép ảnh:', error);
    }
}

async function simulateCtrlVPaste() {
    try {
        const targetElement = document.querySelector('main')
        if (!targetElement) {
            throw new Error('Không tìm thấy phần tử mục tiêu để dán ảnh');
        }

        const dataTransfer = new DataTransfer();
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
            if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                const blob = await item.getType(item.types.find(type => type.startsWith('image/')));
                dataTransfer.items.add(new File([blob], 'pasted-image.png', { type: blob.type }));
                break;
            }
        }

        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: dataTransfer,
            bubbles: true,
            cancelable: true
        });

        targetElement.dispatchEvent(pasteEvent);
        console.log('Đã dán ảnh vào trang');
    } catch (error) {
        console.error('Lỗi khi dán ảnh:', error);
        throw error; // Ném lỗi để hàm tổng xử lý
    }
}

async function copyAndPasteImage(imageUrl) {
    if (imageUrl) {
        try {
            await copyImageToClipboard(imageUrl);
            await simulateCtrlVPaste();
        } catch (error) {
            console.error('Lỗi trong quá trình sao chép và dán ảnh:', error);
        }
    }

}


async function simulateCtrlZ() {
    try {
        // Tìm phần tử mục tiêu để gửi sự kiện (tương tự cách chọn trong hàm Ctrl+V)
        const targetElement = document.querySelector('main')

        if (!targetElement) {
            console.error('Không tìm thấy phần tử mục tiêu để gửi sự kiện Ctrl + Z');
            return;
        }

        // Tạo sự kiện keyboard cho Ctrl + Z
        const ctrlZEvent = new KeyboardEvent('keydown', {
            key: 'z',
            code: 'KeyZ',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        });

        // Gửi sự kiện đến phần tử mục tiêu
        targetElement.dispatchEvent(ctrlZEvent);
        console.log('Đã mô phỏng hành động Ctrl + Z');
    } catch (err) {
        console.error('Lỗi khi mô phỏng Ctrl + Z: ', err);
    }
}



// 🖱️ Đăng ký sự kiện click
document.addEventListener("click", async (event) => {
    const url = logInteraction("Click", event.target, false);
    console.log(url);
    if (url && !url.includes("signer")) {
        await simulateCtrlZ();
        await copyAndPasteImage(url);
    }

});

document.addEventListener("dragend", async (event) => {
    const url = logInteraction("Dragend", event.target, true);
    console.log(url);
    if (url && !url.includes("signer")) {
        await simulateCtrlZ();
        await copyAndPasteImage(url);
    }
});

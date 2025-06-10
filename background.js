// background.js
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.method === 'POST' && details.url.includes('canva.com')) {
            let payload = null;
            if (details.requestBody) {
                if (details.requestBody.raw) {
                    try {
                        payload = new TextDecoder().decode(details.requestBody.raw[0].bytes);
                    } catch (e) {
                        payload = 'Error decoding payload';
                    }
                } else if (details.requestBody.formData) {
                    payload = details.requestBody.formData;
                }
            }

            const logData = {
                type: 'Request Initiated',
                url: details.url,
                method: details.method,
                requestType: details.type,
                timestamp: new Date(details.timeStamp).toISOString(),
                ...(payload && { payload })
            };

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs[0]) {
                    console.log('Debug: Gửi request info tới content script:', details.url);
                    chrome.tabs.sendMessage(tabs[0].id, logData);
                } else {
                    console.log('Debug: Không tìm thấy tab hoạt động');
                }
            });
        } else {
            console.log('Debug: Bỏ qua request:', details.url, details.method);
        }
    },
    { urls: ["*://*.canva.com/*"] },
    ['requestBody']
);
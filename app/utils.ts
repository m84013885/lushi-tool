/**
* 将文本复制到剪贴板
* @param text - 要复制的文本
* @returns Promise<boolean> - 表示是否成功复制的 Promise
*/
export async function copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard && navigator.permissions) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text to clipboard:', err);
            return false;
        }
    } else {
        // Clipboard API 不可用时的回退方案
        return fallbackCopyTextToClipboard(text);
    }
}

/**
* 回退方案: 将文本复制到剪贴板
* @param text - 要复制的文本
* @returns boolean - 表示是否成功复制
*/
function fallbackCopyTextToClipboard(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // 避免在 iOS 上的视觉跳动
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let success = false;
    try {
        success = document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
    return success;
}
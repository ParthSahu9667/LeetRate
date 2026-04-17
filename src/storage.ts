/**
 * Handles chrome.storage interactions for the Clist API Key.
 */

export async function getClistToken(): Promise<string | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(["clistAuthToken"], (result) => {
            resolve(result.clistAuthToken || null);
        });
    });
}

export async function setClistToken(token: string): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.set({ clistAuthToken: token }, () => {
            resolve();
        });
    });
}

export async function removeClistToken(): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.local.remove("clistAuthToken", () => {
            resolve();
        });
    });
}

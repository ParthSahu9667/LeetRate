import { getClistToken, setClistToken, removeClistToken } from './storage';
import { validateClistToken } from './api/clist';

const CONFIG_URL = "https://clist.by/api/v4/doc/";

const initPopup = async () => {
    const appEl = document.getElementById("app");
    if (!appEl) return;

    const render = async () => {
        const token = await getClistToken();
        if (token) {
            renderMain(appEl, token);
        } else {
            renderSetup(appEl);
        }
    };

    const parseToken = (input: string): string => {
        let text = input.trim();
        
        // Match query params
        const urlParamsMatch = text.match(/[\?&]username=([^&]+).*?[\?&]api_key=([^&]+)/) || text.match(/[\?&]api_key=([^&]+).*?[\?&]username=([^&]+)/);
        if (urlParamsMatch) {
            const urlObj = new URL('http://dummy' + (text.startsWith('?') ? text : '?' + text));
            const user = urlObj.searchParams.get('username');
            const key = urlObj.searchParams.get('api_key');
            if (user && key) return `${user}:${key}`;
        }

        // Match "ApiKey value"
        const apiKeyMatch = text.match(/ApiKey\s+([^\s]+)/i);
        if (apiKeyMatch && apiKeyMatch[1]) {
            return apiKeyMatch[1];
        }

        // Match generic "username:key" structure 
        if (!text.includes(" ") && text.includes(":")) {
             return text;
        }

        return text;
    };

    const renderSetup = (container: HTMLElement) => {
        container.innerHTML = `
            <div class="h-full flex flex-col p-6 bg-zinc-950 animate-in fade-in duration-300">
                <div class="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" class="text-orange-500" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    <h1 class="text-lg font-semibold text-zinc-100">Connect CLIST</h1>
                </div>

                <p class="text-zinc-400 text-sm mb-6">Enter your API key to get started.</p>

                <div class="flex-1 mt-6">
                    <div class="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-inner">
                        <ol class="list-decimal text-[13px] text-zinc-300 space-y-3 ml-4">
                            <li class="pl-1">
                                <a href="${CONFIG_URL}" target="_blank" class="text-orange-400 hover:text-orange-300 transition-colors font-medium border-b border-orange-500/30 pb-0.5">Open CLIST API Page</a>
                                <span class="text-zinc-500 block text-[11px] mt-0.5">(Ensure you are logged in)</span>
                            </li>
                            <li class="pl-1">Under the <strong>Authentication</strong> section, click the blue <strong>"here"</strong> link.</li>
                            <li class="pl-1">In the <strong>"How to use?"</strong> box that appears, copy the entire <strong>Authorization</strong> line.</li>
                        </ol>
                    </div>
                </div>

                <div class="mt-auto space-y-4 pt-4">
                    <div>
                        <input type="text" id="api-key-input" placeholder="Paste your API key sequence here" 
                            class="w-full bg-zinc-900/80 border border-zinc-700/80 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-3.5 py-3 text-[13px] text-zinc-100 placeholder-zinc-500 outline-none transition-all shadow-sm">
                        <p id="error-msg" class="text-red-400 text-xs mt-1.5 hidden animate-in slide-in-from-top-1">Please enter a valid API key string.</p>
                    </div>

                    <button id="save-btn" disabled 
                        class="w-full bg-zinc-100 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-zinc-900 font-semibold py-3 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2">
                        Save API Key
                    </button>
                </div>
            </div>
        `;

        const input = document.getElementById("api-key-input") as HTMLInputElement;
        const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;
        const errorMsg = document.getElementById("error-msg") as HTMLElement;

        setTimeout(() => input.focus(), 100);

        input.addEventListener("input", () => {
            saveBtn.disabled = input.value.trim().length === 0;
            if (!errorMsg.classList.contains("hidden")) {
                errorMsg.classList.add("hidden");
            }
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !saveBtn.disabled) {
                saveBtn.click();
            }
        });

        saveBtn.addEventListener("click", async () => {
            const val = input.value;
            const parsed = parseToken(val);
            if (!parsed || parsed.length < 10) {
                errorMsg.textContent = "Please enter a valid API key string.";
                errorMsg.classList.remove("hidden");
                return;
            }

            // show loading
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<svg class="animate-spin h-4 w-4 text-zinc-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...`;
            
            errorMsg.classList.add("hidden");

            const isValid = await validateClistToken(parsed);
            if (!isValid) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = `Save API Key`;
                errorMsg.textContent = "Invalid API key sequence. Please try again.";
                errorMsg.classList.remove("hidden");
                return;
            }
            
            await setClistToken(parsed);
            
            render();
        });
    };

    const renderMain = (container: HTMLElement, token: string) => {
        container.innerHTML = `
            <div class="h-full flex flex-col p-6 bg-zinc-950 animate-in fade-in zoom-in-95 duration-300">
                <div class="flex items-center gap-2 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" class="text-orange-500" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    <h1 class="text-lg font-semibold text-zinc-100">LeetRate Active</h1>
                </div>
                
                <p class="text-zinc-400 text-[13px] mb-6 leading-relaxed">
                    Integration is active.<br/><br/>
                    Ratings are hidden by default. Open any LeetCode problem to click and reveal its Clist.by rating.
                </p>

                <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-sm mb-auto">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase">Connection</span>
                        <div class="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 shadow-sm text-[10px] font-medium tracking-wide uppercase">
                            <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                            Connected
                        </div>
                    </div>
                </div>

                <div class="mt-auto">
                    <button id="change-btn" 
                        class="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-[13px] font-medium py-2.5 rounded-xl transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-zinc-400" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        Change API Key
                    </button>
                </div>
            </div>
        `;

        const changeBtn = document.getElementById("change-btn") as HTMLButtonElement;
        changeBtn.addEventListener("click", async () => {
            await removeClistToken();
            render();
        });
    };

    render();
};

initPopup();

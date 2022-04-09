import { app, BrowserWindow } from "electron";

export class Main {
    private mainWindow: BrowserWindow | null = null;

    private async createMainWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1720,
            height: 980,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            resizable: false,
        });
        this.mainWindow.loadFile('../render/index.html');
    }

    getWindow() {
        if (!this.mainWindow) {
            throw new Error("Window not ready");
        }
        return this.mainWindow;
    }

    async start() {
        await app.whenReady();
        await this.createMainWindow();
    }
}
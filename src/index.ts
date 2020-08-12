import { EventEmitter } from "events";
import { getRuntime, merge } from "./utils";

export class Storage<T> extends EventEmitter {

    storage: T | null = null;
    isUpdating: boolean = false;
    updateQueue: Array<[T, (value?: T | PromiseLike<T>) => void]> = [];

    constructor(defaultSettings: T) {
        super();
        (async () => {
            try {
                this.storage = await this.loadStorage();
            } catch (err) {
                console.error(err);
                chrome.storage.local.set(defaultSettings);
                this.storage = defaultSettings;
            } finally {
                this.emit("ready");
            }
        })();
    }

    get(key: keyof T) {
        if (!this.storage) {
            return null;
        }
        return this.storage[key];
    }

    loadStorage() {
        return new Promise<T>((resolve, reject) => {
            chrome.storage.local.get(null, (settings) => {
                if (settings) {
                    resolve(settings as T);
                } else {
                    reject("Settings not exists.");
                }
            });
        });
    }

    updateStorage(settings: T) {
        return new Promise<T>((resolve, reject) => {
            if (getRuntime() === "extension") {
                this.updateQueue.push([settings, resolve]);
                this.run();
            } else {
                reject("It works on extension only.");
            }
        });
    }

    run() {
        console.log("Update settings requested");
        if (this.updateQueue.length === 0) {
            console.warn("SettingsManager", "There's no item in settings queue!");
            return;
        }

        if (this.isUpdating) {
            console.log("settings currently updating...");
            return;
        }

        this.isUpdating = true;
        const request = this.updateQueue.shift();
        console.log("Deep merge result", merge(this.storage, request![0]));
        chrome.storage.local.set(merge(this.storage, request![0]), async () => {
            this.storage = await this.loadStorage();
            this.isUpdating = false;
            request![1](this.storage);
            console.log("Update succeeded");
            if (this.updateQueue.length) {
                this.run();
            }
        });
    }
}

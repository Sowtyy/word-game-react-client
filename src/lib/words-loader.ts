import localforage from "localforage";

interface WordsLoaderOptions {
  storeName: string,
  storageName: string
}

export class WordsLoader {
  readonly words_url = "api/words.json";
  readonly words_sub_storage_name = "words";
  readonly timestamp_sub_storage_name = "timestamp";
  
  store_name: string;
  storage_name: string;

  localForage: LocalForage;
  
  constructor({storeName, storageName}: WordsLoaderOptions) {
    this.store_name = storeName;
    this.storage_name = storageName;

    this.localForage = localforage.createInstance({name: storeName, storeName: storageName});
  }

  private _fetch_words(fetchOptions?: RequestInit) {
    return fetch(this.words_url, fetchOptions);
  }

  private async _fetch_words_timestamp() {
    const response = await this._fetch_words({method: "HEAD"});
    const rawLastModified = response.headers.get("Last-Modified");
    if (!rawLastModified) return;
    return new Date(rawLastModified).getTime();
  }

  private _load_words_timestamp() {
    return this.localForage.getItem<number>(this.timestamp_sub_storage_name);
  }

  private _save_words_timestamp(timestamp: number) {
    return this.localForage.setItem(this.timestamp_sub_storage_name, timestamp);
  }
  
  async load_words() {
    return (await this.localForage.getItem<string[]>(this.words_sub_storage_name)) ?? [];
  }

  async save_words(words: string[]) {
    await this.localForage.setItem(this.words_sub_storage_name, words);
    await this._save_words_timestamp((new Date()).getTime());
    return words;
  }
  
  async fetch_words() {
    const response = await this._fetch_words();
    const newWords = await response.json() as string[];
    return newWords;
  }

  async check_words_updates() {
    const currentTimestamp = await this._load_words_timestamp();
    if (!currentTimestamp) return true;
    const latestTimestamp = await this._fetch_words_timestamp();
    if (!latestTimestamp) return false;
    return currentTimestamp < latestTimestamp;
  }

  async fetch_words_then_save() {
    const newWords = await this.fetch_words();
    await this.save_words(newWords);
    return newWords;
  }

  async load_or_fetch_then_save() {
    const saved = await this.load_words();
    if (!saved || !saved.length) {
      return await this.fetch_words_then_save();
    }
    return saved;
  }
}

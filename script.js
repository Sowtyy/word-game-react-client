const defaultDataObj = {searchChar: "", usedWords: "[]"};
let manifest;
let currentLanguage = navigator.language.split("-")[0];

let languages = {
  defaultLanguage: "",
  availableLanguages: [],
  languages: {}
};


String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
  "use strict";
  var str = this.toString();
  if (arguments.length) {
    var t = typeof arguments[0];
    var key;
    var args = ("string" === t || "number" === t) ?
        Array.prototype.slice.call(arguments)
        : arguments[0];

    for (key in args) {
        str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
    }
  }
  return str;
};

async function deleteData(names) {
  for (const name of names) {
    await localforage.removeItem(name);
  }
}

async function checkDataExists() {
  for (const [name, value] of Object.entries(defaultDataObj)) {
    if (!(await localforage.getItem(name))) {
      await localforage.setItem(name, value);
    }
  }
}
async function checkLanguageDataExistsAndChangeLanguage() {
  const savedLanguage = await localforage.getItem("language")

  if (!savedLanguage) {
    await localforage.setItem("language", currentLanguage);
  }
  else {
    currentLanguage = savedLanguage;
  }
}

function upperFirstCharLowerElse(string) {
  return `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`;
}

function appendPreviousWords(newWord) {
  const previousWords = document.getElementById("previous-words");

  if (previousWords.value) {
    previousWords.value += "\n";
  }
  
  previousWords.value += upperFirstCharLowerElse(newWord);
  previousWords.scrollTop = previousWords.scrollHeight;
}

async function updateInputWordPlaceholder() {
  const element = document.getElementById("input-word");
  const searchChar = await localforage.getItem("searchChar");

  element.placeholder = searchChar ? getTranslation("start_with_value", [searchChar]) : getTranslation("start_with_any_character");
}

async function updatePreviousWordsNumber() {
  const previousWordsNumber = document.getElementById("previous-words-number");

  const usedWordsString = await localforage.getItem("usedWords");
  const usedWords = usedWordsString ? JSON.parse(usedWordsString) : [];

  previousWordsNumber.textContent = getTranslation("words_used", [usedWords.length]);
}

function updateTexts() {
  document.getElementById("body-title").textContent = getTranslation("word_game");
  document.getElementById("link-root").textContent = getTranslation("main_page");
  document.getElementById("reset-button").textContent = getTranslation("reset_progress");
  document.getElementById("language-change").textContent = getTranslation("language");
  
  document.getElementById("submit-word").value = getTranslation("submit");
  
  updatePreviousWordsNumber();
  updateInputWordPlaceholder();
}

function getTranslation(key, format = {}, language = "") {
  return languages.languages[language || currentLanguage][key].formatUnicorn(format);
}

async function getAndSetManifest() {
  const res = await fetchWrapper(`${HOSTNAME_PORT_SUBDIR}/manifest.json`);

  if (!res.ok) {
    console.error("Error fetching manifest:", res.status, res.error);
  }

  manifest = res.json;
  console.log(`manifest: Name: ${manifest.name}. Author: ${manifest.author}. Version: ${manifest.version}. Date: ${manifest.date}.`);

  return manifest;
}

async function getAndSetLanguages(language = "") {
  const url = `api/languages?language=${language}`;
  const res = await fetchWrapper(url);

  if (!res.ok) {
    alert(`Error getting languages: ${res.status}: ${res.json ? res.json.text : getTranslation("unknown")}`);
  }

  const fetchedLanguages = res.json.data;

  if (!language || Object.keys(languages.languages).length < 1) {
    languages = fetchedLanguages;
  }
  else if (language && !Object.keys(languages.languages).includes(language)) {
    for (const [languageKey, languageValue] of Object.entries(fetchedLanguages.languages)) {
      languages.languages[languageKey] = languageValue;
    }
  }

  return fetchedLanguages;
}

function updateTitleVersion() {
  document.title = `${document.title} ${manifest.version}`;
}

async function showUsedWords() {
  const usedWordsString = await localforage.getItem("usedWords");
  const usedWords = usedWordsString ? JSON.parse(usedWordsString) : [];
  
  for (const word of usedWords) {
    appendPreviousWords(word);
  }
}

async function getNewWord(inputWord, searchChar, formData, language) {
  const url = `api/new-word?inputWord=${inputWord}&searchChar=${searchChar}&language=${language || currentLanguage}`;
  const res = await fetchWrapper(url, {method: "post", body: formData});
  return res;
}

async function onInputWordSubmit(event) {
  event.preventDefault();

  const inputWordField = document.getElementById("input-word");
  const inputWord = inputWordField.value.replace(/\s/g, "");
  
  let searchChar = await localforage.getItem("searchChar");
  const usedWordsStr = await localforage.getItem("usedWords");

  const formData = new FormData();
  formData.append("usedWords", usedWordsStr);

  const res = await getNewWord(inputWord, searchChar, formData);
  
  inputWordField.value = "";

  if (!res.ok) {
    alert(`${getTranslation("error")}: ${res.status}: ${res.json ? res.json.text : getTranslation("unknown")}`);
    return;
  }

  const resData = res.json.data;

  const newWord = resData.newWord;
  searchChar = resData.searchChar;
  const usedWords = resData.usedWords;

  if (!newWord) {
    return;
  }

  await localforage.setItem("searchChar", searchChar);
  await localforage.setItem("usedWords", JSON.stringify(usedWords));
  
  appendPreviousWords(inputWord);
  appendPreviousWords(newWord);

  updateInputWordPlaceholder();
  updatePreviousWordsNumber();
}

async function onResetClick(event) {
  event.preventDefault();
  await deleteData(Object.keys(defaultDataObj));
  console.log("Progress reset.");
  location.reload();
}

async function onLanguageChange(event) {
  event.preventDefault();
  
  const newLanguage = currentLanguage == languages.defaultLanguage ? languages.availableLanguages[1] : languages.defaultLanguage;

  if (!Object.keys(languages.languages).includes(newLanguage)) {
    await getAndSetLanguages(newLanguage);
  }

  currentLanguage = newLanguage;
  updateTexts();

  localforage.setItem("language", currentLanguage);
}

(async () => {
  await getAndSetManifest();
  await localforage.config({driver: localforage.INDEXEDDB, storeName: `${manifest.name}_keyvaluepairs`});
  updateTitleVersion();
  await checkDataExists();
  await checkLanguageDataExistsAndChangeLanguage();
  await getAndSetLanguages(currentLanguage);
  showUsedWords();
  updateTexts();
})();

import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageProvider';
import { WordGame } from './lib/word-game';
import { WordsLoader } from './lib/words-loader';
import { Toaster } from './components/ui/sonner';
import { MainContainer } from './components/MainContainer';
import { useTranslation } from 'react-i18next';
import { Toast } from './lib/toast';

function App() {
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [areWordsUpdateable, setAreWordsUpdateable] = useState(false);
  const firstCharacterRef = useRef("");
  const wordsLoaderRef = useRef(new WordsLoader({storeName: "word-game", storageName: "words"}));
  const {t, i18n} = useTranslation();

  useEffect(() => {    
    const usedWordsPromise = wordsLoaderRef.current.load_used_words();
    const wordsPromise = wordsLoaderRef.current.load_words();
    
    wordsLoaderRef.current.check_words_updates()
    .then(updateable => setAreWordsUpdateable(updateable))
    .catch(_reason => Toast.error(t("words_update_check_error", {lng: i18n.language}))); // uses default language here if 'lng' is not overridden

    Promise.all([usedWordsPromise, wordsPromise]).then(([usedWords, words]) => {
      setUsedWords(usedWords);
      setWords(words);

      firstCharacterRef.current = WordGame.get_next_first_character(usedWords.at(-1) ?? "").toUpperCase();

      show_main_container();
    });
  }, []);

  function on_reset() {
    setUsedWords([]);
    firstCharacterRef.current = "";
    wordsLoaderRef.current.save_used_words([]);
  }

  function show_main_container() {
    const mainElement = document.getElementById("main-container");
    mainElement?.animate({opacity: [0, 1]}, {duration: 500});
    mainElement?.classList.remove("opacity-0");
  }

  function process_word_input(input: string) {    
    const newUsedWords = [...usedWords, input];
    setUsedWords(newUsedWords);
    
    let newFirstCharacter = "";
    let newWord = "";

    const ignore: string[] = [];

    for (let i = 0; !newWord && i < input.length; i++) {
      newFirstCharacter = WordGame.get_next_first_character(input, ignore);
      newWord = WordGame.get_random_available_word(newFirstCharacter, newUsedWords, words, firstCharacterRef.current);
      ignore.push(newFirstCharacter);
    }

    if (!newWord) {
      Toast.error(t("new_word_not_found"));
      return;
    }

    newUsedWords.push(newWord);
    setUsedWords(newUsedWords);

    firstCharacterRef.current = WordGame.get_next_first_character(newWord).toUpperCase();
    wordsLoaderRef.current.save_used_words(newUsedWords);
  }

  function set_words(words: string[]) {
    setWords(words);
    setAreWordsUpdateable(false);
  }
  
  return (
    <ThemeProvider storageKey='word-game-theme'>
      <LanguageProvider storageName='word-game-language'>
        <MainContainer
          id='main-container'
          className='opacity-0'
          usedWords={usedWords}
          words={words}
          firstCharacterRef={firstCharacterRef}
          wordsLoaderRef={wordsLoaderRef}
          resetUsedWords={on_reset}
          updateWords={set_words}
          areWordsUpdateable={areWordsUpdateable}
          processWordInput={process_word_input}>
        </MainContainer>
        <Toaster expand={true} position='top-center'></Toaster>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App

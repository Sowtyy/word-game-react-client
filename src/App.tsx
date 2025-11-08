import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import { WordInput } from './components/WordInput';
import { UsedWordsList } from './components/UsedWordsList';
import { UpperContainer } from './components/UpperContainer';
import { LanguageProvider } from './components/LanguageProvider';
import { WordGame } from './lib/word-game';
import { WordsLoader } from './lib/words-loader';

function App() {
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [isSendingInput, setIsSendingInput] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [areWordsUpdateable, setAreWordsUpdateable] = useState(false);
  const firstCharacterRef = useRef("");
  const wordsLoaderRef = useRef(new WordsLoader({storeName: "word-game", storageName: "words"}));

  useEffect(() => {
    const usedWordsPromise = wordsLoaderRef.current.load_used_words();
    const wordsPromise = wordsLoaderRef.current.load_words();
    
    wordsLoaderRef.current.check_words_updates().then(updateable => setAreWordsUpdateable(updateable));

    Promise.all([usedWordsPromise, wordsPromise]).then(([usedWords, words]) => {
      setUsedWords(usedWords);
      setWords(words);

      firstCharacterRef.current = WordGame.get_next_first_character(usedWords.at(-1) ?? "").toUpperCase();

      show_main_container();
    });
  }, []);
  
  useEffect(() => {
    scroll_used_words_to_bottom();
  }, [usedWords]);
  
  async function on_word_submit(value: string) {
    value = value.toLowerCase();
    setIsSendingInput(true);
    process_word_input(value);
    setIsSendingInput(false);
    scroll_used_words_to_bottom();
    document.getElementById("word-input-area")?.focus();
  }

  function on_reset() {
    setUsedWords([]);
    firstCharacterRef.current = "";
    wordsLoaderRef.current.save_used_words([]);
  }
  
  function scroll_used_words_to_bottom() {
    const element = document.querySelector("#used-words-main-container div[data-radix-scroll-area-viewport]");
    if (!element) return;
    element.scroll({left: 0, top: element.scrollHeight, behavior: "smooth"});
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

    if (!newWord) throw new Error("Couldn't find suitable new word");

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
        <div id='main-container' className='p-[15px_1.5%_0] h-full gap-4 flex flex-col opacity-0'>
          <UpperContainer className='mx-5' usedWords={usedWords} resetUsedWords={on_reset} updateWords={set_words} wordsLoaderRef={wordsLoaderRef} toShowUpdateButton={areWordsUpdateable}></UpperContainer>
          <div className='flex flex-col gap-5 h-full overflow-hidden'>
            <UsedWordsList className='flex-grow' usedWords={usedWords}></UsedWordsList>
            <WordInput className='mb-5 h-auto shrink-0' isSendingInput={isSendingInput} firstCharacterRef={firstCharacterRef} usedWords={usedWords} words={words} submitWord={on_word_submit}></WordInput>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App

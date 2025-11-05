import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import { WordInput } from './components/WordInput';
import { UsedWordsList } from './components/UsedWordsList';
import { UpperContainer } from './components/UpperContainer';
import { LanguageProvider } from './components/LanguageProvider';
import { WordGame } from './lib/word-game';

function App() {
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [isSendingInput, setIsSendingInput] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const firstCharacterRef = useRef("");

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
  }
  
  function scroll_used_words_to_bottom() {
    const element = document.querySelector("#used-words-main-container div[data-radix-scroll-area-viewport]");
    if (!element) return;
    element.scroll({left: 0, top: element.scrollHeight, behavior: "smooth"});
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

    setUsedWords(usedWords => [...usedWords, newWord]);
    firstCharacterRef.current = WordGame.get_next_first_character(newWord).toUpperCase();
  }
  
  return (
    <ThemeProvider storageKey='word-game-theme'>
      <LanguageProvider storageName='word-game-language'>
        <div className='p-[15px_1.5%_0] h-full gap-4 flex flex-col'>
          <UpperContainer className='mx-5' usedWords={usedWords} resetUsedWords={on_reset} updateWords={setWords}></UpperContainer>
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

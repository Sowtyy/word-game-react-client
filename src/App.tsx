import { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import { WordInput } from './components/WordInput';
import { UsedWordsList } from './components/UsedWordsList';
import { UpperContainer } from './components/UpperContainer';
import { LanguageProvider } from './components/LanguageProvider';

function App() {
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [isSendingInput, setIsSendingInput] = useState(false);
  const firstCharacterRef = useRef("");

  useEffect(() => {
    scroll_used_words_to_bottom();
  }, [usedWords]);
  
  async function on_word_submit(value: string) {
    setIsSendingInput(true);
    await send_word_input(value);
    setIsSendingInput(false);
    setUsedWords([...usedWords, value]);
    firstCharacterRef.current = value.at(-1)?.toUpperCase() ?? "";
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

  function send_word_input(_input: string) {
    return new Promise<void>(resolve => setTimeout(() => resolve(), 50));
  }
  
  return (
    <ThemeProvider storageKey='word-game-theme'>
      <LanguageProvider storageName='word-game-language'>
        <div className='p-[15px_1.5%_0] h-full gap-4 flex flex-col'>
          <UpperContainer className='mx-5' usedWords={usedWords} resetUsedWords={on_reset}></UpperContainer>
          <div className='flex flex-col gap-5 h-full overflow-hidden'>
            <UsedWordsList className='flex-grow' usedWords={usedWords}></UsedWordsList>
            <WordInput className='mb-5 h-auto shrink-0' isSendingInput={isSendingInput} firstCharacterRef={firstCharacterRef} submitWord={on_word_submit}></WordInput>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App

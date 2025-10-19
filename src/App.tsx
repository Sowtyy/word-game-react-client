import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { SettingsDialog } from './components/SettingsDialog';
import { LucideRefreshCcw } from 'lucide-react';
import { WordInput } from './components/WordInput';

function App() {
  const [wordsUsed, setWordsUsed] = useState<string[]>([]);
  const [isSendingInput, setIsSendingInput] = useState(false);
  const firstCharacterRef = useRef("");

  useEffect(() => {
    scroll_used_words_to_bottom();
  }, [wordsUsed]);
  
  async function on_word_submit(value: string) {
    setIsSendingInput(true);
    await send_word_input(value);
    setIsSendingInput(false);
    setWordsUsed([...wordsUsed, value]);
    firstCharacterRef.current = value.at(-1)?.toUpperCase() ?? "";
    scroll_used_words_to_bottom();
    document.getElementById("word-input-area")?.focus();
  }

  function on_reset() {
    setWordsUsed([]);
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
      <div className='p-[15px_1.5%_0] h-full gap-4 flex flex-col'>
        <div className='mx-5 grid grid-cols-[1fr_min-content]'>
          <Label className='col-1'>Words used: {wordsUsed.length}</Label>
          <div className='flex flex-row gap-2'>
            <Button onClick={on_reset} variant='ghost' className='border border-transparent hover:border hover:border-destructive' title='Reset'><LucideRefreshCcw/></Button>
            <Separator orientation='vertical'/>
            <SettingsDialog className='col-2'></SettingsDialog>
          </div>
        </div>
        <div className='flex flex-col gap-5 h-full overflow-hidden'>
          <ScrollArea id='used-words-main-container' className='flex-grow overflow-hidden border-border border-solid border-y lg:border lg:rounded-2xl px-4'>
            <div id='used-words' className='flex flex-col-reverse h-full box-border'>
              {wordsUsed.slice().reverse().map((word, index) => (
                <React.Fragment key={`${index}-${word}`}>
                  <Label className='h-[40px] mx-1'>{word}</Label>
                  <Separator/>
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
          <WordInput className='mb-5 h-auto shrink-0' isSendingInput={isSendingInput} firstCharacterRef={firstCharacterRef} submitWord={on_word_submit}></WordInput>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App

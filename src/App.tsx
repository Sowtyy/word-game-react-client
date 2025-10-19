import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { ThemeProvider } from './components/ThemeProvider';
import { ScrollArea } from './components/ui/scroll-area';
import { Separator } from './components/ui/separator';
import { Label } from './components/ui/label';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Alert, AlertTitle } from './components/ui/alert';
import { SettingsDialog } from './components/SettingsDialog';
import { LoaderCircle, LucideRefreshCcw } from 'lucide-react';

function App() {
  const [wordsUsed, setWordsUsed] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [toShowInputAlert, setToShowInputAlert] = useState(false);
  const [isSendingInput, setIsSendingInput] = useState(false);
  const firstCharacterRef = useRef("");

  useEffect(() => {
    scroll_used_words_to_bottom();
  }, [wordsUsed]);
  
  async function on_word_submit() {
    if (isSendingInput) return;
    const inputTrimmed = input.trim();
    if (!inputTrimmed) return;
    if (!is_input_errorless(inputTrimmed)) return;
    setIsSendingInput(true);
    await send_word_input(inputTrimmed);
    setIsSendingInput(false);
    setWordsUsed([...wordsUsed, inputTrimmed]);
    setInput("");
    firstCharacterRef.current = inputTrimmed.at(-1)?.toUpperCase() ?? "";
    scroll_used_words_to_bottom();
    document.getElementById("word-input-area")?.focus();
  }

  function on_input_change(event: React.ChangeEvent) {
    if (isSendingInput) return;
    const valueTrimmed = (event.target as HTMLInputElement).value.trim();
    setToShowInputAlert(!is_input_errorless(valueTrimmed));
    setInput(valueTrimmed);
  }

  function on_input_key_down(event: React.KeyboardEvent) {
    if (event.key == "Enter") {
      on_word_submit();
    }
  }

  function on_reset() {
    setWordsUsed([]);
    firstCharacterRef.current = "";
  }

  function is_input_errorless(value: string) {
    const valueFirstCharacter = value.at(0)?.toUpperCase();
    if (!valueFirstCharacter || !firstCharacterRef.current) return true;
    return valueFirstCharacter == firstCharacterRef.current;
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
      <div className='p-[15px_1.5%_0] h-full gap-5 flex flex-col'>
        <div className='mx-5 grid grid-cols-[1fr_min-content]'>
          <Label className='col-1'>Words used: {wordsUsed.length}</Label>
          <div className='flex flex-row gap-3'>
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
          <div className='mb-5 h-auto shrink-0 flex flex-col gap-4'>
            <div className='flex gap-2'>
              <Input id='word-input-area' className={toShowInputAlert ? 'focus:border-destructive!' : ''} onChange={on_input_change} placeholder={`Start with ${firstCharacterRef.current || "any"} character`} onKeyDown={on_input_key_down} value={input}></Input>
              <Button disabled={toShowInputAlert || isSendingInput} type='submit' variant='outline' onClick={on_word_submit}>
                {isSendingInput ? (
                  <LoaderCircle className='animate-spin'/>
                ) : undefined}
                Submit
              </Button>
            </div>
            {toShowInputAlert ? (
              <Alert variant='destructive'>
                <AlertTitle>Word should start with <b>{firstCharacterRef.current}</b>!</AlertTitle>
              </Alert>
            ) : undefined}
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App

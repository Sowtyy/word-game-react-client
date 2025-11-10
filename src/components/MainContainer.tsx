import { UpperContainer } from "./UpperContainer";
import { UsedWordsList } from "./UsedWordsList";
import { WordInput } from "./WordInput";
import { useEffect, useState, type RefObject } from "react";
import type { WordsLoader } from "@/lib/words-loader";

interface MainContainerProps {
  id?: string,
  className?: string,
  usedWords: string[],
  words: string[],
  firstCharacterRef: RefObject<string>,
  wordsLoaderRef: RefObject<WordsLoader>,
  resetUsedWords: () => void,
  updateWords: (words: string[]) => void,
  areWordsUpdateable: boolean,
  processWordInput: (value: string) => void
}

export function MainContainer({
  id,
  className,
  usedWords,
  words,
  firstCharacterRef,
  wordsLoaderRef,
  resetUsedWords,
  updateWords,
  areWordsUpdateable,
  processWordInput,
}: MainContainerProps) {
  const [isSendingInput, setIsSendingInput] = useState(false);
  
  useEffect(() => {
    scroll_used_words_to_bottom();
  }, [usedWords]);

  async function on_word_submit(value: string) {
    value = value.toLowerCase();
    setIsSendingInput(true);
    processWordInput(value);
    setIsSendingInput(false);
    document.getElementById("word-input-area")?.focus();
  }

  function scroll_used_words_to_bottom() {
    const element = document.querySelector("#used-words-main-container div[data-radix-scroll-area-viewport]");
    if (!element) return;
    element.scroll({left: 0, top: element.scrollHeight, behavior: "smooth"});
  }
  
  return (
    <div id={id} className={'p-[15px_1.5%_0] h-full gap-4 flex flex-col ' + className}>
      <UpperContainer className='mx-5' usedWords={usedWords} resetUsedWords={resetUsedWords} updateWords={updateWords} wordsLoaderRef={wordsLoaderRef} toShowUpdateButton={areWordsUpdateable}></UpperContainer>
      <div className='flex flex-col gap-5 h-full overflow-hidden'>
        <UsedWordsList className='flex-grow' usedWords={usedWords}></UsedWordsList>
        <WordInput className='mb-5 h-auto shrink-0' isSendingInput={isSendingInput} firstCharacterRef={firstCharacterRef} usedWords={usedWords} words={words} submitWord={on_word_submit}></WordInput>
      </div>
    </div>
  )
}

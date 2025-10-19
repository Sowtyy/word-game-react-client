import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface UsedWordsProps {
  className?: string,
  usedWords: string[]
};

export function UsedWordsList({className, usedWords}: UsedWordsProps) {
  return (
    <ScrollArea id='used-words-main-container' className={'overflow-hidden border-border border-solid border-y lg:border lg:rounded-2xl px-4 ' + className}>
      <div id='used-words' className='flex flex-col-reverse h-full box-border'>
        {usedWords.slice().reverse().map((word, index) => (
          <React.Fragment key={`${index}-${word}`}>
            <Label className='h-[40px] mx-1'>{word}</Label>
            <Separator/>
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}

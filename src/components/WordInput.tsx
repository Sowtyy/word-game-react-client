import type React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { Alert, AlertTitle } from "./ui/alert";

interface WordInputProps {
  className?: string,
  isSendingInput?: boolean,
  toShowInputAlert?: boolean,
  firstCharacterRef: React.RefObject<string>
};

function WordInput({className, isSendingInput, toShowInputAlert, firstCharacterRef}: WordInputProps) {
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
  
  function is_input_errorless(value: string) {
    const valueFirstCharacter = value.at(0)?.toUpperCase();
    if (!valueFirstCharacter || !firstCharacterRef.current) return true;
    return valueFirstCharacter == firstCharacterRef.current;
  }

  return (
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
  )
}

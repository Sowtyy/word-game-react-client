import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { Alert, AlertTitle } from "./ui/alert";

interface WordInputProps {
  className?: string,
  isSendingInput?: boolean,
  firstCharacterRef: React.RefObject<string>,
  submitWord: (word: string) => Promise<void>
};

export function WordInput({className, isSendingInput, firstCharacterRef, submitWord}: WordInputProps) {
  const [input, setInput] = useState("");
  const [toShowAlert, setToShowAlert] = useState(false);
  
  async function on_word_submit() {
    if (isSendingInput) return;
    const validated = validate_input(input);
    if (!validated) return;
    submitWord(validated);
    setInput("");
    document.getElementById("word-input-area")?.focus();
  }
  
  function on_input_change(event: React.ChangeEvent) {
    if (isSendingInput) return;
    const valueTrimmed = (event.target as HTMLInputElement).value.trim();
    setToShowAlert(!is_input_errorless(valueTrimmed));
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

  function validate_input(value: string) {
    const trimmed = value.trim();
    return is_input_errorless(trimmed) ? trimmed : undefined;
  }

  return (
    <div className={'flex flex-col gap-4 ' + className}>
      <div className='flex gap-2'>
        <Input id='word-input-area' className={toShowAlert ? 'focus:border-destructive!' : ''} onChange={on_input_change} placeholder={`Start with ${firstCharacterRef.current || "any"} character`} onKeyDown={on_input_key_down} value={input}></Input>
        <Button disabled={toShowAlert || isSendingInput} type='submit' variant='outline' onClick={on_word_submit}>
          {isSendingInput ? (
            <LoaderCircle className='animate-spin'/>
          ) : undefined}
          Submit
        </Button>
      </div>
      {toShowAlert ? (
        <Alert variant='destructive'>
          <AlertTitle>Word should start with <b>{firstCharacterRef.current}</b>!</AlertTitle>
        </Alert>
      ) : undefined}
    </div>
  )
}

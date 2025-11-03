import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { Alert, AlertTitle } from "./ui/alert";
import { Trans, useTranslation } from "react-i18next";

interface WordInputProps {
  className?: string,
  isSendingInput?: boolean,
  firstCharacterRef: React.RefObject<string>,
  usedWords: string[],
  words: string[],
  submitWord: (word: string) => Promise<void>
};

export function WordInput({className, isSendingInput, firstCharacterRef, usedWords, words, submitWord}: WordInputProps) {
  const [input, setInput] = useState("");
  const {t} = useTranslation();
  
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
    const filtered = filter_input((event.target as HTMLInputElement).value);
    setInput(filtered);
  }
  
  function on_input_key_down(event: React.KeyboardEvent) {
    if (event.key == "Enter") {
      on_word_submit();
    }
  }
  
  function is_input_errorless(value: string) {
    const valueFirstCharacter = value.at(0)?.toUpperCase();
    if (!valueFirstCharacter || !firstCharacterRef.current) return true;
    return valueFirstCharacter == firstCharacterRef.current && !usedWords.includes(value);
  }

  function validate_input(value: string) {
    const filtered = filter_input(value);
    if (!is_input_errorless(filtered)) return undefined;
    //if (usedWords.includes(trimmed)) return undefined;
    return filtered;
  }

  function filter_input(input: string) {
    return input.trim().toLowerCase();
  }

  function to_show_alert() {
    return !is_input_errorless(filter_input(input)) || !words.length;
  }

  return (
    <div className={'flex flex-col gap-4 ' + className}>
      <div className='flex gap-2'>
        <Input id='word-input-area' className={to_show_alert() ? 'focus:border-destructive!' : ''} onChange={on_input_change} placeholder={t(firstCharacterRef.current ? "word_input_placeholder" : "word_input_placeholder_default", {character: firstCharacterRef.current})} onKeyDown={on_input_key_down} value={input}></Input>
        <Button disabled={to_show_alert() || isSendingInput} type='submit' variant='outline' onClick={on_word_submit}>
          {isSendingInput ? (
            <LoaderCircle className='animate-spin'/>
          ) : undefined}
          {t("submit")}
        </Button>
      </div>
      {to_show_alert() ? (
        <Alert variant='destructive'>
          <AlertTitle>
            <Trans i18nKey={!words.length ? 'input_alert_words_not_found' : usedWords.includes(filter_input(input)) ? 'input_alert_word_already_used' : 'input_alert_first_character_invalid'} values={{character: firstCharacterRef.current, word: filter_input(input)}} components={{bold: <b/>}}></Trans>
          </AlertTitle>
        </Alert>
      ) : undefined}
    </div>
  )
}

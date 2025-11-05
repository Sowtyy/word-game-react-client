import { LoaderCircle, LucideDownload } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface UpdateButtonProps {
  className?: string,
  updateWords: (value: string[]) => void
};

export function UpdateButton({className, updateWords}: UpdateButtonProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const {t} = useTranslation();
  
  async function update_words() {
    if (isUpdating) return;
    setIsUpdating(true);
    const response = await fetch("api/words.json");
    const newWords = await response.json() as string[];
    updateWords(newWords);
    setIsUpdating(false);
  }

  return (
    <Button onClick={update_words} variant='outline' disabled={isUpdating} title={t('words_update')} className={'border-yellow-500! ' + className}>
      {isUpdating ? <LoaderCircle className='animate-spin'/> : <LucideDownload/>}
    </Button>
  )
}

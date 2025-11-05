import { SettingsDialog } from "./SettingsDialog";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ResetProgressButton } from "./ResetProgressButton";
import { useTranslation } from "react-i18next";
import { UpdateButton } from "./UpdateButton";

interface UpperContainerProps {
  className?: string,
  usedWords: string[],
  resetUsedWords: () => void,
  updateWords: (value: string[]) => void
};

export function UpperContainer({className, usedWords, resetUsedWords, updateWords}: UpperContainerProps) {    
  const {t} = useTranslation();
  
  return (
    <div className={'grid grid-cols-[1fr_min-content_min-content] ' + className}>
      <Label>{t("words_used", {count: usedWords.length})}</Label>
      <UpdateButton updateWords={updateWords} className='mr-6'></UpdateButton>
      <div className='flex flex-row gap-2'>
        <ResetProgressButton resetUsedWords={resetUsedWords}/>
        <Separator orientation='vertical'/>
        <SettingsDialog></SettingsDialog>
      </div>
    </div>
  )
}

import { SettingsDialog } from "./SettingsDialog";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ResetProgressButton } from "./ResetProgressButton";
import { useTranslation } from "react-i18next";

interface UpperContainerProps {
  className?: string,
  usedWords: string[],
  resetUsedWords: () => void
};

export function UpperContainer({className, usedWords, resetUsedWords}: UpperContainerProps) {    
  const {t} = useTranslation();
  
  return (
    <div className={'grid grid-cols-[1fr_min-content] ' + className}>
      <Label className='col-1'>{t("words_used", {count: usedWords.length})}</Label>
      <div className='flex flex-row gap-2'>
        <ResetProgressButton resetUsedWords={resetUsedWords}/>
        <Separator orientation='vertical'/>
        <SettingsDialog className='col-2'></SettingsDialog>
      </div>
    </div>
  )
}

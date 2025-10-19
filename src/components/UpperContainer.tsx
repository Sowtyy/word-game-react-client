import { LucideRefreshCcw } from "lucide-react";
import { SettingsDialog } from "./SettingsDialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface UpperContainerProps {
  className?: string,
  usedWords: string[],
  resetUsedWords: () => void
};

export function UpperContainer({className, usedWords, resetUsedWords}: UpperContainerProps) {
  return (
    <div className={'grid grid-cols-[1fr_min-content] ' + className}>
      <Label className='col-1'>Words used: {usedWords.length}</Label>
      <div className='flex flex-row gap-2'>
        <Button onClick={resetUsedWords} variant='ghost' className='border border-transparent hover:border hover:border-destructive' title='Reset'><LucideRefreshCcw/></Button>
        <Separator orientation='vertical'/>
        <SettingsDialog className='col-2'></SettingsDialog>
      </div>
    </div>
  )
}

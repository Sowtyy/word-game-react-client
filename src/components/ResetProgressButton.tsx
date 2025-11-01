import { LucideRefreshCcw } from "lucide-react"
import { Button } from "./ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { useTranslation } from "react-i18next";

interface ResetProgressButtonProps {
  className?: string,
  resetUsedWords: () => void
};

export function ResetProgressButton({className, resetUsedWords}: ResetProgressButtonProps) {
  const {t} = useTranslation();
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className={className}>
        <Button variant='ghost' className='border border-transparent hover:border hover:border-destructive' title={t("reset")}>
          <LucideRefreshCcw/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("are_you_sure")}</AlertDialogTitle>
          <AlertDialogDescription>{t("reset_progress_alert_description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex-col'>
          <AlertDialogAction asChild>
            <Button variant='destructive' onClick={resetUsedWords} className='bg-destructive'>{t("reset")}</Button>
          </AlertDialogAction>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

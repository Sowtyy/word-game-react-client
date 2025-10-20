import { LucideRefreshCcw } from "lucide-react"
import { Button } from "./ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"

interface ResetProgressButtonProps {
  className?: string,
  resetUsedWords: () => void
};

export function ResetProgressButton({className, resetUsedWords}: ResetProgressButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className={className}>
        <Button variant='ghost' className='border border-transparent hover:border hover:border-destructive' title='Reset'>
          <LucideRefreshCcw/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This will reset all your progress.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex-col'>
          <AlertDialogAction asChild>
            <Button variant='destructive' onClick={resetUsedWords}>Reset</Button>
          </AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

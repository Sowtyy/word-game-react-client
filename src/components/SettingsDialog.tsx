import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import * as Lucide from 'lucide-react';
import { Label } from './ui/label';
import { Combobox } from './Combobox';
import { useTheme, type Theme } from './ThemeProvider';

interface SettingsDialogProps {
  className?: string,
  themeStorageName?: string
};

export function SettingsDialog({className}: SettingsDialogProps) {
  const {theme, setTheme} = useTheme();
  
  function on_theme_change(value: string) {
    setTheme(value.toLowerCase() as Theme);
  }
  
  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        <Button variant='ghost' title='Settings'>
          <Lucide.Settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-[1fr_min-content]'>
          <Label className='col-1'>Theme</Label>
          <Combobox onSelect={on_theme_change} className='col-2' label={theme[0].toUpperCase() + theme.slice(1)} options={["System", "Light", "Dark"]}></Combobox>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import * as Lucide from 'lucide-react';
import { Label } from './ui/label';
import { Combobox } from './Combobox';
import { useTheme, type Theme } from './ThemeProvider';
import { useContext } from 'react';
import { LanguageContext, type Language } from './LanguageProvider';
import { useTranslation } from 'react-i18next';

interface SettingsDialogProps {
  className?: string,
  themeStorageName?: string
};

export function SettingsDialog({className}: SettingsDialogProps) {
  const {theme, setTheme} = useTheme();
  const languageContext = useContext(LanguageContext);
  const {t} = useTranslation();
  
  function on_theme_change(value: string) {
    setTheme(value.toLowerCase() as Theme);
  }
  
  function on_language_change(value: string) {
    languageContext.setLanguage(value.toLowerCase() as Language);
  }
  
  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        <Button variant='ghost' title={t("reset")}>
          <Lucide.Settings />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("settings")}</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-[1fr_min-content]'>
          <Label className='col-1'>{t("theme")}</Label>
          <Combobox onSelect={on_theme_change} className='col-2' label={theme[0].toUpperCase() + theme.slice(1)} options={["System", "Light", "Dark"]}></Combobox>
        </div>
        <div className='grid grid-cols-[1fr_min-content]'>
          <Label className='col-1'>{t("language")}</Label>
          <Combobox onSelect={on_language_change} className='col-2' label={languageContext.language[0].toUpperCase() + languageContext.language.slice(1)} options={["En", "Ru"]}></Combobox>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import * as Lucide from 'lucide-react';
import { Label } from './ui/label';
import { useTheme, type Theme } from './ThemeProvider';
import { useContext } from 'react';
import { LanguageContext, type Language } from './LanguageProvider';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
          <Select onValueChange={value => on_theme_change(value)}>
            <SelectTrigger className='col-2'>
              <SelectValue placeholder={t("theme_settings_" + theme)}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='system'>{t("theme_settings_system")}</SelectItem>
              <SelectItem value='dark'>{t("theme_settings_dark")}</SelectItem>
              <SelectItem value='light'>{t("theme_settings_light")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='grid grid-cols-[1fr_min-content]'>
          <Label className='col-1'>{t("language")}</Label>
          <Select onValueChange={value => on_language_change(value)}>
            <SelectTrigger className='col-2'>
              <SelectValue placeholder={t("language_" + languageContext.language)}></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='en'>English</SelectItem>
              <SelectItem value='ru'>Русский</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  )
}

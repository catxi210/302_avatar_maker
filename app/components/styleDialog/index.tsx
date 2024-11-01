import { t } from "i18next";
import toast from "react-hot-toast";
import { emitter } from "@/lib/mitt";
import { Loader2 } from "lucide-react";
import { useCompletion } from 'ai/react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PresetStyle, Tabs } from "@/lib/constant";
import { Textarea } from "@/components/ui/textarea";
import { useFormStore } from "@/app/stores/use-form-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";

export function StyleDialog() {
  const { presetStyle, tab, updateAll } = useFormStore((state) => ({ ...state }))

  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [tabIndex, setTabIndex] = useState(1);
  const [selectStyle, setSelectStyle] = useState({ label: 'comic_style', value: 'Comic Style', image: '/images/Comic Style.png' });

  const onSelectBlock = (item: { value: string; image: string; label: string; }) => {
    updateAll({ presetStyle: { ...item }, tab: tabIndex })
    window.localStorage.setItem('presetStyle', JSON.stringify(selectStyle))
    setOpen(false);
  }

  const { complete, isLoading } = useCompletion({
    id: "generateCustomStyle",
    api: "/api/generateCustomStyle",
    onResponse: async (response) => {
      console.log(response);
      if (!response.ok) {
        try {
          const errorData = await response.json();
          emitter.emit('ToastError', errorData.err_code || '')
        } catch (parseError) {
          toast(t('home:optimize.error'))
        }
      } else {
        const result = await response.json();
        window.localStorage.setItem('customPrompt', result.data)
        toast(t('home:optimize.success'))
        setOpen(false);
      }
    },
  });

  useEffect(() => {
    const data = window.localStorage.getItem('avatarMakerCustomContent')
    if (data) {
      setContent(data)
    }
  }, [])

  useEffect(() => {
    if (open) {
      if (presetStyle.value === 'custom') {
        setSelectStyle({ label: 'comic_style', value: 'Comic Style', image: '/images/Comic Style.png' })
      } else {
        setSelectStyle(presetStyle)
      }
      setTabIndex(tab)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(value) => { if (isLoading) return; setOpen(value) }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-[65px] w-full gap-5 relative bg-[hsl(var(--background))]">
          <img className="h-[80%] absolute left-2" src={presetStyle.image} />
          <span className="text-lg font-bold">{t(`home:presetStyle.${presetStyle.label}`)}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>{t('home:styleDialog.choose_style')}</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="w-full flex gap-5 items-center">
          {
            Tabs.map(item => (
              <div key={item.value}
                onClick={() => {
                  if (isLoading) return;
                  if (item.value === 2) {
                    updateAll({ presetStyle: { value: 'custom', label: 'custom', image: '/images/custom.jpg' }, tab: item.value })
                  }
                  setTabIndex(item.value)
                }}
                className={`
									cursor-pointer border-b-2 pb-1 px-5
									border-[${tabIndex === item.value ? 'hsl(var(--primary))' : '#fff'}]
									${tabIndex === item.value && "text-[hsl(var(--primary))]"}
								`}
              >
                {t(`home:styleDialog.${item.label}`)}
              </div>
            ))
          }
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-2">
          <div className={`${tabIndex == 1 ? 'grid' : 'hidden'} lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 mm:grid-cols-2 grid-cols-1 gap-5`}>
            {PresetStyle(t).map(item => (
              <div
                key={item.value}
                className={`
									transition-all
									overflow-hidden rounded-lg border cursor-pointer group
									hover:border-[hsl(var(--primary))] hover:shadow-custom-purple
									${selectStyle.value === item.value && "shadow-custom-purple border-[hsl(var(--primary))]"}
								`}
                onClick={() => { onSelectBlock(item) }}
              >
                <img src={`/images/${item.value}.png`} />
                <div className={`
										p-2 border-t text-sm
										group-hover:text-[hsl(var(--primary))]
										group-hover:border-[hsl(var(--primary))]
										${selectStyle.value === item.value && "text-[hsl(var(--primary))] border-[hsl(var(--primary))]"}
									`}>
                  {t(`home:presetStyle.${item.label}`)}
                </div>
              </div>
            ))}
          </div>
          <div className={`${tabIndex == 2 ? 'block' : 'hidden'}`}>
            <div className="text-sm pb-4 text-[hsl(var(--primary))]">{t('home:styleDialog.tab_custom_tips')}</div>
            <Textarea
              placeholder={t('home:styleDialog.custom_input_placeholder')}
              rows={20}
              value={content}
              disabled={isLoading}
              onChange={(e) => {
                window.localStorage.setItem('avatarMakerCustomContent', e.target.value)
                setContent(e.target.value)
              }}
            />
          </div>
        </div>
        <DialogFooter>
          {
            tabIndex == 2 && (
              <Button disabled={tabIndex == 2 && (!content.trim() || isLoading)} onClick={() => complete(content)}>
                {!isLoading ? t('home:styleDialog.submit') : t('home:styleDialog.optimize')}
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              </Button>
            )
          }
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

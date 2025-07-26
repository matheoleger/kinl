import { zCreateTagsSchema } from '@kinl/codegen-api';
import { CircleQuestionMarkIcon, PlusIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import z, { ZodError } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface AddTagInputProps {
  onChange: (updatedTagLists: string[]) => void;
  autoCompleteList?: string[];
  defaultValues?: string[];
}

const i18nCreateTagsSchema = zCreateTagsSchema.extend({
  names: z.array(z.string().min(2, { message: 'tags.create_tags_input.errors.name_must_be_longer_than_2' })),
});

export function AddTagInput({ onChange, autoCompleteList, defaultValues }: AddTagInputProps) {
  const { t } = useTranslation();

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tag, setTag] = useState('');
  const [tagLists, setTagLists] = useState<string[]>(defaultValues ?? []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // filter autoCompleteList to remove already added tags and input content (tag)
  const filteredAutoCompleteList = autoCompleteList?.filter(t => !tagLists.includes(t) && t.match(new RegExp(tag, 'i')));

  const onAddTag = () => {
    if (!handleZodVerification(tag, setErrorMessage)) {
      return;
    }

    if (tagLists.includes(tag)) {
      setTag('');
      return;
    }

    const newTagLists = [...tagLists, tag];
    onChange(newTagLists);
    setTagLists(newTagLists);
    setTag('');
  };

  const onRemove = (tag: string) => {
    const filteredTagLists = tagLists.filter(t => t !== tag);
    setTagLists(filteredTagLists);
    onChange(filteredTagLists);
  };

  const comboboxListRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverAnchor>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder={t('tags.create_tags_input.placeholder')}
              value={tag}
              onChange={(e) => {
                setPopoverOpen(!!e.target.value && !!filteredAutoCompleteList?.length);
                setTag(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddTag();
                }
                else if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  comboboxListRef.current?.focus();
                  setPopoverOpen(true);
                }
              }}
            />
            <Button variant="outline" size="icon" onClick={onAddTag} type="button">
              <PlusIcon />
            </Button>
          </div>
        </PopoverAnchor>
        <PopoverContent className="p-1" side="bottom" align="start" onOpenAutoFocus={e => e.preventDefault()}>
          <Command>
            <CommandList ref={comboboxListRef}>
              <CommandGroup>
                {
                  filteredAutoCompleteList?.map(tag => (
                    <CommandItem
                      key={tag}
                      onSelect={() => {
                        setTag(tag);
                        setPopoverOpen(false);
                        inputRef.current?.focus();
                      }}
                    >
                      <span className="w-full text-start">
                        {tag}
                      </span>
                    </CommandItem>
                  ))
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {
        errorMessage && (
          <p className="text-destructive text-sm">
            {t(errorMessage)}
          </p>
        )
      }
      <div className="flex flex-col gap-4">
        <Tooltip delayDuration={300}>
          <TooltipTrigger className="flex items-center gap-2 w-fit">
            <p className="text-muted-foreground text-sm">{t('tags.create_tags_input.tag_list.title')}</p>
            <CircleQuestionMarkIcon className="text-muted-foreground" size={16} />
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-card text-card-foreground">
            <p className="text-muted-foreground text-xs">
              {t('tags.create_tags_input.tag_list.information')}
            </p>
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-wrap gap-2">
          {
            tagLists.map(tag => (
              <button key={tag} type="button" onClick={() => onRemove(tag)}>
                <Badge className="text-sm" variant="secondary">
                  <span>{tag}</span>
                  <XIcon />
                </Badge>
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
}

function handleZodVerification(tag: string, setErrorMessage: (message: string) => void) {
  try {
    i18nCreateTagsSchema.parse({ names: [tag] });
    setErrorMessage('');
    return true;
  }
  catch (error) {
    if (error instanceof ZodError) {
      setErrorMessage(error.errors[0].message);
    }

    return false;
  }
}

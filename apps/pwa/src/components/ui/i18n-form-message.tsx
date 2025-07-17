import { cn } from "@/lib/utils";
import { useFormField } from "./form";
import { useTranslation } from "react-i18next";


/**
 * 
 * @description This component is used to display the error message with i18n support (using i18n key in the error message). You can also pass a custom message as children.
 * 
 */
function I18nFormMessage({ className, ...props }: React.ComponentProps<'p'>) {
  const { t } = useTranslation();
  const { error, formMessageId } = useFormField();
  const body = error ? t(`${error?.message}`) : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-destructive text-sm', className)}
      {...props}
    >
      {body}
    </p>
  );
}

export { I18nFormMessage };
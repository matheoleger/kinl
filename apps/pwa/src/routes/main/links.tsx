import { Trans } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { LinksList } from '@/features/links/components/links-list';

export default function Links() {
  const [params] = useSearchParams();
  const tagsParam = params.get('tags');
  const tags = parseTags(tagsParam);

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-xl font-bold px-6">
        <Trans i18nKey="links.list.title" values={{ tags: tags.join(', ') }} />
      </h2>
      <LinksList tagsFilter={tags} />
    </div>
  );
}

function parseTags(tagsParam?: string | null) {
  try {
    if (!tagsParam) {
      return [];
    }
    else if (tagsParam.match(/^\[.*\]$/)) {
      return JSON.parse(tagsParam) as string[];
    }
    else {
      return [tagsParam];
    }
  }
  catch (error) {
    console.error(error);
    return [];
  }
}

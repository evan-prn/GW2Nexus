import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import type { ChangeEvent, FormEvent } from 'react';
import FormInput from '@/components/auth/FormInputComponent/FormInput';
import ForumBreadcrumb from '@/components/forum/ForumBreadcrumbComponent/ForumBreadcrumb';
import MentionAutocompleteTextarea from '@/components/forum/MentionAutocompleteTextareaComponent/MentionAutocompleteTextarea';
import { useForumCategory } from '@/hooks/forum/useForumCategories';
import { useForumMutations } from '@/hooks/forum/useForumMutations';
import usePageTitle from '@/hooks/usePageTitle';
import type { ForumValidationErrors } from '@/types/forum.types';
import styles from './ForumNewThreadPage.module.css';

type ForumFieldErrors = Partial<Record<keyof ForumValidationErrors, string>>;

export default function ForumNewThreadPage() {
  const navigate = useNavigate();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { category, loading: categoryLoading, error: categoryError } = useForumCategory(categorySlug);
  const { createThread, loading: mutationLoading, error: mutationError, clearError } = useForumMutations();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [fieldErrors, setFieldErrors] = useState<ForumFieldErrors>({});

  usePageTitle(category ? `Nouveau sujet - ${category.name}` : 'Nouveau sujet');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    if (mutationError) clearError();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categorySlug || mutationLoading) return;

    setFieldErrors({});

    const result = await createThread(categorySlug, {
      title: formData.title.trim(),
      content: formData.content.trim(),
    });

    if (!result.success) {
      setFieldErrors(mapFieldErrors(result.errors));
      return;
    }

    if (result.data) {
      navigate(`/forum/thread/${result.data.slug}`);
    }
  };

  const globalError = categoryError ?? mutationError;

  return (
    <section className={styles.page}>
      <ForumBreadcrumb
        items={[
          {
            label: category?.name ?? categorySlug ?? 'Categorie',
            href: categorySlug ? `/forum/${categorySlug}` : undefined,
          },
          { label: 'Nouveau sujet' },
        ]}
      />

      <header className={styles.header}>
        <p className={styles.kicker}>Forum</p>
        <h1 className={styles.title}>Creer un sujet</h1>
        <p className={styles.subtitle}>
          Lance une discussion claire pour aider les aventuriers a te repondre vite et bien.
        </p>
      </header>

      {categoryLoading && <p className={styles.state}>Chargement de la categorie...</p>}

      {globalError && (
        <div className={styles.error} role="alert">
          {globalError}
        </div>
      )}

      {!categoryLoading && !categoryError && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <FormInput
            label="Titre"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={fieldErrors.title}
            placeholder="Ex: Besoin d'aide pour un build gardien"
            maxLength={160}
            required
          />

          <label className={styles.field} htmlFor="content">
            <span className={styles.label}>Message</span>
            <MentionAutocompleteTextarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Detaille ta question, ton contexte ou ton idee... (@ pour mentionner, # pour un objet GW2)"
              minLength={10}
              required
            />
            {fieldErrors.content && <span className={styles.fieldError}>{fieldErrors.content}</span>}
          </label>

          <div className={styles.actions}>
            <Link to={categorySlug ? `/forum/${categorySlug}` : '/forum'} className={styles.cancel}>
              Annuler
            </Link>
            <button type="submit" className={styles.submit} disabled={mutationLoading}>
              {mutationLoading ? 'Creation...' : 'Publier le sujet'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

const mapFieldErrors = (errors: ForumValidationErrors | undefined): ForumFieldErrors => {
  if (!errors) return {};

  return {
    title: errors.title?.[0],
    content: errors.content?.[0],
  };
};

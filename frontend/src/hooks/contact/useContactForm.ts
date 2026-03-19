// ═══════════════════════════════════════════════════════════════════
// src/hooks/contact/useContactForm.ts
// Logique complète du formulaire de contact :
// state, validation Laravel, appel API, gestion erreurs
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import type { AxiosError } from 'axios';

// ─── Types exportés (consommés par ContactForm) ──────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type FormStatus = 'idle' | 'sending' | 'sent' | 'error';

export interface FieldErrors {
  [key: string]: string | null;
}

// ─── Hook ────────────────────────────────────────────────────────────
export function useContactForm() {
  // État du formulaire contrôlé
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Statut global de la soumission
  const [status, setStatus] = useState<FormStatus>('idle');

  // Erreurs par champ (Laravel 422)
  const [errors, setErrors] = useState<FieldErrors>({});

  // Message d'erreur global (429, 500…)
  const [globalError, setGlobalError] = useState('');

  // ─── Mise à jour d'un champ + effacement de son erreur ─────────────
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // On efface l'erreur du champ dès que l'utilisateur resaisit
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // ─── Soumission du formulaire ───────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');
    setStatus('sending');

    try {
      // Récupération du cookie CSRF (Sanctum SPA mode)
      await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

      await axios.post(
        '/api/v1/contact',
        {
          name:    form.name,
          email:   form.email,
          subject: form.subject || 'other',
          message: form.message,
        },
        { withCredentials: true }
      );

      setStatus('sent');

    } catch (err) {
      const axiosErr = err as AxiosError<{
        errors?: Record<string, string[]>;
        message?: string;
      }>;

      // Erreurs de validation champ par champ (Laravel 422)
      if (axiosErr.response?.status === 422) {
        const laravelErrors = axiosErr.response.data.errors ?? {};
        const mapped = Object.fromEntries(
          Object.entries(laravelErrors).map(([field, msgs]) => [field, msgs[0]])
        );
        setErrors(mapped);
        setStatus('idle');
        return;
      }

      // Rate limiting (429)
      if (axiosErr.response?.status === 429) {
        setGlobalError(
          axiosErr.response.data.message ?? 'Trop de messages envoyés.'
        );
        setStatus('error');
        return;
      }

      // Erreur générique
      setGlobalError('Une erreur est survenue. Veuillez réessayer.');
      setStatus('error');
    }
  };

  return { form, status, errors, globalError, handleChange, handleSubmit };
}
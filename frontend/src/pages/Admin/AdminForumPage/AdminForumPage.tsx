import { Link } from 'react-router-dom';
import { useAdminForumReports } from '@/hooks/admin/useAdminForumReports';
import type { AdminForumReport } from '@/types/admin.types';
import styles from './AdminForumPage.module.css';

export default function AdminForumPage() {
  const {
    result,
    loading,
    error,
    filters,
    updateFilter,
    setPage,
    moderateReport,
    toggleThreadLock,
    toggleThreadPin,
  } = useAdminForumReports();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Moderation forum</h1>
        <p className={styles.pageSubtitle}>
          {result?.meta.total ?? 0} signalement{(result?.meta.total ?? 0) !== 1 ? 's' : ''} a examiner
        </p>
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filters.status}
          onChange={(event) => updateFilter('status', event.target.value)}
          aria-label="Filtrer par statut"
        >
          <option value="">Tous les statuts</option>
          <option value="open">Ouverts</option>
          <option value="reviewed">Traites</option>
          <option value="dismissed">Rejetes</option>
        </select>

        <select
          className={styles.select}
          value={filters.reason}
          onChange={(event) => updateFilter('reason', event.target.value)}
          aria-label="Filtrer par motif"
        >
          <option value="">Tous les motifs</option>
          <option value="spam">Spam</option>
          <option value="insult">Insulte</option>
          <option value="harassment">Harcelement</option>
          <option value="inappropriate">Contenu inapproprie</option>
          <option value="other">Autre</option>
        </select>
      </div>

      {loading && <p className={styles.stateMsg}>Chargement des signalements...</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}

      {!loading && result && (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Signalement</th>
                  <th className={styles.th}>Message</th>
                  <th className={styles.th}>Auteur</th>
                  <th className={styles.th}>Sujet</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {result.data.map((report) => (
                  <ReportRow
                    key={report.id}
                    report={report}
                    disabled={loading}
                    onModerate={moderateReport}
                    onToggleLock={toggleThreadLock}
                    onTogglePin={toggleThreadPin}
                  />
                ))}
              </tbody>
            </table>

            {result.data.length === 0 && (
              <div className={styles.emptyState}>
                Aucun signalement trouve pour ces filtres.
              </div>
            )}
          </div>

          {result.meta.last_page > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={filters.page <= 1}
                onClick={() => setPage(filters.page - 1)}
              >
                Precedent
              </button>
              <span className={styles.pageInfo}>
                Page {filters.page} / {result.meta.last_page}
              </span>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={filters.page >= result.meta.last_page}
                onClick={() => setPage(filters.page + 1)}
              >
                Suivant
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface ReportRowProps {
  report: AdminForumReport;
  disabled: boolean;
  onModerate: (reportId: number, status: 'reviewed' | 'dismissed') => Promise<boolean>;
  onToggleLock: (threadId: number) => Promise<boolean>;
  onTogglePin: (threadId: number) => Promise<boolean>;
}

function ReportRow({
  report,
  disabled,
  onModerate,
  onToggleLock,
  onTogglePin,
}: ReportRowProps) {
  return (
    <tr className={styles.tr}>
      <td className={styles.td}>
        <span className={`${styles.badge} ${statusClass(report.status)}`}>{formatStatus(report.status)}</span>
        <p className={styles.reason}>{formatReason(report.reason)}</p>
        <p className={styles.date}>{formatDate(report.created_at)}</p>
        <p className={styles.muted}>Par {report.reporter.nom}</p>
      </td>
      <td className={styles.td}>
        <p className={styles.content}>{report.post.content}</p>
        {report.details && <p className={styles.details}>Details: {report.details}</p>}
      </td>
      <td className={styles.td}>
        <p className={styles.userName}>{report.post.author.nom}</p>
        <p className={styles.muted}>{report.post.author.email}</p>
      </td>
      <td className={styles.td}>
        <p className={styles.threadTitle}>{report.post.thread.title}</p>
        <p className={styles.muted}>{report.post.thread.category.name}</p>
      </td>
      <td className={styles.td}>
        <div className={styles.actions}>
          <Link to={`/forum/thread/${report.post.thread.slug}`} className={styles.actionLink}>
            Voir le sujet
          </Link>
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled}
            onClick={() => onToggleLock(report.post.thread.id)}
          >
            {report.post.thread.is_locked ? 'Deverrouiller' : 'Verrouiller'}
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled}
            onClick={() => onTogglePin(report.post.thread.id)}
          >
            {report.post.thread.is_pinned ? 'Desepingler' : 'Epingler'}
          </button>
          {report.status === 'open' && (
            <>
              <button
                type="button"
                className={styles.successButton}
                disabled={disabled}
                onClick={() => onModerate(report.id, 'reviewed')}
              >
                Marquer traite
              </button>
              <button
                type="button"
                className={styles.mutedButton}
                disabled={disabled}
                onClick={() => onModerate(report.id, 'dismissed')}
              >
                Rejeter
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

const formatReason = (reason: AdminForumReport['reason']): string => {
  const labels: Record<AdminForumReport['reason'], string> = {
    spam: 'Spam',
    insult: 'Insulte',
    harassment: 'Harcelement',
    inappropriate: 'Contenu inapproprie',
    other: 'Autre',
  };

  return labels[reason];
};

const formatStatus = (status: AdminForumReport['status']): string => {
  const labels: Record<AdminForumReport['status'], string> = {
    open: 'Ouvert',
    reviewed: 'Traite',
    dismissed: 'Rejete',
  };

  return labels[status];
};

const statusClass = (status: AdminForumReport['status']): string => {
  if (status === 'open') return styles.badgeRed;
  if (status === 'reviewed') return styles.badgeGreen;
  return styles.badgeMuted;
};

const formatDate = (value: string | null): string => {
  if (!value) return 'Date inconnue';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
};

// ═══════════════════════════════════════════════════════════════════
// src/components/rules/tabs/TabPrivacyComponent/TabPrivacy.tsx
// Contenu de l'onglet Confidentialité (RGPD)
// ═══════════════════════════════════════════════════════════════════

import { PRIVACY_DATA_CATEGORIES, PRIVACY_RIGHTS } from '@/data/rules.data';
import SectionBlock from '@/components/ui/SectionBlockComponent/SectionBlock';
import styles from './TabPrivacy.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function TabPrivacy() {
  return (
    <div className={styles.tab}>

      <SectionBlock number="01" title="Introduction">
        <p>
          GW2Nexus accorde une importance capitale à la protection de vos données personnelles.
          Cette politique décrit quelles données sont collectées, pourquoi et comment,
          conformément au <strong>RGPD</strong> et à la loi Informatique et Libertés.
        </p>
        <p>
          Questions : <a href="mailto:privacy@gw2nexus.fr">privacy@gw2nexus.fr</a>
        </p>
      </SectionBlock>

      <SectionBlock number="02" title="Données collectées" delay={60}>
        <p>GW2Nexus collecte uniquement les données nécessaires au fonctionnement du service :</p>

        {/* Grille des catégories de données */}
        <div className={styles.dataGrid}>
          {PRIVACY_DATA_CATEGORIES.map((cat) => (
            <div key={cat.label} className={styles.dataCard}>
              <div className={styles.dataHead}>
                <span className={styles.dataIcon}>{cat.icon}</span>
                <span className={styles.dataLabel}>{cat.label}</span>
              </div>
              <ul className={styles.dataList}>
                {cat.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Callout clé API */}
        <div className={styles.callout}>
          <span className={styles.calloutIcon}>✦</span>
          <div>
            <div className={styles.calloutTitle}>Clé API GW2 — protection renforcée</div>
            <p>
              Votre clé API est chiffrée en base de données via <strong>AES-256</strong> (fonction
              <code> encrypt()</code> Laravel) avant stockage. Elle n'est jamais exposée
              en clair dans les réponses API ni dans les logs serveur.
            </p>
          </div>
        </div>
      </SectionBlock>

      <SectionBlock number="03" title="Finalités du traitement" delay={120}>
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul className={styles.list}>
          <li>Gérer votre compte et authentifier vos connexions</li>
          <li>Afficher vos données GW2 sur votre profil public</li>
          <li>Publier vos discussions, builds et commentaires</li>
          <li>Envoyer des emails transactionnels (vérification, réinitialisation mot de passe)</li>
          <li>Assurer la sécurité et la modération de la plateforme</li>
        </ul>
        <p>
          GW2Nexus <strong>ne vend pas</strong> vos données et ne les partage avec
          aucun tiers à des fins publicitaires.
        </p>
      </SectionBlock>

      <SectionBlock number="04" title="Conservation des données" delay={180}>
        <p>
          Vos données sont conservées tant que votre compte est actif. En cas de suppression
          de compte, les données personnelles sont anonymisées sous <strong>30 jours</strong>.
          Les contenus publiés (discussions, builds) peuvent être conservés sous forme
          anonymisée pour maintenir la cohérence du forum.
        </p>
        <p>
          Les logs serveur sont conservés <strong>12 mois maximum</strong> à des fins de sécurité.
        </p>
      </SectionBlock>

      <SectionBlock number="05" title="Vos droits (RGPD)" delay={240}>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>

        {/* Liste des droits RGPD */}
        <div className={styles.rightsList}>
          {PRIVACY_RIGHTS.map((r) => (
            <div key={r.right} className={styles.rightRow}>
              <span className={styles.rightIcon}>{r.icon}</span>
              <span className={styles.rightName}>{r.right}</span>
              <span className={styles.rightDesc}>{r.desc}</span>
            </div>
          ))}
        </div>

        <p className={styles.rgpdFooter}>
          Pour exercer ces droits : <a href="mailto:privacy@gw2nexus.fr">privacy@gw2nexus.fr</a>.
          En cas de litige, vous pouvez saisir la{' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">CNIL</a>.
        </p>
      </SectionBlock>

    </div>
  );
}
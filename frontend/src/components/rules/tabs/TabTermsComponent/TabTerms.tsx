// ═══════════════════════════════════════════════════════════════════
// src/components/rules/tabs/TabTermsComponent/TabTerms.tsx
// Contenu de l'onglet Conditions Générales d'Utilisation
// ═══════════════════════════════════════════════════════════════════

import { TERMS_RULES_BLOCKS } from '@/data/rules.data';
import SectionBlock from '@/components/ui/SectionBlockComponent/SectionBlock';
import styles from './TabTerms.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function TabTerms() {
  return (
    <div className={styles.tab}>

      <SectionBlock number="01" title="Acceptation des conditions">
        <p>
          En accédant à GW2Nexus et en créant un compte, vous acceptez sans réserve
          les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces
          conditions, veuillez ne pas utiliser le service.
        </p>
        <p>
          GW2Nexus se réserve le droit de modifier ces CGU à tout moment.
          Les utilisateurs seront notifiés par email des modifications substantielles.
        </p>
      </SectionBlock>

      <SectionBlock number="02" title="Inscription et compte" delay={60}>
        <p>
          Pour accéder aux fonctionnalités complètes, vous devez créer un compte avec
          une adresse email valide et un mot de passe sécurisé. Vous êtes seul responsable
          de la confidentialité de vos identifiants.
        </p>
        <ul className={styles.list}>
          <li>Un seul compte par personne est autorisé</li>
          <li>Vous devez avoir 13 ans minimum pour vous inscrire</li>
          <li>Les informations fournies doivent être exactes</li>
          <li>Toute tentative de création de comptes multiples peut entraîner un bannissement</li>
        </ul>
      </SectionBlock>

      <SectionBlock number="03" title="Règles de conduite" delay={120}>
        <p>
          GW2Nexus est une communauté dédiée aux joueurs de Guild Wars 2.
          Tout utilisateur s'engage à respecter les règles suivantes :
        </p>

        {/* Grille autorisé / interdit */}
        <div className={styles.rulesGrid}>
          {TERMS_RULES_BLOCKS.map((block) => (
            <div
              key={block.type}
              className={`${styles.rulesBlock} ${
                block.type === 'allowed' ? styles.rulesAllowed : styles.rulesForbidden
              }`}
            >
              <div className={styles.rulesHead}>
                <span className={styles.rulesIcon}>{block.icon}</span>
                <span className={styles.rulesTitle}>{block.title}</span>
              </div>
              <ul className={styles.rulesList}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock number="04" title="Contenu utilisateur" delay={180}>
        <p>
          Vous êtes entièrement responsable des contenus que vous publiez (discussions,
          commentaires, builds). GW2Nexus se réserve le droit de supprimer tout contenu
          enfreignant ces CGU, sans préavis.
        </p>
        <p>
          En publiant du contenu, vous certifiez en être l'auteur ou disposer des droits
          nécessaires, et accordez à GW2Nexus une licence d'affichage gratuite et non-exclusive.
        </p>
      </SectionBlock>

      <SectionBlock number="05" title="Modération" delay={240}>
        <p>L'équipe GW2Nexus peut à tout moment, sans préavis ni justification :</p>
        <ul className={styles.list}>
          <li>Supprimer ou modifier tout contenu enfreignant ces CGU</li>
          <li>Suspendre temporairement ou définitivement un compte</li>
          <li>Restreindre l'accès à certaines fonctionnalités</li>
        </ul>
        <p>
          Les décisions de modération peuvent être contestées par email à{' '}
          <a href="mailto:moderation@gw2nexus.fr">moderation@gw2nexus.fr</a>.
        </p>
      </SectionBlock>

      <SectionBlock number="06" title="Utilisation de l'API GW2" delay={300}>
        <p>
          L'utilisation de la clé API Guild Wars 2 sur GW2Nexus est soumise aux conditions
          d'ArenaNet. Vous ne devez fournir que votre propre clé API. GW2Nexus n'utilise
          la clé API qu'avec votre consentement explicite, uniquement pour les endpoints
          nécessaires à l'affichage de vos données.
        </p>
        <p>
          GW2Nexus respecte les limites de taux (rate limits) imposées par l'API ArenaNet
          et met en cache les réponses pour minimiser les appels.
        </p>
      </SectionBlock>

      <SectionBlock number="07" title="Résiliation" delay={360}>
        <p>
          Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre
          profil. La suppression entraîne l'anonymisation de vos données dans un délai de
          30 jours conformément à notre politique de confidentialité.
        </p>
        <p>
          GW2Nexus peut résilier votre accès en cas de violation grave et répétée des
          présentes CGU, sans obligation de remboursement.
        </p>
      </SectionBlock>

    </div>
  );
}
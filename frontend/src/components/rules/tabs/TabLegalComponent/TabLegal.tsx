// ═══════════════════════════════════════════════════════════════════
// src/components/rules/tabs/TabLegalComponent/TabLegal.tsx
// Contenu de l'onglet Mentions Légales
// ═══════════════════════════════════════════════════════════════════

import SectionBlock from '@/components/ui/SectionBlockComponent/SectionBlock';
import styles from './TabLegal.module.css';

// ─── Composant ───────────────────────────────────────────────────────
export default function TabLegal() {
  return (
    <div className={styles.tab}>

      <SectionBlock number="01" title="Éditeur du site">
        <p>
          Le site <strong>GW2Nexus</strong> (accessible à l'adresse <strong>gw2nexus.fr</strong>)
          est édité par une équipe de développeurs indépendants dans le cadre d'un projet
          communautaire open source dédié au jeu vidéo Guild Wars 2.
        </p>
        <p>
          <strong>Responsables de publication :</strong> Les membres de l'équipe GW2Nexus,
          joignables via <a href="mailto:contact@gw2nexus.fr">contact@gw2nexus.fr</a>.
        </p>
        <p>
          <strong>Code source :</strong>{' '}
          <a href="https://github.com/evan-prn/GW2Nexus" target="_blank" rel="noreferrer">
            github.com/evan-prn/GW2Nexus
          </a>
        </p>
      </SectionBlock>

      <SectionBlock number="02" title="Hébergement" delay={60}>
        <p>
          GW2Nexus est hébergé sur un serveur privé virtuel (VPS) sous Ubuntu 24 LTS,
          avec Nginx comme serveur web et PHP-FPM 8.3 pour l'exécution du backend Laravel.
          Les données sont stockées dans une base MySQL 8 avec sauvegardes quotidiennes.
        </p>
      </SectionBlock>

      <SectionBlock number="03" title="Propriété intellectuelle" delay={120}>
        <p>
          Le code source est publié sous licence open source (voir fichier <strong>LICENSE</strong> sur GitHub).
        </p>
        <p>
          Guild Wars 2, ArenaNet et tous les éléments du jeu sont la propriété exclusive
          d'<strong>ArenaNet, LLC</strong> et <strong>NCSoft Corporation</strong>. GW2Nexus n'est pas
          affilié à ArenaNet et utilise l'API officielle dans le respect des{' '}
          <a href="https://www.guildwars2.com/en/legal/guild-wars-2-content-terms-of-use/" target="_blank" rel="noreferrer">
            conditions d'utilisation du contenu GW2
          </a>.
        </p>
        <p>
          Les contributions des utilisateurs (discussions, builds, commentaires) restent
          la propriété de leurs auteurs. En publiant du contenu, l'utilisateur accorde
          à GW2Nexus une licence d'affichage non-exclusive et gratuite.
        </p>
      </SectionBlock>

      <SectionBlock number="04" title="Limitation de responsabilité" delay={180}>
        <p>
          GW2Nexus est fourni <strong>« en l'état »</strong>, sans garantie de disponibilité continue.
          L'équipe ne peut être tenue responsable des interruptions liées à la maintenance
          ou à des incidents techniques imprévus.
        </p>
        <p>
          Les données issues de l'API Guild Wars 2 sont affichées à titre informatif.
          GW2Nexus décline toute responsabilité en cas d'indisponibilité de l'API ArenaNet.
        </p>
        <p>
          GW2Nexus n'est pas responsable des contenus publiés par les utilisateurs.
          Un système de signalement est disponible pour tout contenu inapproprié.
        </p>
      </SectionBlock>

      <SectionBlock number="05" title="Cookies" delay={240}>
        <p>
          GW2Nexus utilise uniquement des cookies essentiels au fonctionnement de
          l'authentification (Laravel Sanctum, mode SPA cookie) : cookie de session
          et token CSRF. Ces cookies ne servent pas au tracking publicitaire.
        </p>
      </SectionBlock>

      <SectionBlock number="06" title="Droit applicable" delay={300}>
        <p>
          Les présentes mentions légales sont soumises au droit français.
          En cas de litige, les tribunaux français seront seuls compétents.
          Contact : <a href="mailto:legal@gw2nexus.fr">legal@gw2nexus.fr</a>
        </p>
      </SectionBlock>

    </div>
  );
}
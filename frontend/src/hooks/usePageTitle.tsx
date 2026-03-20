// src/hooks/usePageTitle.ts
import {Helmet} from 'react-helmet-async'

const APP_NAME = 'GW2Nexus'

function PageTitle({ title }: { title?: string }) {
  return (
    <Helmet>
      <title>{title ? `${title} — ${APP_NAME}` : APP_NAME}</title>
    </Helmet>
  )
}

export default PageTitle;
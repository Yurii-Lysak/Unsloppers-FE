import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DASHBOARD_ALL_PROJECTS_VALUE,
  DASHBOARD_UNASSIGNED_PROJECT_ID,
  type DashboardSelectorProject,
} from '@/types/dashboard'

interface ProjectSelectorProps {
  projects: DashboardSelectorProject[]
  value?: string
  onChange: (projectId?: string) => void
}

export const ProjectSelector = ({ projects, value, onChange }: ProjectSelectorProps) => {
  const { t } = useTranslation()
  const selectValue = value ?? DASHBOARD_ALL_PROJECTS_VALUE

  return (
    <div className="max-w-sm" data-testid="dashboard-project-selector">
      <Select
        value={selectValue}
        onValueChange={nextValue => {
          if (nextValue === DASHBOARD_ALL_PROJECTS_VALUE) {
            onChange(undefined)
            return
          }
          onChange(nextValue)
        }}
      >
        <SelectTrigger
          aria-label={t('dashboard.projectSelector.label')}
          data-testid="dashboard-project-selector-trigger"
        >
          <SelectValue placeholder={t('dashboard.projectSelector.allProjects')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DASHBOARD_ALL_PROJECTS_VALUE}>
            {t('dashboard.projectSelector.allProjects')}
          </SelectItem>
          {projects.map(project => (
            <SelectItem key={project.projectId} value={project.projectId}>
              {project.projectName}
            </SelectItem>
          ))}
          <SelectItem value={DASHBOARD_UNASSIGNED_PROJECT_ID}>
            {t('dashboard.projectSelector.unassigned')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

import { useSearchParams } from 'react-router-dom';
import { TabsContainer, Tab } from '../components/ui/Tabs';
import { InstitutionTable } from '../components/table/InstitutionTable';
import { InstitutionEnrollmentTable } from '../components/table/InstitutionEnrollmentTable';
import { InstitutionReportGenerator } from '../components/report/InstitutionReportGenerator';
import { List, NotebookPen, FileChartColumn } from 'lucide-react';
import { useState } from 'react';

type ActiveTab = 'all' | 'enrollments' | 'reports';

const getValidTab = (tab: string | null): ActiveTab => {
  if (tab === 'enrollments' || tab === 'reports') {
    return tab;
  }
  return 'all';
};

export const InstitutionsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = getValidTab(searchParams.get('tab'));

  const [institutionsCount, setInstitutionsCount] = useState<number>();
  const [enrollmentsCount, setEnrollmentsCount] = useState<number>();

  const editionYear = localStorage.getItem("edition");
  const showEnrollmentsTab = editionYear && editionYear !== 'all';

  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tab });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <TabsContainer>
        <Tab
          label="Todas"
          isActive={activeTab === 'all'}
          onClick={() => handleTabChange('all')}
          icon={<List size={16} />}
          count={institutionsCount}
        />
        {showEnrollmentsTab && (
          <Tab
            label="Inscrições"
            isActive={activeTab === 'enrollments'}
            onClick={() => handleTabChange('enrollments')}
            icon={<NotebookPen size={16} />}
            count={enrollmentsCount}
          />
        )}
        <Tab
          label="Relatórios"
          isActive={activeTab === 'reports'}
          onClick={() => handleTabChange('reports')}
          icon={<FileChartColumn size={16} />}
        />
      </TabsContainer>

      <div>
        {activeTab === 'all' && (
          <InstitutionTable onCountChange={setInstitutionsCount} />
        )}
         {activeTab === 'enrollments' && showEnrollmentsTab && (
          <InstitutionEnrollmentTable
            onCountChange={setEnrollmentsCount}
            editionYear={editionYear} 
          />
        )}
        {activeTab === 'reports' && (
          <InstitutionReportGenerator />
        )}
      </div>
    </div>
  );
};
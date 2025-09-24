import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabsContainer, Tab } from '../components/Tabs';
import { InstitutionTable } from '../components/table/InstitutionTable';
import { EnrollmentInstitutionTable } from '../components/table/EnrollmentInstitutionTable';
import { InstitutionReportGenerator } from '../components/report/InstitutionReportGenerator';
import { List, NotebookPen, FileChartColumn } from 'lucide-react';

type ActiveTab = 'all' | 'enrollments' | 'reports';

const getValidTab = (tab: string | null): ActiveTab => {
  if (tab === 'enrollments' || tab === 'reports') {
    return tab;
  }
  return 'all';
};

export const InstitutionsPage = () => {
  const [editionYear, setEditionYear] = useState(() => localStorage.getItem("edition"));
  const [isEditionActive, setIsEditionActive] = useState<boolean>(
    () => localStorage.getItem("editionIsActive") === 'true'
  );


  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = getValidTab(searchParams.get('tab'));

  const [institutionsCount, setInstitutionsCount] = useState<number>();
  const [enrollmentsCount, setEnrollmentsCount] = useState<number>();

  useEffect(() => {
    const handleEditionChange = () => {
      if (activeTab !== 'all') {
        setInstitutionsCount(undefined);
      }
      if (activeTab !== 'enrollments') {
        setEnrollmentsCount(undefined);
      }
      const newEdition = localStorage.getItem("edition");
      const newIsActive = localStorage.getItem("editionIsActive") === 'true';

      const shouldHideEnrollmentsTab = !newEdition || newEdition === 'all';
      if (activeTab === 'enrollments' && shouldHideEnrollmentsTab) {
        setSearchParams({});
      }

      setEditionYear(newEdition);
      setIsEditionActive(newIsActive);
    };

    window.addEventListener('editionChange', handleEditionChange);

    return () => {
      window.removeEventListener('editionChange', handleEditionChange);
    };
  }, [activeTab, setSearchParams]);


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
          <EnrollmentInstitutionTable
            onCountChange={setEnrollmentsCount}
            editionYear={editionYear}
            isEditionActive={isEditionActive}
          />
        )}
        {activeTab === 'reports' && (
          <InstitutionReportGenerator />
        )}
      </div>
    </div>
  );
};
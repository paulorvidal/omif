
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabsContainer, Tab } from '../components/Tabs';
import { StudentTable } from '../components/table/StudentTable';
import { EnrollmentStudentTable } from '../components/table/EnrollmentStudentTable';
import { List, NotebookPen, FileChartColumn } from 'lucide-react';

type ActiveTab = 'all' | 'enrollments' | 'reports';

const getValidTab = (tab: string | null): ActiveTab => {
  if (tab === 'enrollments' || tab === 'reports') {
    return tab;
  }
  return 'all';
};

export const StudentsPage = () => {
  const [editionYear, setEditionYear] = useState(() => localStorage.getItem("edition"));
  const [isEditionActive, setIsEditionActive] = useState<boolean>(
    () => localStorage.getItem("editionIsActive") === 'true'
  );

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = getValidTab(searchParams.get('tab'));

  const [studentsCount, setStudentsCount] = useState<number>();
  const [enrollmentsCount, setEnrollmentsCount] = useState<number>();

  useEffect(() => {
    const handleEditionChange = () => {
      if (activeTab !== 'all') {
        setStudentsCount(undefined);
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
          label="Todos"
          isActive={activeTab === 'all'}
          onClick={() => handleTabChange('all')}
          icon={<List size={16} />}
          count={studentsCount}
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
          <StudentTable
            onCountChange={setStudentsCount}
          />
        )}
        {activeTab === 'enrollments' && showEnrollmentsTab && (
          <EnrollmentStudentTable
            onCountChange={setEnrollmentsCount}
            editionYear={editionYear}
            isEditionActive={isEditionActive}
          />
        )}
        {activeTab === 'reports' && (
          <div>nada</div>
        )}
      </div>
    </div>
  );
};
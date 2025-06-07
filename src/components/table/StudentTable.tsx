import {
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
} from "@table-library/react-table-library/table";

const data = {
  nodes: [
    { id: "1", name: "Estudar React", isComplete: false },
    { id: "2", name: "Comprar pão", isComplete: true },
    { id: "3", name: "Escrever e-mail", isComplete: false },
  ],
};

export const StudentTable = () => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
      <Table data={data}>
        {(tableList) => (
          <>
            <Header>
              <HeaderRow className="bg-gray-100 text-sm text-gray-800 uppercase">
                <HeaderCell className="px-4 py-2 text-left font-semibold">
                  Tarefa
                </HeaderCell>
                <HeaderCell className="px-4 py-2 text-left font-semibold">
                  Concluída
                </HeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item) => (
                <Row
                  key={item.id}
                  item={item}
                  className="border-t border-gray-200 transition hover:bg-gray-50"
                >
                  <Cell className="px-4 py-2 text-gray-800">{item.name}</Cell>
                  <Cell className="px-4 py-2 text-gray-600">
                    {item.isComplete ? "Sim" : "Não"}
                  </Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
};

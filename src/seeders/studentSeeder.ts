import axios from "axios";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { cpf as cpfUtils } from "cpf-cnpj-validator";

const TOTAL_STUDENTS = 1000;

const auxilioBrasilOptions = ["Sim", "Não", "Prefiro não responder"];
const gradeOptions = [1, 2, 3];
const ethnicityOptions = [
  "Branco",
  "Pardo",
  "Preto",
  "Amarelo",
  "Indigena",
  "Prefiro não responder",
];
const genderOptions = [
  "Feminino",
  "Masculino",
  "Outro",
  "Prefiro não responder",
];
const schoolOptions = [
  "Escola pública municipal",
  "Escola pública estadual",
  "Escola particular",
  "Parte em escola pública parte em escola particular",
  "Supletivo",
  "Prefiro não responder",
];
const incomeRangeOptions = [
  "Até meio salário mínimo",
  "De meio a um salário mínimo",
  "De um a dois salários mínimos",
  "De dois a três salários mínimos",
  "Acima de três salários mínimos",
  "Prefiro não responder",
];

async function seedStudents() {
  for (let i = 0; i < TOTAL_STUDENTS; i++) {
    const gender = faker.helpers.arrayElement(genderOptions);

    const student = {
      email: faker.internet.email().toLowerCase(),
      password: "SenhaForte123",
      name: faker.person.fullName({
        sex: gender === "Masculino" ? "male" : "female",
      }),
      motherName: faker.person.fullName({ sex: "female" }),
      birthDate: faker.date
        .birthdate({ min: 14, max: 18, mode: "age" })
        .toISOString()
        .split("T")[0],
      auxilioBrasil: faker.helpers.arrayElement(auxilioBrasilOptions),
      grade: faker.helpers.arrayElement(gradeOptions),
      elementarySchoolCompletionPlace:
        faker.helpers.arrayElement(schoolOptions),
      incomeRange: faker.helpers.arrayElement(incomeRangeOptions),
      ethnicity: faker.helpers.arrayElement(ethnicityOptions),
      socialName: faker.person.fullName(),
      cpf: cpfUtils.generate(),
      gender,
      institutionId: "03ce4af9-edeb-4586-b68d-c18d04a76c6a",
    };

    try {
      await axios.post("http://89.116.73.16:8080/students", student);
      console.log(`✅ Estudante ${student.name} criado com sucesso!`);
    } catch (err: any) {
      console.error(
        `❌ Erro ao criar estudante ${student.name}:`,
        err.response?.data || err.message,
      );
    }
  }
}

seedStudents();

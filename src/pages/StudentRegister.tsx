import { useForm } from 'react-hook-form';
import { H1 } from '../components/ui/H1';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { createStudent } from '../services/studentService';
import type { CreateStudentRequest } from '../services/studentService';


type FormData = CreateStudentRequest & { confirmPassword: string };

export const StudentRegister = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { socialName: '' }
  });

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    const { confirmPassword, ...payload } = data;
    try {
      const response = await createStudent(payload);
      console.log('Estudante criado com sucesso:', response);
      // você pode resetar o form aqui se quiser
    } catch (err: any) {
      console.error('Erro ao criar estudante:', err.response || err);
    }
  };

  return (
    <div>
      <H1>Cadastro de Estudante</H1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Nome</Label>
          <Input
            type="text"
            {...register('name', { required: 'O nome é obrigatório' })}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            {...register('email', {
              required: 'O email é obrigatório',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email inválido',
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <Label>Cpf</Label>
          <Input
            type="cpf"
            {...register('cpf', {
              required: 'O cpf é obrigatório',
            })}
          />
          {errors.cpf && (
            <span className="text-red-500 text-sm">
              {errors.cpf.message}
            </span>
          )}
        </div>

        <div>
          <Label>Senha</Label>
          <Input
            type="password"
            {...register('password', {
              required: 'A senha é obrigatória',
              minLength: {
                value: 6,
                message: 'A senha deve ter no mínimo 6 caracteres',
              },
              validate: (value) => 
                !/\s/.test(value) || 'A senha não pode conter espaços em branco',
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div>
          <Label>Confirmar Senha</Label>
          <Input
            type="password"
            {...register('confirmPassword', {
              required: 'Confirme sua senha',
              validate: (value) =>
                value === password || 'As senhas não coincidem',
            })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div>
          <Label>Nome da mãe</Label>
          <Input
            type="text"
            {...register('motherName', { required: 'O nome da mãe é obrigatório' })}
          />
          {errors.motherName && (
            <span className="text-red-500 text-sm">
              {errors.motherName.message}
            </span>
          )}
        </div>

        <div>
          <Label>Data de Nascimento</Label>
          <Input
            type="date"
            {...register('birthDate', {
              required: 'A data de nascimento é obrigatória',
              validate: (value) => {
                const today = new Date();
                const birthDate = new Date(value);
                if (birthDate > today) {
                  return 'A data de nascimento não pode ser no futuro';
                }
                return true;
              },
            })}
          />
          {errors.birthDate && (
            <span className="text-red-500 text-sm">
              {errors.birthDate.message}
            </span>
          )}
        </div>
        
        <div>
          <Label>Sua família é beneficiária do Bolsa Família?</Label>
          <select
            {...register('auxilioBrasil', { required: 'Esse campo é obrigatório' })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Selecione uma opção</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
            <option value="prefiro_nao_responder">Prefiro não responder</option>
          </select>
          
          {errors.auxilioBrasil && (
            <span className="text-red-500 text-sm">
              {errors.auxilioBrasil.message}
            </span>
          )}
        </div>

        <div>
          <Label>Série</Label>
          <select
            {...register('grade', { required: 'A série é obrigatória' })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Selecione a série</option>
            <option value={1}>1º ano</option>
            <option value={2}>2º ano</option>
            <option value={3}>3º ano</option>
            <option value={4}>4º ano</option>
          </select>

          {errors.grade && (
            <span className="text-red-500 text-sm">
              {errors.grade.message}
            </span>
          )}
        </div>
        
        <div>
          <Label>Você se considera</Label>
          <select
            {...register('ethnicity', { required: 'Esse campo é obrigatório' })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Selecione uma opção</option>
            <option value="Branco">Branco</option>
            <option value="Pardo">Pardo</option>
            <option value="Preto">Preto</option>
            <option value="Amarelo">Amarelo</option>
            <option value="Indigena">Indigena</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>
          
          {errors.ethnicity && (
            <span className="text-red-500 text-sm">
              {errors.ethnicity.message}
            </span>
          )}
        </div>

        <div>
          <Label>Gênero</Label>
          <select
            {...register('gender', { required: 'Esse campo é obrigatório' })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Selecione uma opção</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Masculino</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>
          
          {errors.gender && (
            <span className="text-red-500 text-sm">
              {errors.gender.message}
            </span>
          )}
        </div>

        <div>
          <Label>Onde você realizou seus estudos de ensino fundamental ou equivalente</Label>
          <select
            {...register('elementarySchoolCompletionPlace', { required: 'Esse campo é obrigatório' })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Selecione uma opção</option>
            <option value="Escola pública municipal">Escola pública municipal</option>
            <option value="Escola pública estadual">Escola pública estadual</option>
            <option value="Escola particular">Escola particular</option>
            <option value="Parte em escola pública parte em escola particular">Parte em escola pública parte em escola particular</option>
            <option value="Supletivo">Supletivo</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>
          
          {errors.elementarySchoolCompletionPlace && (
            <span className="text-red-500 text-sm">
              {errors.elementarySchoolCompletionPlace.message}
            </span>
          )}
        </div>

        <div>
          <Label>Em qual faixa de renda per capita sua família se encontra</Label>
          <select
            {...register('incomeRange', { required: 'Esse campo é obrigatório' })}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="">Selecione uma opção</option>
            <option value="Até meio salário mínimo">até meio salário mínimo</option>
            <option value="De meio a um salário mínimo">de um a meio salário mínimo</option>
            <option value="De um a dois salários mínimos">de um a dois salários mínimos</option>
            <option value="De dois a três salários mínimos">de dois a três salários mínimos</option>
            <option value="Acima de três salários mínimos">acima de três salários mínimos</option>
            <option value="Prefiro não responder">Prefiro não responder</option>
          </select>
          
          {errors.incomeRange && (
            <span className="text-red-500 text-sm">
              {errors.incomeRange.message}
            </span>
          )}
        </div>

        


        <Button type="submit">Cadastrar</Button>
      </form>
    </div>
  );
};

import { describe, it, expect } from 'vitest';

import { useFormRules } from '../../composables/useFormRules';

describe('useFormRules', () => {
  const { schema1, schema2 } = useFormRules();

  describe('schema1', () => {
    it('should be a valid fullname', async () => {
      const result = await schema1.validateAt('fullname', {
        fullname: 123456,
      });

      expect(result).toBeTruthy();
    });

    it('should be a invalid fullname', async () => {
      const invalidValues = [123, 'abc', true, {}, null, undefined];

      let result;

      for (const value of invalidValues) {
        try {
          await schema1.validateAt('fullname', {
            fullname: value,
          });
        } catch (error) {
          result = false;
          break;
        }
      }

      expect(result).toBeFalsy();
    });

    it('should be a valid email', async () => {
      const result = await schema1.validateAt('email', {
        email: '123456@email.com',
      });

      expect(result).toBeTruthy();
    });

    it('should be a invalid email', async () => {
      const invalidValues = [123, 'abc', true, {}, null, undefined];

      let result;

      for (const value of invalidValues) {
        try {
          await schema1.validateAt('email', {
            email: value,
          });
        } catch (error) {
          result = false;
          break;
        }
      }

      expect(result).toBeFalsy();
    });

    it('should be a valid cpf', async () => {
      const result = await schema1.validateAt('cpf', {
        cpf: '450.936.490-31',
      });

      expect(result).toBeTruthy();
    });

    it(`should reject, because it's an invalid cpf`, async () => {
      const invalidValues = [123, 123456789, 'abc', true, {}, null, undefined];

      let result;

      for (const value of invalidValues) {
        try {
          await schema1.validateAt('email', {
            email: value,
          });
        } catch (error) {
          result = false;
          break;
        }
      }

      expect(result).toBeFalsy();
    });
  });

  describe('schema2', () => {
    it(`should be a valid role: 'professor'`, async () => {
      const result = await schema2.validateAt('yourRole', {
        yourRole: 'professor',
      });

      expect(result).toBeTruthy();
    });

    it(`should be a valid role: 'aluno'`, async () => {
      const result = await schema2.validateAt('yourRole', {
        yourRole: 'aluno',
      });

      expect(result).toBeTruthy();
    });

    it(`should throw an error, because it's an empty object`, async () => {
      try {
        await schema2.validateAt('yourRole', {
          // empyt object
        });
      } catch (error: any) {
        expect(error.message).toEqual('Tipo de Usuário é necessário');
      }
    });

    it(`should throw an error, because that role doesn't exist`, async () => {
      try {
        await schema2.validateAt('yourRole', {
          yourRole: 'colaborator',
        });
      } catch (error: any) {
        expect(error.message).toEqual(
          'yourRole must be one of the following values: professor, aluno',
        );
      }
    });

    it(`should be a valid institution`, async () => {
      const result = await schema2.validateAt('institution', {
        institution: 123456789,
      });
      expect(result).toBeTruthy();
    });

    it(`should be a invalid institution`, async () => {
      const invalidValues = [123, 'abc', true, {}, null, undefined];

      let result;

      for (const value of invalidValues) {
        try {
          await schema1.validateAt('email', {
            email: value,
          });
        } catch (error) {
          result = false;
          break;
        }
      }

      expect(result).toBeFalsy();
    });
  });
});

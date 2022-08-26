import { Identifier, LetStatement, Program } from '../src/ast/ast'
import { Token, tt } from '../src/token/token'

// let myVar = anotherVar;
test('ast toString', () => {
  const nameIdent = new Identifier(
    new Token(tt.IDENT, 'myVar'),
    'myVar'
  )
  const valueIdent = new Identifier(
    new Token(tt.IDENT, 'anotherVar'),
    'anotherVar'
  )

  const letStmt = new LetStatement()
  letStmt.name = nameIdent
  letStmt.value = valueIdent
  letStmt.token = new Token(tt.LET, 'let')

  const program = new Program()
  program.statements = [letStmt]
  console.log(program.toString())

  expect(program.toString()).toBe('let myVar = anotherVar;')
})

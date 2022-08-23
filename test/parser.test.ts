import { Lexer } from "../src/lexer/lexer";
import { Parser } from "../src/parser/parser";
import { LetStatement, ReturnStatement, Statement } from "../src/ast/ast";

function testLetStatement(stmt: Statement, name: string) {
  expect(stmt.tokenLiteral()).toBe("let");

  const s = stmt as LetStatement;
  expect(s.name.value).toBe(name);
  expect(s.name.tokenLiteral()).toBe(name);

  return true;
}

function checkParserErrors(p: Parser) {
  const errors = p.errors;
  for (const e of errors) {
    console.log(`parser error: ${e}`);
  }
}

test("parser-let-statement", () => {
  const input = `
  let x = 5;
  let y = 10;
  let foobar = 838383;
  `;

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program = p.parseProgram();
  checkParserErrors(p);

  expect(program).not.toBe(null);
  expect(program.statements.length).toBe(3);

  const expectedIdentifier = ["x", "y", "foobar"];
  expectedIdentifier.forEach((identifier, index) => {
    const stmt = program.statements[index];
    if (!testLetStatement(stmt, identifier)) {
      return;
    }
  });
});

test("parser-return-statement", () => {
  const input = `
    return 5;
    return 10;
    return 993322;
  `;

  const l: Lexer = new Lexer(input);
  const p: Parser = new Parser(l);

  const program = p.parseProgram();
  checkParserErrors(p);

  expect(program).not.toBe(null);
  expect(program.statements.length).toBe(3);

  program.statements.forEach((stmt, index) => {
    const returnStmt = stmt as ReturnStatement;
    expect(returnStmt.tokenLiteral()).toBe("return");
  });
});
